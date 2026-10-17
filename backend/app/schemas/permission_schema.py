"""Marshmallow schemas for Permission endpoints."""
from marshmallow import Schema, fields, validate


class PermissionSchema(Schema):
    """Output schema — full permission representation."""
    id = fields.Integer(dump_only=True)
    name = fields.String(dump_only=True)
    description = fields.String(dump_only=True)
    resource = fields.String(dump_only=True)
    action = fields.String(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)


class PermissionCreateSchema(Schema):
    """Input schema for creating a permission."""
    name = fields.String(required=True, validate=validate.Length(min=1, max=120))
    description = fields.String(load_default=None)
    resource = fields.String(required=True, validate=validate.Length(min=1, max=80))
    action = fields.String(required=True, validate=validate.Length(min=1, max=80))
