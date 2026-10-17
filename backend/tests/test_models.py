"""Tests for SQLAlchemy models: fields, relationships, password hashing, timestamps."""
from app.extensions import db
from app.models.role import Role
from app.models.permission import Permission
from app.models.user import User
from app.models.customer import Customer
from app.models.device import Device


def test_user_password_hashing(app):
    """Test that passwords are automatically hashed and never stored in plaintext."""
    user = User(username='bob', email='bob@example.com')
    user.set_password('SecretP@ss123')

    assert user.password_hash is not None
    assert user.password_hash != 'SecretP@ss123'
    assert user.check_password('SecretP@ss123') is True
    assert user.check_password('WrongPassword') is False


def test_user_creation_and_to_dict(app, roles):
    """Test user creation, role association, and to_dict method."""
    user = User(
        username='alice',
        email='alice@example.com',
        role=roles['admin'],
        is_active=True,
    )
    user.set_password('AlicePass!')
    db.session.add(user)
    db.session.commit()

    assert user.id is not None
    assert user.created_at is not None
    assert user.updated_at is not None
    assert user.role.name == 'admin'

    d = user.to_dict()
    assert d['username'] == 'alice'
    assert d['email'] == 'alice@example.com'
    assert d['role'] == 'admin'
    assert 'password_hash' not in d


def test_role_and_permission_relationship(app):
    """Test many-to-many relationship between Role and Permission."""
    role = Role(name='manager', description='Manager Role')
    p1 = Permission(name='reports:view', description='View reports', resource='reports', action='view')
    p2 = Permission(name='reports:export', description='Export reports', resource='reports', action='export')

    role.permissions.extend([p1, p2])
    db.session.add_all([role, p1, p2])
    db.session.commit()

    fetched_role = Role.query.filter_by(name='manager').first()
    assert len(fetched_role.permissions) == 2
    assert p1 in fetched_role.permissions
    assert p2 in fetched_role.permissions


def test_customer_and_device_creation(app, admin_user):
    """Test Customer and Device models and relationships."""
    user, _, _ = admin_user
    customer = Customer(
        name='Beta Corp',
        email='beta@example.com',
        phone='555-0199',
        address='456 Elm St',
        user_id=user.id,
    )
    db.session.add(customer)
    db.session.commit()

    device = Device(
        name='Office Switch',
        serial_number='SW-001-BETA',
        device_type='switch',
        customer_id=customer.id,
        user_id=user.id,
    )
    db.session.add(device)
    db.session.commit()

    assert customer.id is not None
    assert device.id is not None
    assert device.customer_id == customer.id
    assert device.user_id == user.id
    assert customer.devices.count() == 1
    assert customer.devices.first().name == 'Office Switch'
