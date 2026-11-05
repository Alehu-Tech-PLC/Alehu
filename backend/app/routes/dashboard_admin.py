"""Alehu admin dashboard — full system overview with user management stats."""
from flask import Blueprint, request

from app.extensions import db
from app.models.alert import Alert
from app.models.customer import Customer
from app.models.device import Device
from app.models.role import Role
from app.models.user import User
from app.utils.decorators import role_required
from app.utils.responses import success_response, error_response

dashboard_admin_bp = Blueprint('dashboard_admin', __name__)


@dashboard_admin_bp.route('/summary', methods=['GET'])
@role_required('admin')
def admin_summary():
    """Full system-wide statistics for Alehu administrators."""
    total_users    = User.query.count()
    active_users   = User.query.filter_by(is_active=True).count()
    total_devices  = Device.query.count()
    online_devices = Device.query.filter_by(status='active').count()
    total_customers = Customer.query.count()
    open_alerts    = Alert.query.filter_by(acknowledged=False).count()
    critical_alerts = Alert.query.filter_by(acknowledged=False, severity='critical').count()
    total_alerts   = Alert.query.count()

    # Role distribution
    roles = Role.query.all()
    role_distribution = {
        r.name: User.query.filter_by(role_id=r.id).count()
        for r in roles
    }

    # Recent 10 alerts
    recent_alerts = (
        Alert.query
        .order_by(Alert.created_at.desc())
        .limit(10)
        .all()
    )

    # Devices with low battery (≤ 20%)
    low_battery_devices = (
        Device.query
        .filter(Device.battery_level <= 20)
        .order_by(Device.battery_level.asc())
        .all()
    )

    # Most recently seen devices
    recent_devices = (
        Device.query
        .order_by(Device.last_seen.desc().nulls_last())
        .limit(8)
        .all()
    )

    return success_response(
        data={
            'counts': {
                'total_users': total_users,
                'active_users': active_users,
                'total_devices': total_devices,
                'online_devices': online_devices,
                'total_customers': total_customers,
                'open_alerts': open_alerts,
                'critical_alerts': critical_alerts,
                'total_alerts': total_alerts,
            },
            'role_distribution': role_distribution,
            'recent_alerts': [a.to_dict() for a in recent_alerts],
            'low_battery_devices': [d.to_dict() for d in low_battery_devices],
            'recent_devices': [d.to_dict() for d in recent_devices],
        },
        message='Admin dashboard summary',
    )


@dashboard_admin_bp.route('/users', methods=['GET'])
@role_required('admin')
def list_users():
    """Paginated list of all system users with role info."""
    page     = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 20, type=int), 100)
    search   = request.args.get('search', '').strip()

    q = User.query
    if search:
        q = q.filter(
            (User.username.ilike(f'%{search}%')) | (User.email.ilike(f'%{search}%'))
        )

    total = q.count()
    users = q.order_by(User.created_at.desc()).offset((page - 1) * per_page).limit(per_page).all()

    return success_response(
        data={
            'users': [u.to_dict() for u in users],
            'pagination': {'page': page, 'per_page': per_page, 'total': total},
        },
        message='User list retrieved',
    )


@dashboard_admin_bp.route('/users/<int:user_id>/toggle-active', methods=['POST'])
@role_required('admin')
def toggle_user_active(user_id: int):
    """Activate or deactivate a user account."""
    user = db.session.get(User, user_id)
    if not user:
        return error_response('User not found', status_code=404)

    user.is_active = not user.is_active
    db.session.commit()

    return success_response(
        data={'user': user.to_dict()},
        message=f"User {'activated' if user.is_active else 'deactivated'}",
    )
