"""Guardian operations summary for the web dashboard."""
from flask import Blueprint
from flask_jwt_extended import jwt_required

from app.models.alert import Alert
from app.models.customer import Customer
from app.models.device import Device
from app.utils.responses import success_response

dashboard_bp = Blueprint('dashboard', __name__)


@dashboard_bp.route('/summary', methods=['GET'])
@jwt_required()
def summary():
    devices = Device.query.all()
    alerts = Alert.query.order_by(Alert.created_at.desc()).limit(8).all()
    online = sum(1 for device in devices if device.status == 'active')
    critical = Alert.query.filter_by(acknowledged=False, severity='critical').count()

    return success_response(
        data={
            'counts': {
                'devices': len(devices),
                'customers': Customer.query.count(),
                'alerts_open': Alert.query.filter_by(acknowledged=False).count(),
                'alerts_critical': critical,
                'devices_online': online,
            },
            'devices': [device.to_dict() for device in devices],
            'recent_alerts': [alert.to_dict() for alert in alerts],
        },
        message='Dashboard summary retrieved',
    )
