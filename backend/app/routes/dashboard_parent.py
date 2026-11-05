"""Parent dashboard — scoped to devices owned by the logged-in parent's customers."""
from flask import Blueprint
from flask_jwt_extended import get_jwt_identity

from app.extensions import db
from app.models.alert import Alert
from app.models.customer import Customer
from app.models.device import Device
from app.models.user import User
from app.utils.decorators import role_required
from app.utils.responses import success_response

dashboard_parent_bp = Blueprint('dashboard_parent', __name__)


@dashboard_parent_bp.route('/summary', methods=['GET'])
@role_required('parent')
def parent_summary():
    """Return data scoped to the parent's own children / devices."""
    user_id = int(get_jwt_identity())
    user = db.session.get(User, user_id)

    # Customers (guardian groups) that belong to this parent
    my_customers = Customer.query.filter_by(user_id=user.id).all()
    customer_ids = [c.id for c in my_customers]

    if customer_ids:
        # Devices assigned to those customers
        my_devices = Device.query.filter(Device.customer_id.in_(customer_ids)).all()
    else:
        # Fallback: devices directly owned by this user
        my_devices = Device.query.filter_by(user_id=user.id).all()

    device_ids = [d.id for d in my_devices]

    # Open (unacknowledged) alerts for those devices
    open_alerts = (
        Alert.query
        .filter(Alert.device_id.in_(device_ids), Alert.acknowledged == False)  # noqa: E712
        .order_by(Alert.created_at.desc())
        .limit(10)
        .all()
    ) if device_ids else []

    critical_count = (
        Alert.query
        .filter(
            Alert.device_id.in_(device_ids),
            Alert.acknowledged == False,  # noqa: E712
            Alert.severity == 'critical',
        )
        .count()
    ) if device_ids else 0

    devices_online = sum(1 for d in my_devices if d.status == 'active')

    return success_response(
        data={
            'counts': {
                'children': len(my_devices),
                'devices_online': devices_online,
                'open_alerts': len(open_alerts),
                'critical_alerts': critical_count,
            },
            'devices': [d.to_dict() for d in my_devices],
            'recent_alerts': [a.to_dict() for a in open_alerts],
        },
        message='Parent dashboard summary',
    )
