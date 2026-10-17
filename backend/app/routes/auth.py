"""Authentication routes — registration, login, token refresh, and logout."""
from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from marshmallow import ValidationError

from app.schemas.auth_schema import RegisterSchema, LoginSchema
from app.schemas.user_schema import UserSchema
from app.services.auth_service import AuthService
from app.services.user_service import UserService
from app.utils.responses import success_response, error_response

auth_bp = Blueprint('auth', __name__)

register_schema = RegisterSchema()
login_schema = LoginSchema()
user_schema = UserSchema()


@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user account."""
    json_data = request.get_json() or {}
    try:
        data = register_schema.load(json_data)
    except ValidationError as err:
        return error_response('Validation error', errors=err.messages, status_code=422)

    try:
        user, access_token, refresh_token = AuthService.register(data)
    except ValidationError as err:
        return error_response('Validation error', errors=err.messages, status_code=422)

    return success_response(
        data={
            'user': user_schema.dump(user),
            'access_token': access_token,
            'refresh_token': refresh_token,
        },
        message='User registered successfully',
        status_code=201,
    )


@auth_bp.route('/login', methods=['POST'])
def login():
    """Authenticate with email and password to receive JWT tokens."""
    json_data = request.get_json() or {}
    try:
        data = login_schema.load(json_data)
    except ValidationError as err:
        return error_response('Validation error', errors=err.messages, status_code=422)

    user, status_or_token, refresh_token = AuthService.login(data['email'], data['password'])

    if status_or_token == 'invalid_credentials':
        return error_response('Invalid email or password', status_code=401)
    if status_or_token == 'deactivated':
        return error_response('Account is deactivated', status_code=401)

    return success_response(
        data={
            'user': user_schema.dump(user),
            'access_token': status_or_token,
            'refresh_token': refresh_token,
        },
        message='Login successful',
        status_code=200,
    )


@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """Revoke current access token by adding its jti to the blocklist."""
    jwt_data = get_jwt()
    jti = jwt_data.get('jti')
    if jti:
        AuthService.logout(jti)
    return success_response(None, 'Successfully logged out', status_code=200)


@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Generate a new access token using a valid refresh token."""
    identity = get_jwt_identity()
    new_access_token = AuthService.refresh(identity)
    if not new_access_token:
        return error_response('User not found or account is deactivated', status_code=401)

    return success_response(
        data={'access_token': new_access_token},
        message='Access token refreshed successfully',
        status_code=200,
    )


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    """Get the currently authenticated user's profile."""
    identity = get_jwt_identity()
    try:
        user_id = int(identity)
    except (ValueError, TypeError):
        return error_response('Invalid identity in token', status_code=401)

    user = UserService.get_by_id(user_id)
    if not user:
        return error_response('User not found', status_code=404)

    return success_response(
        data={'user': user_schema.dump(user)},
        message='Current user profile',
        status_code=200,
    )
