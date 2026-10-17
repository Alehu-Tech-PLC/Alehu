"""
Application factory for the Flask + PostgreSQL backend.

Usage:
    from app import create_app
    app = create_app('development')
"""
from flask import Flask

from app.config import config_by_name
from app.extensions import db, migrate, jwt, bcrypt
from app.utils.responses import error_response

# ---------------------------------------------------------------------------
# In-memory JWT blocklist (tokens added on logout are checked here)
# Replace with a Redis-backed set in production.
# ---------------------------------------------------------------------------
jwt_blocklist: set = set()


def create_app(config_name: str = 'development') -> Flask:
    """Create and configure the Flask application instance."""

    app = Flask(__name__)

    # ------------------------------------------------------------------
    # 1. Load configuration
    # ------------------------------------------------------------------
    app.config.from_object(config_by_name[config_name])

    # ------------------------------------------------------------------
    # 2. Initialise extensions
    # ------------------------------------------------------------------
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    bcrypt.init_app(app)

    # ------------------------------------------------------------------
    # 2a. Import models so Flask-Migrate can auto-detect the schema
    # ------------------------------------------------------------------
    from app.models import Role, Permission, role_permissions, User, Customer, Device  # noqa: F401

    # ------------------------------------------------------------------
    # 3. Register blueprints  (imports inside factory → no circular deps)
    # ------------------------------------------------------------------
    from app.routes.auth import auth_bp
    from app.routes.users import users_bp
    from app.routes.customers import customers_bp
    from app.routes.devices import devices_bp
    from app.routes.roles import roles_bp
    from app.routes.permissions import permissions_bp

    app.register_blueprint(auth_bp,        url_prefix='/api/auth')
    app.register_blueprint(users_bp,       url_prefix='/api/users')
    app.register_blueprint(customers_bp,   url_prefix='/api/customers')
    app.register_blueprint(devices_bp,     url_prefix='/api/devices')
    app.register_blueprint(roles_bp,       url_prefix='/api/roles')
    app.register_blueprint(permissions_bp, url_prefix='/api/permissions')

    # ------------------------------------------------------------------
    # 4. Global HTTP error handlers
    # ------------------------------------------------------------------
    @app.errorhandler(400)
    def bad_request(e):
        return error_response('Bad request', status_code=400)

    @app.errorhandler(401)
    def unauthorized(e):
        return error_response('Authentication required', status_code=401)

    @app.errorhandler(403)
    def forbidden(e):
        return error_response('Insufficient permissions', status_code=403)

    @app.errorhandler(404)
    def not_found(e):
        return error_response('Resource not found', status_code=404)

    @app.errorhandler(422)
    def unprocessable(e):
        # Marshmallow validation errors carry field-level detail in e.description
        errors = getattr(e, 'description', None)
        return error_response('Validation error', errors=errors, status_code=422)

    @app.errorhandler(500)
    def internal_error(e):
        return error_response('Internal server error', status_code=500)

    # ------------------------------------------------------------------
    # 5. JWT error hooks
    # ------------------------------------------------------------------
    @jwt.token_in_blocklist_loader
    def check_if_token_revoked(jwt_header, jwt_payload):
        jti = jwt_payload.get('jti')
        return jti in jwt_blocklist

    @jwt.unauthorized_loader
    def missing_token_callback(reason):
        return error_response(
            f'Authentication required: {reason}',
            status_code=401,
        )

    @jwt.invalid_token_loader
    def invalid_token_callback(reason):
        return error_response(
            f'Invalid token: {reason}',
            status_code=401,
        )

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return error_response('Token has expired', status_code=401)

    @jwt.revoked_token_loader
    def revoked_token_callback(jwt_header, jwt_payload):
        return error_response('Token has been revoked', status_code=401)

    return app
