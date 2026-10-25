"""
Models package — import all models here so Flask-Migrate auto-discovers them.
Import order matters: Role and Permission before User (FK references).
"""
from app.models.role import Role
from app.models.permission import Permission, role_permissions
from app.models.user import User
from app.models.customer import Customer
from app.models.device import Device
from app.models.alert import Alert

__all__ = ['Role', 'Permission', 'role_permissions', 'User', 'Customer', 'Device', 'Alert']
