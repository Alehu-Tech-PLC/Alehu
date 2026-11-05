"""
Seed script — populates the database with initial sample data.

This script is idempotent: it checks for existing records before inserting,
so it can be run multiple times without duplicating data.

Usage:
    from app import create_app
    from app.seed import seed_db
    app = create_app()
    seed_db(app)
"""
from app.extensions import db
from app.models.role import Role
from app.models.permission import Permission
from app.models.user import User
from app.models.customer import Customer
from app.models.device import Device
from app.models.alert import Alert


def seed_db(app):
    """Insert sample data into every table (idempotent)."""
    with app.app_context():
        _seed_roles()
        _seed_permissions()
        _seed_role_permissions()
        _seed_users()
        _seed_customers()
        _seed_devices()
        _seed_alerts()
        db.session.commit()
        print("✓ Seed complete.")


# ---------------------------------------------------------------------------
# Roles
# ---------------------------------------------------------------------------
def _seed_roles():
    roles_data = [
        {"name": "admin",          "description": "Alehu system administrator"},
        {"name": "user",           "description": "Regular user role"},
        {"name": "parent",         "description": "Parent / guardian of a child wearing an Alehu band"},
        {"name": "police_officer", "description": "Law-enforcement officer with incident response access"},
    ]
    for data in roles_data:
        if not Role.query.filter_by(name=data["name"]).first():
            role = Role(name=data["name"], description=data["description"])
            db.session.add(role)
            print(f"  + Role: {data['name']}")
        else:
            print(f"  ~ Role already exists: {data['name']}")
    db.session.flush()


# ---------------------------------------------------------------------------
# Permissions
# ---------------------------------------------------------------------------
def _seed_permissions():
    permissions_data = [
        {
            "name": "users:read",
            "description": "Read users",
            "resource": "users",
            "action": "read",
        },
        {
            "name": "users:write",
            "description": "Write users",
            "resource": "users",
            "action": "write",
        },
        {
            "name": "devices:manage",
            "description": "Manage devices",
            "resource": "devices",
            "action": "manage",
        },
        {
            "name": "alerts:read",
            "description": "Read alerts",
            "resource": "alerts",
            "action": "read",
        },
        {
            "name": "alerts:respond",
            "description": "Acknowledge and respond to alerts",
            "resource": "alerts",
            "action": "respond",
        },
        {
            "name": "dashboard:parent",
            "description": "Access parent dashboard",
            "resource": "dashboard",
            "action": "parent",
        },
        {
            "name": "dashboard:police",
            "description": "Access police-officer dashboard",
            "resource": "dashboard",
            "action": "police",
        },
        {
            "name": "dashboard:admin",
            "description": "Access admin dashboard",
            "resource": "dashboard",
            "action": "admin",
        },
    ]
    for data in permissions_data:
        if not Permission.query.filter_by(name=data["name"]).first():
            perm = Permission(
                name=data["name"],
                description=data["description"],
                resource=data["resource"],
                action=data["action"],
            )
            db.session.add(perm)
            print(f"  + Permission: {data['name']}")
        else:
            print(f"  ~ Permission already exists: {data['name']}")
    db.session.flush()


# ---------------------------------------------------------------------------
# Role ↔ Permission assignments
# ---------------------------------------------------------------------------
def _seed_role_permissions():
    admin_role   = Role.query.filter_by(name="admin").first()
    user_role    = Role.query.filter_by(name="user").first()
    parent_role  = Role.query.filter_by(name="parent").first()
    police_role  = Role.query.filter_by(name="police_officer").first()

    perm_users_read     = Permission.query.filter_by(name="users:read").first()
    perm_users_write    = Permission.query.filter_by(name="users:write").first()
    perm_devices_mgmt   = Permission.query.filter_by(name="devices:manage").first()
    perm_alerts_read    = Permission.query.filter_by(name="alerts:read").first()
    perm_alerts_respond = Permission.query.filter_by(name="alerts:respond").first()
    perm_dash_parent    = Permission.query.filter_by(name="dashboard:parent").first()
    perm_dash_police    = Permission.query.filter_by(name="dashboard:police").first()
    perm_dash_admin     = Permission.query.filter_by(name="dashboard:admin").first()

    def _assign(role, perms):
        for perm in perms:
            if perm and perm not in role.permissions:
                role.permissions.append(perm)
                print(f"  + Assigned '{perm.name}' → {role.name}")
            elif perm:
                print(f"  ~ '{perm.name}' already assigned to {role.name}")

    # admin: everything
    _assign(admin_role, [
        perm_users_read, perm_users_write, perm_devices_mgmt,
        perm_alerts_read, perm_alerts_respond, perm_dash_admin,
    ])

    # user: read-only
    _assign(user_role, [perm_users_read, perm_alerts_read])

    # parent: own device data + alerts
    _assign(parent_role, [perm_alerts_read, perm_dash_parent])

    # police_officer: critical alerts + incident response
    _assign(police_role, [perm_alerts_read, perm_alerts_respond, perm_dash_police])

    db.session.flush()


