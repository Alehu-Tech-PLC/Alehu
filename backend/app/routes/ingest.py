"""Wearable ingest endpoints. Uses JWT for the app, or DEVICE_INGEST_KEY for firmware."""
import os
from datetime import datetime, timezone

from flask import Blueprint, request
from flask_jwt_extended import verify_jwt_in_request
from marshmallow import ValidationError

from app.extensions import db
from app.models.alert import Alert
from app.models.device import Device
from app.schemas.device_schema import DeviceTelemetrySchema, DeviceSchema
from app.utils.responses import success_response, error_response

ingest_bp = Blueprint('ingest', __name__)
telemetry_schema = DeviceTelemetrySchema()
device_schema = DeviceSchema()


def _authorized_for_ingest() -> bool:
    ingest_key = os.environ.get('DEVICE_INGEST_KEY', '').strip()
    provided = (request.headers.get('X-Device-Key') or '').strip()
    if ingest_key and provided and provided == ingest_key:
        return True
    try:
        verify_jwt_in_request()
        return True
    except Exception:
        return False


@ingest_bp.route('/telemetry', methods=['POST'])
def ingest_telemetry():
    if not _authorized_for_ingest():
        return error_response('Authentication required for device ingest', status_code=401)

    json_data = request.get_json() or {}
    try:
        data = telemetry_schema.load(json_data)
    except ValidationError as err:
        return error_response('Validation error', errors=err.messages, status_code=422)

    device = Device.query.filter_by(serial_number=data['serial_number'].strip()).first()
    if not device:
        return error_response('Device not found', status_code=404)

    if data.get('battery_level') is not None:
        device.battery_level = data['battery_level']
    if data.get('last_latitude') is not None:
        device.last_latitude = data['last_latitude']
    if data.get('last_longitude') is not None:
        device.last_longitude = data['last_longitude']
    if data.get('firmware_version'):
        device.firmware_version = data['firmware_version']
    if data.get('status'):
        device.status = data['status']
    device.last_seen = datetime.now(timezone.utc)

    alert = None
    if data.get('alert_type'):
        alert = Alert(
            alert_type=data['alert_type'],
            severity=data.get('severity', 'warning'),
            message=data.get('message') or f"{data['alert_type']} reported by {device.name}",
            device_id=device.id,
            customer_id=device.customer_id,
        )
        db.session.add(alert)

    db.session.commit()
    payload = {'device': device_schema.dump(device)}
    if alert:
        payload['alert'] = alert.to_dict()
    return success_response(data=payload, message='Telemetry accepted')
