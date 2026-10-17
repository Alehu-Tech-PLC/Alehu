"""Marshmallow schemas for Role endpoints."""
from marshmallow import Schema, fields, validate


class RoleSchema(Schema):
    """Output schema — full role representation with permission names."""
    id = fields.Integer(dump_only=True)
    name = fields.String(dump_only=True)
    description = fields.String(dump_only=True)
    permissions = fields.Method('get_permissions', dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

    def get_permissions(self, obj):
        if hasattr(obj, 'permissions') and obj.permissions:
            return [p.name if hasattr(p, 'name') else str(p) for p in obj.permissions]
        return []


class RoleCreateSchema(Schema):
    """Input schema for creating a role."""
    name = fields.String(required=True, validate=validate.Length(min=1, max=80))
    description = fields.String(load_default=None)


class RoleUpdateSchema(Schema):
    """Input schema for updating a role — all fields optional."""
    name = fields.String(validate=validate.Length(min=1, max=80))
    description = fields.String(allow_none=True)


class RoleAssignPermissionsSchema(Schema):
    """Input schema for assigning permissions to a role."""
    permission_ids = fields.List(fields.Integer(), required=True)