# ---------------------------------------------------------------------------
# Users
# ---------------------------------------------------------------------------
def _seed_users():
    admin_role   = Role.query.filter_by(name="admin").first()
    user_role    = Role.query.filter_by(name="user").first()
    parent_role  = Role.query.filter_by(name="parent").first()
    police_role  = Role.query.filter_by(name="police_officer").first()

    users_data = [
        {
            "username": "admin",
            "email": "admin@alehu.com",
            "password": "Admin123!",
            "role": admin_role,
        },
        {
            "username": "john",
            "email": "john@alehu.com",
            "password": "User123!",
            "role": user_role,
        },
        {
            "username": "parent_demo",
            "email": "parent@alehu.com",
            "password": "Parent123!",
            "role": parent_role,
        },
        {
            "username": "officer_demo",
            "email": "officer@alehu.com",
            "password": "Officer123!",
            "role": police_role,
        },
    ]
    for data in users_data:
        if not User.query.filter_by(email=data["email"]).first():
            user = User(
                username=data["username"],
                email=data["email"],
                role=data["role"],
                is_active=True,
            )
            user.set_password(data["password"])
            db.session.add(user)
            print(f"  + User: {data['email']}")
        else:
            print(f"  ~ User already exists: {data['email']}")
    db.session.flush()


# ---------------------------------------------------------------------------
# Customers
# ---------------------------------------------------------------------------
def _seed_customers():
    admin_user = User.query.filter_by(email="admin@alehu.com").first()
    parent_user = User.query.filter_by(email="parent@alehu.com").first()

    customers_data = [
        {
            "name": "Sunshine Daycare",
            "email": "hello@sunshinedaycare.et",
            "phone": "+251911000111",
            "user": admin_user,
        },
        {
            "name": "Greenfield Primary",
            "email": "office@greenfield.et",
            "phone": "+251911000222",
            "user": admin_user,
        },
        {
            "name": "Addis Guardian Circle",
            "email": "parents@guardiancircle.et",
            "phone": "+251911000333",
            "user": admin_user,
        },
        {
            "name": "Sara Tesfaye (Parent)",
            "email": "sara@family.et",
            "phone": "+251912000444",
            "user": parent_user,
        },
    ]
    for data in customers_data:
        if not Customer.query.filter_by(email=data["email"]).first():
            customer = Customer(
                name=data["name"],
                email=data["email"],
                user=data["user"],
            )
            db.session.add(customer)
            print(f"  + Customer: {data['name']}")
        else:
            print(f"  ~ Customer already exists: {data['name']}")
    db.session.flush()


