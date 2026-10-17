"""Marshmallow schemas for User endpoints."""
from marshmallow import Schema, fields, validate


class UserSchema(Schema):
    """Output schema — never exposes password_hash."""
    id = fields.Integer(dump_only=True)
    username = fields.String(dump_only=True)
    email = fields.Email(dump_only=True)
    is_active = fields.Boolean(dump_only=True)
    role_id = fields.Integer(dump_only=True)
    role = fields.Method('get_role_name', dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

    def get_role_name(self, obj):
        if hasattr(obj, 'role') and obj.role:
            return obj.role.name if hasattr(obj.role, 'name') else str(obj.role)
        return None


class UserCreateSchema(Schema):
    """Input schema for creating a user directly by admin."""
    username = fields.String(required=True, validate=validate.Length(min=3, max=80))
    email = fields.Email(required=True)
    password = fields.String(required=True, validate=validate.Length(min=6), load_only=True)
    role_id = fields.Integer(load_default=None)
    is_active = fields.Boolean(load_default=True)


class UserUpdateSchema(Schema):
    """Input schema for updating a user — all fields optional."""
    username = fields.String(validate=validate.Length(min=3, max=80))
    email = fields.Email()
    password = fields.String(validate=validate.Length(min=6), load_only=True)
    is_active = fields.Boolean()
    role_id = fields.Integer(allow_none=True)

