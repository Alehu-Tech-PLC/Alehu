"""User management routes — CRUD operations with RBAC."""
from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from marshmallow import ValidationError

from app.schemas.user_schema import UserSchema, UserCreateSchema, UserUpdateSchema
from app.services.user_service import UserService
from app.utils.decorators import role_required
from app.utils.responses import success_response, error_response

users_bp = Blueprint('users', __name__)

user_schema = UserSchema()
users_schema = UserSchema(many=True)
user_create_schema = UserCreateSchema()
user_update_schema = UserUpdateSchema()


@users_bp.route('', methods=['GET'])
@role_required('admin')
def get_users():
    """List all users (paginated, admin only)."""
    result = UserService.get_all()
    return success_response(
        data={
            'users': users_schema.dump(result['items']),
            'pagination': {
                'page': result['page'],
                'per_page': result['per_page'],
                'total': result['total'],
                'pages': result['pages'],
            },
        },
        message='Users retrieved successfully',
        status_code=200,
    )


@users_bp.route('', methods=['POST'])
@role_required('admin')
def create_user():
    """Create a new user directly (admin only)."""
    json_data = request.get_json() or {}
    try:
        data = user_create_schema.load(json_data)
    except ValidationError as err:
        return error_response('Validation error', errors=err.messages, status_code=422)

    try:
        user = UserService.create(data)
    except ValidationError as err:
        return error_response('Validation error', errors=err.messages, status_code=422)

    return success_response(
        data={'user': user_schema.dump(user)},
        message='User created successfully',
        status_code=201,
    )


@users_bp.route('/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id: int):
    """Get a user by ID (authenticated users)."""
    user = UserService.get_by_id(user_id)
    if not user:
        return error_response('User not found', status_code=404)

    return success_response(
        data={'user': user_schema.dump(user)},
        message='User retrieved successfully',
        status_code=200,
    )


@users_bp.route('/<int:user_id>', methods=['PUT', 'PATCH'])
@role_required('admin')
def update_user(user_id: int):
    """Update a user's details (admin only)."""
    json_data = request.get_json() or {}
    try:
        data = user_update_schema.load(json_data)
    except ValidationError as err:
        return error_response('Validation error', errors=err.messages, status_code=422)

    try:
        user = UserService.update(user_id, data)
    except ValidationError as err:
        return error_response('Validation error', errors=err.messages, status_code=422)

    if not user:
        return error_response('User not found', status_code=404)

    return success_response(
        data={'user': user_schema.dump(user)},
        message='User updated successfully',
        status_code=200,
    )


@users_bp.route('/<int:user_id>', methods=['DELETE'])
@role_required('admin')
def delete_user(user_id: int):
    """Deactivate (soft delete) a user (admin only)."""
    user = UserService.deactivate(user_id)
    if not user:
        return error_response('User not found', status_code=404)

    return success_response(
        data={'user': user_schema.dump(user)},
        message='User deactivated successfully',
        status_code=200,
    )
