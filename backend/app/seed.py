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


def seed_db(app):
    """Insert sample data into every table (idempotent)."""
    with app.app_context():
        _seed_roles()
        _seed_permissions()
        _seed_role_permissions()
        _seed_users()
        _seed_customers()
        _seed_devices()
        db.session.commit()
        print("✓ Seed complete.")


# ---------------------------------------------------------------------------
# Roles
# ---------------------------------------------------------------------------
def _seed_roles():
    roles_data = [
        {"name": "admin", "description": "Administrator role"},
        {"name": "user",  "description": "Regular user role"},
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
    admin_role = Role.query.filter_by(name="admin").first()
    user_role  = Role.query.filter_by(name="user").first()

    perm_users_read   = Permission.query.filter_by(name="users:read").first()
    perm_users_write  = Permission.query.filter_by(name="users:write").first()
    perm_devices_mgmt = Permission.query.filter_by(name="devices:manage").first()

    # admin gets all 3 permissions
    for perm in [perm_users_read, perm_users_write, perm_devices_mgmt]:
        if perm and perm not in admin_role.permissions:
            admin_role.permissions.append(perm)
            print(f"  + Assigned '{perm.name}' → admin role")
        elif perm:
            print(f"  ~ Permission '{perm.name}' already assigned to admin")

    # user role gets users:read only
    if perm_users_read and perm_users_read not in user_role.permissions:
        user_role.permissions.append(perm_users_read)
        print("  + Assigned 'users:read' → user role")
    elif perm_users_read:
        print("  ~ Permission 'users:read' already assigned to user")

    db.session.flush()


# ---------------------------------------------------------------------------
# Users
# ---------------------------------------------------------------------------
def _seed_users():
    admin_role = Role.query.filter_by(name="admin").first()
    user_role  = Role.query.filter_by(name="user").first()

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

    customers_data = [
        {"name": "TechCorp",    "email": "techcorp@example.com"},
        {"name": "DataSystems", "email": "datasys@example.com"},
        {"name": "CloudBase",   "email": "cloudbase@example.com"},
    ]
    for data in customers_data:
        if not Customer.query.filter_by(email=data["email"]).first():
            customer = Customer(
                name=data["name"],
                email=data["email"],
                user=admin_user,
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
    admin_user = User.query.filter_by(email="admin@alehu.com").first()

    techcorp    = Customer.query.filter_by(name="TechCorp").first()
    datasystems = Customer.query.filter_by(name="DataSystems").first()
    cloudbase   = Customer.query.filter_by(name="CloudBase").first()

    devices_data = [
        {
            "name": "Router-01",
            "serial_number": "RTR001",
            "device_type": "router",
            "customer": techcorp,
        },
        {
            "name": "Switch-01",
            "serial_number": "SW001",
            "device_type": "switch",
            "customer": techcorp,
        },
        {
            "name": "Laptop-01",
            "serial_number": "LPT001",
            "device_type": "laptop",
            "customer": datasystems,
        },
        {
            "name": "Server-01",
            "serial_number": "SRV001",
            "device_type": "server",
            "customer": cloudbase,
        },
    ]
    for data in devices_data:
        if not Device.query.filter_by(serial_number=data["serial_number"]).first():
            device = Device(
                name=data["name"],
                serial_number=data["serial_number"],
                device_type=data["device_type"],
                customer=data["customer"],
                user=admin_user,
                status="active",
            )
            db.session.add(device)
            print(f"  + Device: {data['name']} ({data['serial_number']})")
        else:
            print(f"  ~ Device already exists: {data['serial_number']}")
    db.session.flush()
