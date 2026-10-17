"""Role management routes — full CRUD and permission assignment with RBAC."""
from flask import Blueprint, request
from marshmallow import ValidationError

from app.schemas.role_schema import RoleSchema, RoleCreateSchema, RoleUpdateSchema, RoleAssignPermissionsSchema
from app.services.role_service import RoleService
from app.utils.decorators import role_required
from app.utils.responses import success_response, error_response

roles_bp = Blueprint('roles', __name__)

role_schema = RoleSchema()
roles_schema = RoleSchema(many=True)
role_create_schema = RoleCreateSchema()
role_update_schema = RoleUpdateSchema()
role_assign_schema = RoleAssignPermissionsSchema()


@roles_bp.route('', methods=['GET'])
@role_required('admin')
def get_roles():
    """List all roles (paginated, admin only)."""
    result = RoleService.get_all()
    return success_response(
        data={
            'roles': roles_schema.dump(result['items']),
            'pagination': {
                'page': result['page'],
                'per_page': result['per_page'],
                'total': result['total'],
                'pages': result['pages'],
            },
        },
        message='Roles retrieved successfully',
        status_code=200,
    )


@roles_bp.route('', methods=['POST'])
@role_required('admin')
def create_role():
    """Create a new role (admin only)."""
    json_data = request.get_json() or {}
    try:
        data = role_create_schema.load(json_data)
    except ValidationError as err:
        return error_response('Validation error', errors=err.messages, status_code=422)

    try:
        role = RoleService.create(data)
    except ValidationError as err:
        return error_response('Validation error', errors=err.messages, status_code=422)

    return success_response(
        data={'role': role_schema.dump(role)},
        message='Role created successfully',
        status_code=201,
    )


@roles_bp.route('/<int:role_id>', methods=['GET'])
@role_required('admin')
def get_role(role_id: int):
    """Get a role by ID (admin only)."""
    role = RoleService.get_by_id(role_id)
    if not role:
        return error_response('Role not found', status_code=404)

    return success_response(
        data={'role': role_schema.dump(role)},
        message='Role retrieved successfully',
        status_code=200,
    )


@roles_bp.route('/<int:role_id>', methods=['PUT', 'PATCH'])
@role_required('admin')
def update_role(role_id: int):
    """Update a role by ID (admin only)."""
    json_data = request.get_json() or {}
    try:
        data = role_update_schema.load(json_data)
    except ValidationError as err:
        return error_response('Validation error', errors=err.messages, status_code=422)

    try:
        role = RoleService.update(role_id, data)
    except ValidationError as err:
        return error_response('Validation error', errors=err.messages, status_code=422)

    if not role:
        return error_response('Role not found', status_code=404)

    return success_response(
        data={'role': role_schema.dump(role)},
        message='Role updated successfully',
        status_code=200,
    )


@roles_bp.route('/<int:role_id>', methods=['DELETE'])
@role_required('admin')
def delete_role(role_id: int):
    """Delete a role by ID (admin only, fails if users assigned)."""
    try:
        deleted = RoleService.delete(role_id)
    except ValidationError as err:
        return error_response('Cannot delete role', errors=err.messages, status_code=422)

    if not deleted:
        return error_response('Role not found', status_code=404)

    return success_response(
        data=None,
        message='Role deleted successfully',
        status_code=200,
    )


@roles_bp.route('/<int:role_id>/permissions', methods=['POST'])
@role_required('admin')
def assign_permissions(role_id: int):
    """Assign permissions to a role (admin only)."""
    json_data = request.get_json() or {}
    try:
        data = role_assign_schema.load(json_data)
    except ValidationError as err:
        return error_response('Validation error', errors=err.messages, status_code=422)

    try:
        role = RoleService.assign_permissions(role_id, data['permission_ids'])
    except ValidationError as err:
        return error_response('Validation error', errors=err.messages, status_code=422)

    if not role:
        return error_response('Role not found', status_code=404)

    return success_response(
        data={'role': role_schema.dump(role)},
        message='Permissions assigned to role successfully',
        status_code=200,
    )
