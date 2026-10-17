"""AuthService — handles registration, login, logout, and token refresh."""
from flask_jwt_extended import create_access_token, create_refresh_token
from marshmallow import ValidationError

from app import jwt_blocklist
from app.extensions import db
from app.models.user import User
from app.models.role import Role


class AuthService:
    @staticmethod
    def register(data: dict) -> tuple:
        """
        Register a new user and generate access/refresh tokens.
        Raises ValidationError if email or username is already taken.
        """
        email = data.get('email', '').strip().lower()
        username = data.get('username', '').strip()

        if User.query.filter_by(email=email).first():
            raise ValidationError({'email': ['Email is already registered.']})

        if User.query.filter_by(username=username).first():
            raise ValidationError({'username': ['Username is already taken.']})

        role_id = data.get('role_id')
        role = None
        if role_id is not None:
            role = db.session.get(Role, role_id)
            if not role:
                raise ValidationError({'role_id': [f'Role with id {role_id} does not exist.']})
        else:
            # Default to 'user' role if exists
            role = Role.query.filter_by(name='user').first()

        user = User(
            username=username,
            email=email,
            role=role,
            is_active=True,
        )
        user.set_password(data['password'])

        db.session.add(user)
        db.session.commit()

        access_token = create_access_token(identity=str(user.id))
        refresh_token = create_refresh_token(identity=str(user.id))

        return user, access_token, refresh_token

    @staticmethod
    def login(email: str, password: str) -> tuple:
        """
        Authenticate a user by email and password.
        Returns:
            (user, access_token, refresh_token) on success
            (None, 'invalid_credentials', None) if credentials invalid
            (None, 'deactivated', None) if account is inactive
        """
        email = email.strip().lower()
        user = User.query.filter_by(email=email).first()

        if not user or not user.check_password(password):
            return None, 'invalid_credentials', None

        if not user.is_active:
            return None, 'deactivated', None

        access_token = create_access_token(identity=str(user.id))
        refresh_token = create_refresh_token(identity=str(user.id))

        return user, access_token, refresh_token

    @staticmethod
    def logout(jti: str) -> None:
        """Add token unique identifier (jti) to the revocation blocklist."""
        jwt_blocklist.add(jti)

    @staticmethod
    def refresh(identity: str) -> str:
        """Generate a new access token from user identity."""
        try:
            uid = int(identity)
        except (ValueError, TypeError):
            return None

        user = db.session.get(User, uid)
        if not user or not user.is_active:
            return None

        return create_access_token(identity=str(user.id))
