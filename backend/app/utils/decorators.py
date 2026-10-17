"""
Custom decorators for role-based access control.
"""
from functools import wraps
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.utils.responses import error_response


def role_required(role_name: str):
    """
    Decorator that enforces role-based access control.

    Requires a valid JWT (via @jwt_required) and checks that the
    current user's role matches `role_name`. Returns 403 if not.

    Usage:
        @role_required('admin')
        def admin_only_view():
            ...
    """
    def decorator(fn):
        @wraps(fn)
        @jwt_required()
        def wrapper(*args, **kwargs):
            from app.models.user import User
            from app.extensions import db
            user_id = get_jwt_identity()
            try:
                user_id = int(user_id)
            except (ValueError, TypeError):
                return error_response('Invalid user identity in token', status_code=401)
            user = db.session.get(User, user_id)

            if not user:
                return error_response('User not found', status_code=401)

            if not user.is_active:
                return error_response('Account is deactivated', status_code=401)

            if not user.role or user.role.name != role_name:
                return error_response(
                    'Insufficient permissions',
                    errors={'required_role': role_name},
                    status_code=403,
                )

            return fn(*args, **kwargs)
        return wrapper
    return decorator
