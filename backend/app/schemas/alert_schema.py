"""Marshmallow schemas for Alert endpoints."""
from marshmallow import Schema, fields, validate


class AlertCreateSchema(Schema):
    alert_type = fields.String(required=True, validate=validate.Length(min=1, max=60))
    severity = fields.String(validate=validate.OneOf(['info', 'warning', 'critical']), load_default='info')
    message = fields.String(required=True, validate=validate.Length(min=1, max=500))
    device_id = fields.Integer(load_default=None)
    customer_id = fields.Integer(load_default=None)
    acknowledged = fields.Boolean(load_default=False)


class AlertUpdateSchema(Schema):
    alert_type = fields.String(validate=validate.Length(min=1, max=60))
    severity = fields.String(validate=validate.OneOf(['info', 'warning', 'critical']))
    message = fields.String(validate=validate.Length(min=1, max=500))
    acknowledged = fields.Boolean()


class AlertSchema(Schema):
    id = fields.Integer(dump_only=True)
    alert_type = fields.String(dump_only=True)
    severity = fields.String(dump_only=True)
    message = fields.String(dump_only=True)
    acknowledged = fields.Boolean(dump_only=True)
    device_id = fields.Integer(dump_only=True)
    customer_id = fields.Integer(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