# ---------------------------------------------------------------------------
# Devices
# ---------------------------------------------------------------------------
def _seed_devices():
    admin_user  = User.query.filter_by(email="admin@alehu.com").first()
    parent_user = User.query.filter_by(email="parent@alehu.com").first()

    daycare = Customer.query.filter_by(name="Sunshine Daycare").first()
    school  = Customer.query.filter_by(name="Greenfield Primary").first()
    circle  = Customer.query.filter_by(name="Addis Guardian Circle").first()
    sara    = Customer.query.filter_by(name="Sara Tesfaye (Parent)").first()

    devices_data = [
        {
            "name": "Alehu Band — Maya",
            "serial_number": "ALH-BAND-001",
            "device_type": "wearable",
            "customer": daycare,
            "user": admin_user,
            "battery_level": 86,
            "last_latitude": 9.0108,
            "last_longitude": 38.7613,
            "firmware_version": "1.0.4",
        },
        {
            "name": "Alehu Band — Noah",
            "serial_number": "ALH-BAND-002",
            "device_type": "wearable",
            "customer": school,
            "user": admin_user,
            "battery_level": 42,
            "last_latitude": 9.0227,
            "last_longitude": 38.7469,
            "firmware_version": "1.0.4",
        },
        {
            "name": "Alehu Band — Selam",
            "serial_number": "ALH-BAND-003",
            "device_type": "wearable",
            "customer": circle,
            "user": admin_user,
            "battery_level": 97,
            "last_latitude": 8.9806,
            "last_longitude": 38.7578,
            "firmware_version": "1.0.3",
        },
        {
            "name": "Alehu Band — Abel",
            "serial_number": "ALH-BAND-004",
            "device_type": "wearable",
            "customer": daycare,
            "user": admin_user,
            "battery_level": 18,
            "last_latitude": 9.0054,
            "last_longitude": 38.7636,
            "firmware_version": "1.0.4",
        },
        {
            "name": "Alehu Band — Liya",
            "serial_number": "ALH-BAND-005",
            "device_type": "wearable",
            "customer": sara,
            "user": parent_user,
            "battery_level": 74,
            "last_latitude": 9.0152,
            "last_longitude": 38.7621,
            "firmware_version": "1.0.4",
        },
    ]
    for data in devices_data:
        if not Device.query.filter_by(serial_number=data["serial_number"]).first():
            device = Device(
                name=data["name"],
                serial_number=data["serial_number"],
                device_type=data["device_type"],
                customer=data["customer"],
                user=data["user"],
                status="active",
                battery_level=data["battery_level"],
                last_latitude=data["last_latitude"],
                last_longitude=data["last_longitude"],
                firmware_version=data["firmware_version"],
            )
            db.session.add(device)
            print(f"  + Device: {data['name']} ({data['serial_number']})")
        else:
            print(f"  ~ Device already exists: {data['serial_number']}")
    db.session.flush()


def _seed_alerts():
    maya  = Device.query.filter_by(serial_number="ALH-BAND-001").first()
    noah  = Device.query.filter_by(serial_number="ALH-BAND-002").first()
    abel  = Device.query.filter_by(serial_number="ALH-BAND-004").first()
    liya  = Device.query.filter_by(serial_number="ALH-BAND-005").first()

    alerts_data = [
        {
            "alert_type": "geofence",
            "severity": "warning",
            "message": "Noah left the school safe zone 4 minutes ago.",
            "device": noah,
            "acknowledged": False,
        },
        {
            "alert_type": "fall",
            "severity": "critical",
            "message": "Impact pattern detected on Maya's band.",
            "device": maya,
            "acknowledged": False,
        },
        {
            "alert_type": "battery",
            "severity": "info",
            "message": "Abel's wearable is below 20% battery.",
            "device": abel,
            "acknowledged": True,
        },
        {
            "alert_type": "geofence",
            "severity": "critical",
            "message": "Liya has left the home safe zone.",
            "device": liya,
            "acknowledged": False,
        },
        {
            "alert_type": "sos",
            "severity": "critical",
            "message": "Silent SOS triggered on Liya's band.",
            "device": liya,
            "acknowledged": False,
        },
    ]
    for data in alerts_data:
        device = data["device"]
        if not device:
            continue
        exists = Alert.query.filter_by(message=data["message"]).first()
        if exists:
            print(f"  ~ Alert already exists: {data['alert_type']}")
            continue
        db.session.add(Alert(
            alert_type=data["alert_type"],
            severity=data["severity"],
            message=data["message"],
            acknowledged=data["acknowledged"],
            device_id=device.id,
            customer_id=device.customer_id,
        ))
        print(f"  + Alert: {data['alert_type']}")
    db.session.flush()
