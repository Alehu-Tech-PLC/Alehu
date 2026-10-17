"""UserService — business logic for user management."""
from marshmallow import ValidationError

from app.extensions import db
from app.models.user import User
from app.models.role import Role
from app.utils.pagination import paginate_query


class UserService:
    @staticmethod
    def get_all(page: int = None, per_page: int = None) -> dict:
        """Fetch a paginated list of users."""
        query = User.query.order_by(User.id.asc())
        return paginate_query(query, page=page, per_page=per_page)

    @staticmethod
    def get_by_id(user_id: int) -> User:
        """Fetch a single user by primary key."""
        return db.session.get(User, user_id)

    @staticmethod
    def create(data: dict) -> User:
        """Create a user directly (admin use)."""
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
            role = Role.query.filter_by(name='user').first()

        user = User(
            username=username,
            email=email,
            role=role,
            is_active=data.get('is_active', True),
        )
        user.set_password(data['password'])

        db.session.add(user)
        db.session.commit()
        return user

    @staticmethod
    def update(user_id: int, data: dict) -> User:
        """Update an existing user's attributes."""
        user = db.session.get(User, user_id)
        if not user:
            return None

        if 'email' in data and data['email']:
            new_email = data['email'].strip().lower()
            if new_email != user.email:
                existing = User.query.filter_by(email=new_email).first()
                if existing and existing.id != user.id:
                    raise ValidationError({'email': ['Email is already registered by another user.']})
                user.email = new_email

        if 'username' in data and data['username']:
            new_username = data['username'].strip()
            if new_username != user.username:
                existing = User.query.filter_by(username=new_username).first()
                if existing and existing.id != user.id:
                    raise ValidationError({'username': ['Username is already taken.']})
                user.username = new_username

        if 'is_active' in data:
            user.is_active = bool(data['is_active'])

        if 'role_id' in data:
            role_id = data['role_id']
            if role_id is not None:
                role = db.session.get(Role, role_id)
                if not role:
                    raise ValidationError({'role_id': [f'Role with id {role_id} does not exist.']})
                user.role = role
            else:
                user.role = None

        if 'password' in data and data['password']:
            user.set_password(data['password'])

        db.session.commit()
        return user

    @staticmethod
    def deactivate(user_id: int) -> User:
        """Soft-delete a user by setting is_active=False."""
        user = db.session.get(User, user_id)
        if not user:
            return None

        user.is_active = False
        db.session.commit()
        return user

    @staticmethod
    def delete(user_id: int) -> bool:
        """Hard delete a user."""
        user = db.session.get(User, user_id)
        if not user:
            return False

        db.session.delete(user)
        db.session.commit()
        return True
