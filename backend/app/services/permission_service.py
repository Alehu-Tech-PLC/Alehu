"""PermissionService — business logic for permission management."""
from marshmallow import ValidationError

from app.extensions import db
from app.models.permission import Permission
from app.utils.pagination import paginate_query


class PermissionService:
    @staticmethod
    def get_all(page: int = None, per_page: int = None) -> dict:
        """Fetch a paginated list of permissions."""
        query = Permission.query.order_by(Permission.id.asc())
        return paginate_query(query, page=page, per_page=per_page)

    @staticmethod
    def get_by_id(permission_id: int) -> Permission:
        """Fetch a single permission by primary key."""
        return db.session.get(Permission, permission_id)

    @staticmethod
    def create(data: dict) -> Permission:
        """Create a new permission."""
        name = data.get('name', '').strip()
        if Permission.query.filter_by(name=name).first():
            raise ValidationError({'name': ['Permission with this name already exists.']})

        permission = Permission(
            name=name,
            description=data.get('description'),
            resource=data['resource'].strip(),
            action=data['action'].strip(),
        )
        db.session.add(permission)
        db.session.commit()
        return permission

    @staticmethod
    def delete(permission_id: int) -> bool:
        """Delete a permission."""
        permission = db.session.get(Permission, permission_id)
        if not permission:
            return False

        db.session.delete(permission)
        db.session.commit()
        return True
