"""RoleService — business logic for roles and permission assignments."""
from marshmallow import ValidationError

from app.extensions import db
from app.models.role import Role
from app.models.permission import Permission
from app.utils.pagination import paginate_query


class RoleService:
    @staticmethod
    def get_all(page: int = None, per_page: int = None) -> dict:
        """Fetch a paginated list of roles."""
        query = Role.query.order_by(Role.id.asc())
        return paginate_query(query, page=page, per_page=per_page)

    @staticmethod
    def get_by_id(role_id: int) -> Role:
        """Fetch a single role by primary key."""
        return db.session.get(Role, role_id)

    @staticmethod
    def create(data: dict) -> Role:
        """Create a new role."""
        name = data.get('name', '').strip()
        if Role.query.filter_by(name=name).first():
            raise ValidationError({'name': ['Role with this name already exists.']})

        role = Role(
            name=name,
            description=data.get('description'),
        )
        db.session.add(role)
        db.session.commit()
        return role

    @staticmethod
    def update(role_id: int, data: dict) -> Role:
        """Update an existing role."""
        role = db.session.get(Role, role_id)
        if not role:
            return None

        if 'name' in data and data['name']:
            new_name = data['name'].strip()
            if new_name != role.name:
                existing = Role.query.filter_by(name=new_name).first()
                if existing and existing.id != role.id:
                    raise ValidationError({'name': ['Role with this name already exists.']})
                role.name = new_name

        if 'description' in data:
            role.description = data['description']

        db.session.commit()
        return role

    @staticmethod
    def delete(role_id: int) -> bool:
        """Delete a role (only if no users are assigned)."""
        role = db.session.get(Role, role_id)
        if not role:
            return False

        if role.users.count() > 0:
            raise ValidationError({'role': ['Cannot delete a role that has users assigned to it.']})

        db.session.delete(role)
        db.session.commit()
        return True

    @staticmethod
    def assign_permissions(role_id: int, permission_ids: list) -> Role:
        """Assign a list of permissions to a role."""
        role = db.session.get(Role, role_id)
        if not role:
            return None

        if not permission_ids:
            role.permissions = []
            db.session.commit()
            return role

        perms = Permission.query.filter(Permission.id.in_(permission_ids)).all()
        found_ids = {p.id for p in perms}
        missing = [pid for pid in permission_ids if pid not in found_ids]
        if missing:
            raise ValidationError({'permission_ids': [f'Permissions not found: {missing}']})

        role.permissions = perms
        db.session.commit()
        return role
