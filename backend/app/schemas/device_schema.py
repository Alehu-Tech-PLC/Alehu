"""Marshmallow schemas for Device endpoints."""
from marshmallow import Schema, fields, validate


class DeviceCreateSchema(Schema):
    """Input schema for creating a device."""
    name = fields.String(required=True, validate=validate.Length(min=1, max=120))
    serial_number = fields.String(required=True, validate=validate.Length(min=1, max=120))
    device_type = fields.String(validate=validate.Length(max=80), load_default='wearable')
    status = fields.String(validate=validate.Length(max=40), load_default='active')
    firmware_version = fields.String(validate=validate.Length(max=40), load_default=None)
    battery_level = fields.Integer(validate=validate.Range(min=0, max=100), load_default=None)
    last_latitude = fields.Float(load_default=None)
    last_longitude = fields.Float(load_default=None)
    customer_id = fields.Integer(load_default=None)
    user_id = fields.Integer(load_default=None)


class DeviceUpdateSchema(Schema):
    """Input schema for partial updates — all fields optional."""
    name = fields.String(validate=validate.Length(min=1, max=120))
    serial_number = fields.String(validate=validate.Length(min=1, max=120))
    device_type = fields.String(validate=validate.Length(max=80), allow_none=True)
    status = fields.String(validate=validate.Length(max=40))
    firmware_version = fields.String(validate=validate.Length(max=40), allow_none=True)
    battery_level = fields.Integer(validate=validate.Range(min=0, max=100), allow_none=True)
    last_latitude = fields.Float(allow_none=True)
    last_longitude = fields.Float(allow_none=True)
    customer_id = fields.Integer(allow_none=True)
    user_id = fields.Integer(allow_none=True)


class DeviceTelemetrySchema(Schema):
    """Heartbeat payload from a wearable or guardian app."""
    serial_number = fields.String(required=True, validate=validate.Length(min=1, max=120))
    battery_level = fields.Integer(validate=validate.Range(min=0, max=100), load_default=None)
    last_latitude = fields.Float(load_default=None)
    last_longitude = fields.Float(load_default=None)
    firmware_version = fields.String(validate=validate.Length(max=40), load_default=None)
    status = fields.String(validate=validate.Length(max=40), load_default=None)
    alert_type = fields.String(validate=validate.Length(max=60), load_default=None)
    severity = fields.String(validate=validate.OneOf(['info', 'warning', 'critical']), load_default='warning')
    message = fields.String(validate=validate.Length(max=500), load_default=None)


class DeviceSchema(Schema):
    """Output schema — full device representation."""
    id = fields.Integer(dump_only=True)
    name = fields.String(dump_only=True)
    serial_number = fields.String(dump_only=True)
    device_type = fields.String(dump_only=True)
    status = fields.String(dump_only=True)
    firmware_version = fields.String(dump_only=True)
    battery_level = fields.Integer(dump_only=True)
    last_latitude = fields.Float(dump_only=True)
    last_longitude = fields.Float(dump_only=True)
    last_seen = fields.DateTime(dump_only=True)
    customer_id = fields.Integer(dump_only=True)
    user_id = fields.Integer(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
