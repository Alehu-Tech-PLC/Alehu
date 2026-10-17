"""Marshmallow schemas for authentication endpoints."""
from marshmallow import Schema, fields, validate


class RegisterSchema(Schema):
    """Validates registration input."""
    username = fields.String(required=True, validate=validate.Length(min=3, max=80))
    email = fields.Email(required=True)
    password = fields.String(
        required=True,
        validate=validate.Length(min=6),
        load_only=True,
    )
    role_id = fields.Integer(load_default=None)


class LoginSchema(Schema):
    """Validates login input."""
    email = fields.Email(required=True)
    password = fields.String(required=True, load_only=True)
