"""Permission management routes — full CRUD with RBAC."""
from flask import Blueprint, request
from marshmallow import ValidationError

from app.schemas.permission_schema import PermissionSchema, PermissionCreateSchema
from app.services.permission_service import PermissionService
from app.utils.decorators import role_required
from app.utils.responses import success_response, error_response

permissions_bp = Blueprint('permissions', __name__)

permission_schema = PermissionSchema()
permissions_schema = PermissionSchema(many=True)
permission_create_schema = PermissionCreateSchema()


@permissions_bp.route('', methods=['GET'])
@role_required('admin')
def get_permissions():
    """List all permissions (paginated, admin only)."""
    result = PermissionService.get_all()
    return success_response(
        data={
            'permissions': permissions_schema.dump(result['items']),
            'pagination': {
                'page': result['page'],
                'per_page': result['per_page'],
                'total': result['total'],
                'pages': result['pages'],
            },
        },
        message='Permissions retrieved successfully',
        status_code=200,
    )


@permissions_bp.route('', methods=['POST'])
@role_required('admin')
def create_permission():
    """Create a new permission (admin only)."""
    json_data = request.get_json() or {}
    try:
        data = permission_create_schema.load(json_data)
    except ValidationError as err:
        return error_response('Validation error', errors=err.messages, status_code=422)

    try:
        permission = PermissionService.create(data)
    except ValidationError as err:
        return error_response('Validation error', errors=err.messages, status_code=422)

    return success_response(
        data={'permission': permission_schema.dump(permission)},
        message='Permission created successfully',
        status_code=201,
    )


@permissions_bp.route('/<int:permission_id>', methods=['GET'])
@role_required('admin')
def get_permission(permission_id: int):
    """Get a permission by ID (admin only)."""
    permission = PermissionService.get_by_id(permission_id)
    if not permission:
        return error_response('Permission not found', status_code=404)

    return success_response(
        data={'permission': permission_schema.dump(permission)},
        message='Permission retrieved successfully',
        status_code=200,
    )


@permissions_bp.route('/<int:permission_id>', methods=['DELETE'])
@role_required('admin')
def delete_permission(permission_id: int):
    """Delete a permission by ID (admin only)."""
    deleted = PermissionService.delete(permission_id)
    if not deleted:
        return error_response('Permission not found', status_code=404)

    return success_response(
        data=None,
        message='Permission deleted successfully',
        status_code=200,
    )
