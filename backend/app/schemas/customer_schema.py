"""Marshmallow schemas for Customer endpoints."""
from marshmallow import Schema, fields, validate


class CustomerCreateSchema(Schema):
    """Input schema for creating/updating a customer."""
    name = fields.String(required=True, validate=validate.Length(min=1, max=120))
    email = fields.Email(required=True)
    phone = fields.String(validate=validate.Length(max=30), load_default=None)
    address = fields.String(load_default=None)
    user_id = fields.Integer(load_default=None)


class CustomerUpdateSchema(Schema):
    """Input schema for partial updates — all fields optional."""
    name = fields.String(validate=validate.Length(min=1, max=120))
    email = fields.Email()
    phone = fields.String(validate=validate.Length(max=30), allow_none=True)
    address = fields.String(allow_none=True)
    user_id = fields.Integer(allow_none=True)


class CustomerSchema(Schema):
    """Output schema — full customer representation."""
    id = fields.Integer(dump_only=True)
    name = fields.String(dump_only=True)
    email = fields.Email(dump_only=True)
    phone = fields.String(dump_only=True)
    address = fields.String(dump_only=True)
    user_id = fields.Integer(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
