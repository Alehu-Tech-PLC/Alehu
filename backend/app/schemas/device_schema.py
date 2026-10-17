"""Marshmallow schemas for Device endpoints."""
from marshmallow import Schema, fields, validate


class DeviceCreateSchema(Schema):
    """Input schema for creating a device."""
    name = fields.String(required=True, validate=validate.Length(min=1, max=120))
    serial_number = fields.String(required=True, validate=validate.Length(min=1, max=120))
    device_type = fields.String(validate=validate.Length(max=80), load_default=None)
    status = fields.String(validate=validate.Length(max=40), load_default='active')
    customer_id = fields.Integer(load_default=None)
    user_id = fields.Integer(load_default=None)


class DeviceUpdateSchema(Schema):
    """Input schema for partial updates — all fields optional."""
    name = fields.String(validate=validate.Length(min=1, max=120))
    serial_number = fields.String(validate=validate.Length(min=1, max=120))
    device_type = fields.String(validate=validate.Length(max=80), allow_none=True)
    status = fields.String(validate=validate.Length(max=40))
    customer_id = fields.Integer(allow_none=True)
    user_id = fields.Integer(allow_none=True)


class DeviceSchema(Schema):
    """Output schema — full device representation."""
    id = fields.Integer(dump_only=True)
    name = fields.String(dump_only=True)
    serial_number = fields.String(dump_only=True)
    device_type = fields.String(dump_only=True)
    status = fields.String(dump_only=True)
    customer_id = fields.Integer(dump_only=True)
    user_id = fields.Integer(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
