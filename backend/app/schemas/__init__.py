"""Schema package — exports all marshmallow schemas."""
from .auth_schema import RegisterSchema, LoginSchema
from .user_schema import UserSchema, UserCreateSchema, UserUpdateSchema
from .customer_schema import CustomerCreateSchema, CustomerUpdateSchema, CustomerSchema
from .device_schema import DeviceCreateSchema, DeviceUpdateSchema, DeviceSchema
from .role_schema import RoleSchema, RoleCreateSchema, RoleUpdateSchema, RoleAssignPermissionsSchema
from .permission_schema import PermissionSchema, PermissionCreateSchema

__all__ = [
    # Auth
    "RegisterSchema",
    "LoginSchema",
    # User
    "UserSchema",
    "UserCreateSchema",
    "UserUpdateSchema",
    # Customer
    "CustomerCreateSchema",
    "CustomerUpdateSchema",
    "CustomerSchema",
    # Device
    "DeviceCreateSchema",
    "DeviceUpdateSchema",
    "DeviceSchema",
    # Role
    "RoleSchema",
    "RoleCreateSchema",
    "RoleUpdateSchema",
    "RoleAssignPermissionsSchema",
    # Permission
    "PermissionSchema",
    "PermissionCreateSchema",
]
