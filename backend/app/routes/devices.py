"""Device management routes — full CRUD with JWT protection."""
from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from marshmallow import ValidationError

from app.schemas.device_schema import DeviceSchema, DeviceCreateSchema, DeviceUpdateSchema
from app.services.device_service import DeviceService
from app.utils.responses import success_response, error_response

devices_bp = Blueprint('devices', __name__)

device_schema = DeviceSchema()
devices_schema = DeviceSchema(many=True)
device_create_schema = DeviceCreateSchema()
device_update_schema = DeviceUpdateSchema()


@devices_bp.route('', methods=['GET'])
@jwt_required()
def get_devices():
    """List all devices (paginated)."""
    result = DeviceService.get_all()
    return success_response(
        data={
            'devices': devices_schema.dump(result['items']),
            'pagination': {
                'page': result['page'],
                'per_page': result['per_page'],
                'total': result['total'],
                'pages': result['pages'],
            },
        },
        message='Devices retrieved successfully',
        status_code=200,
    )


@devices_bp.route('', methods=['POST'])
@jwt_required()
def create_device():
    """Create a new device."""
    json_data = request.get_json() or {}
    try:
        data = device_create_schema.load(json_data)
    except ValidationError as err:
        return error_response('Validation error', errors=err.messages, status_code=422)

    try:
        device = DeviceService.create(data)
    except ValidationError as err:
        return error_response('Validation error', errors=err.messages, status_code=422)

    return success_response(
        data={'device': device_schema.dump(device)},
        message='Device created successfully',
        status_code=201,
    )


@devices_bp.route('/<int:device_id>', methods=['GET'])
@jwt_required()
def get_device(device_id: int):
    """Get a device by ID."""
    device = DeviceService.get_by_id(device_id)
    if not device:
        return error_response('Device not found', status_code=404)

    return success_response(
        data={'device': device_schema.dump(device)},
        message='Device retrieved successfully',
        status_code=200,
    )


@devices_bp.route('/<int:device_id>', methods=['PUT', 'PATCH'])
@jwt_required()
def update_device(device_id: int):
    """Update a device by ID."""
    json_data = request.get_json() or {}
    try:
        data = device_update_schema.load(json_data)
    except ValidationError as err:
        return error_response('Validation error', errors=err.messages, status_code=422)

    try:
        device = DeviceService.update(device_id, data)
    except ValidationError as err:
        return error_response('Validation error', errors=err.messages, status_code=422)

    if not device:
        return error_response('Device not found', status_code=404)

    return success_response(
        data={'device': device_schema.dump(device)},
        message='Device updated successfully',
        status_code=200,
    )


@devices_bp.route('/<int:device_id>', methods=['DELETE'])
@jwt_required()
def delete_device(device_id: int):
    """Delete a device by ID."""
    deleted = DeviceService.delete(device_id)
    if not deleted:
        return error_response('Device not found', status_code=404)

    return success_response(
        data=None,
        message='Device deleted successfully',
        status_code=200,
    )
