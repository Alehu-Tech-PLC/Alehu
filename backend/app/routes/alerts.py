"""Safety alert routes."""
from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from marshmallow import ValidationError

from app.schemas.alert_schema import AlertSchema, AlertCreateSchema, AlertUpdateSchema
from app.services.alert_service import AlertService
from app.utils.responses import success_response, error_response

alerts_bp = Blueprint('alerts', __name__)

alert_schema = AlertSchema()
alerts_schema = AlertSchema(many=True)
alert_create_schema = AlertCreateSchema()
alert_update_schema = AlertUpdateSchema()


@alerts_bp.route('', methods=['GET'])
@jwt_required()
def get_alerts():
    acknowledged_param = request.args.get('acknowledged')
    acknowledged = None
    if acknowledged_param is not None:
        acknowledged = acknowledged_param.lower() in ('1', 'true', 'yes')

    result = AlertService.get_all(acknowledged=acknowledged)
    return success_response(
        data={
            'alerts': alerts_schema.dump(result['items']),
            'pagination': {
                'page': result['page'],
                'per_page': result['per_page'],
                'total': result['total'],
                'pages': result['pages'],
            },
        },
        message='Alerts retrieved successfully',
    )


@alerts_bp.route('', methods=['POST'])
@jwt_required()
def create_alert():
    json_data = request.get_json() or {}
    try:
        data = alert_create_schema.load(json_data)
        alert = AlertService.create(data)
    except ValidationError as err:
        return error_response('Validation error', errors=err.messages, status_code=422)

    return success_response(
        data={'alert': alert_schema.dump(alert)},
        message='Alert created successfully',
        status_code=201,
    )


@alerts_bp.route('/<int:alert_id>', methods=['GET'])
@jwt_required()
def get_alert(alert_id: int):
    alert = AlertService.get_by_id(alert_id)
    if not alert:
        return error_response('Alert not found', status_code=404)
    return success_response(data={'alert': alert_schema.dump(alert)}, message='Alert retrieved successfully')


@alerts_bp.route('/<int:alert_id>', methods=['PUT', 'PATCH'])
@jwt_required()
def update_alert(alert_id: int):
    json_data = request.get_json() or {}
    try:
        data = alert_update_schema.load(json_data)
        alert = AlertService.update(alert_id, data)
    except ValidationError as err:
        return error_response('Validation error', errors=err.messages, status_code=422)

    if not alert:
        return error_response('Alert not found', status_code=404)
    return success_response(data={'alert': alert_schema.dump(alert)}, message='Alert updated successfully')


@alerts_bp.route('/<int:alert_id>/acknowledge', methods=['POST'])
@jwt_required()
def acknowledge_alert(alert_id: int):
    alert = AlertService.acknowledge(alert_id)
    if not alert:
        return error_response('Alert not found', status_code=404)
    return success_response(data={'alert': alert_schema.dump(alert)}, message='Alert acknowledged')


@alerts_bp.route('/<int:alert_id>', methods=['DELETE'])
@jwt_required()
def delete_alert(alert_id: int):
    deleted = AlertService.delete(alert_id)
    if not deleted:
        return error_response('Alert not found', status_code=404)
    return success_response(data=None, message='Alert deleted successfully')
