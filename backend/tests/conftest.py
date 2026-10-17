"""Pytest configuration and shared test fixtures."""
import pytest
from flask_jwt_extended import create_access_token

from app import create_app
from app.extensions import db
from app.models.role import Role
from app.models.permission import Permission
from app.models.user import User
from app.models.customer import Customer
from app.models.device import Device


@pytest.fixture
def app():
    """Create a new Flask app instance configured for testing."""
    application = create_app('testing')
    with application.app_context():
        db.create_all()
        yield application
        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(app):
    """A test client for the application."""
    return app.test_client()


@pytest.fixture
def roles(app):
    """Seed base roles for tests."""
    admin_role = Role(name='admin', description='Administrator')
    user_role = Role(name='user', description='Regular User')
    db.session.add_all([admin_role, user_role])
    db.session.commit()
    return {'admin': admin_role, 'user': user_role}


@pytest.fixture
def admin_user(app, roles):
    """Create an admin user and return (user, access_token, headers)."""
    user = User(
        username='testadmin',
        email='admin@test.com',
        role=roles['admin'],
        is_active=True,
    )
    user.set_password('AdminPass123!')
    db.session.add(user)
    db.session.commit()

    token = create_access_token(identity=str(user.id))
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json',
    }
    return user, token, headers


@pytest.fixture
def regular_user(app, roles):
    """Create a regular user and return (user, access_token, headers)."""
    user = User(
        username='testuser',
        email='user@test.com',
        role=roles['user'],
        is_active=True,
    )
    user.set_password('UserPass123!')
    db.session.add(user)
    db.session.commit()

    token = create_access_token(identity=str(user.id))
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json',
    }
    return user, token, headers


@pytest.fixture
def sample_customer(app, admin_user):
    """Create a sample customer record."""
    user, _, _ = admin_user
    customer = Customer(
        name='Acme Corp',
        email='contact@acme.com',
        phone='123-456-7890',
        address='123 Market St',
        user_id=user.id,
    )
    db.session.add(customer)
    db.session.commit()
    return customer


@pytest.fixture
def sample_device(app, sample_customer, admin_user):
    """Create a sample device record."""
    user, _, _ = admin_user
    device = Device(
        name='Main Router',
        serial_number='SN-ROUTER-99',
        device_type='Router',
        status='active',
        customer_id=sample_customer.id,
        user_id=user.id,
    )
    db.session.add(device)
    db.session.commit()
    return device
