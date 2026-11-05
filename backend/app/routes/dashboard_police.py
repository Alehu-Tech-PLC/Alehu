"""Police-officer dashboard — critical & unacknowledged alerts system-wide, with location data."""
from flask import Blueprint, request

from app.models.alert import Alert
from app.models.device import Device
from app.utils.decorators import role_required_any
from app.utils.responses import success_response

dashboard_police_bp = Blueprint('dashboard_police', __name__)


@dashboard_police_bp.route('/summary', methods=['GET'])
@role_required_any('police_officer', 'admin')
def police_summary():
    """Return critical / high-severity incidents for law-enforcement response."""
    # Paginate: default 20 per page
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 20, type=int), 100)

    # Active (unacknowledged) critical alerts
    critical_q = (
        Alert.query
        .filter(Alert.acknowledged == False, Alert.severity == 'critical')  # noqa: E712
        .order_by(Alert.created_at.desc())
    )
    total_critical = critical_q.count()
    critical_alerts = critical_q.offset((page - 1) * per_page).limit(per_page).all()

    # All open alerts (for the incident counter)
    total_open = Alert.query.filter_by(acknowledged=False).count()

    # Devices that have raised a critical alert (for map pinning)
    critical_device_ids = {a.device_id for a in critical_alerts if a.device_id}
    incident_devices = Device.query.filter(Device.id.in_(critical_device_ids)).all() if critical_device_ids else []

    # Recent SOS events specifically
    sos_alerts = (
        Alert.query
        .filter(Alert.alert_type == 'sos', Alert.acknowledged == False)  # noqa: E712
        .order_by(Alert.created_at.desc())
        .limit(5)
        .all()
    )

    return success_response(
        data={
            'counts': {
                'total_open_alerts': total_open,
                'critical_unacknowledged': total_critical,
                'active_sos': len(sos_alerts),
                'incident_devices': len(incident_devices),
            },
            'critical_alerts': [a.to_dict() for a in critical_alerts],
            'sos_alerts': [a.to_dict() for a in sos_alerts],
            'incident_devices': [d.to_dict() for d in incident_devices],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': total_critical,
            },
        },
        message='Police dashboard summary',
    )


@dashboard_police_bp.route('/acknowledge/<int:alert_id>', methods=['POST'])
@role_required_any('police_officer', 'admin')
def acknowledge_alert(alert_id: int):
    """Acknowledge (close) an alert as responded-to."""
    from app.extensions import db

    alert = db.session.get(Alert, alert_id)
    if not alert:
        from app.utils.responses import error_response
        return error_response('Alert not found', status_code=404)

    alert.acknowledged = True
    db.session.commit()

    return success_response(
        data={'alert': alert.to_dict()},
        message='Alert acknowledged',
    )
