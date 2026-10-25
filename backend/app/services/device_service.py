"""DeviceService — business logic for wearable device management."""
from datetime import datetime, timezone

from marshmallow import ValidationError

from app.extensions import db
from app.models.device import Device
from app.models.customer import Customer
from app.models.user import User
from app.utils.pagination import paginate_query


TELEMETRY_FIELDS = (
    'firmware_version',
    'battery_level',
    'last_latitude',
    'last_longitude',
)


class DeviceService:
    @staticmethod
    def get_all(page: int = None, per_page: int = None) -> dict:
        query = Device.query.order_by(Device.id.asc())
        return paginate_query(query, page=page, per_page=per_page)

    @staticmethod
    def get_by_id(device_id: int) -> Device:
        return db.session.get(Device, device_id)

    @staticmethod
    def create(data: dict) -> Device:
        serial_number = data.get('serial_number', '').strip()
        if Device.query.filter_by(serial_number=serial_number).first():
            raise ValidationError({'serial_number': ['Device with this serial number already exists.']})

        customer_id = data.get('customer_id')
        if customer_id is not None:
            customer = db.session.get(Customer, customer_id)
            if not customer:
                raise ValidationError({'customer_id': [f'Customer with id {customer_id} does not exist.']})

        user_id = data.get('user_id')
        if user_id is not None:
            user = db.session.get(User, user_id)
            if not user:
                raise ValidationError({'user_id': [f'User with id {user_id} does not exist.']})

        device = Device(
            name=data['name'].strip(),
            serial_number=serial_number,
            device_type=data.get('device_type') or 'wearable',
            status=data.get('status', 'active'),
            firmware_version=data.get('firmware_version'),
            battery_level=data.get('battery_level'),
            last_latitude=data.get('last_latitude'),
            last_longitude=data.get('last_longitude'),
            customer_id=customer_id,
            user_id=user_id,
        )

        db.session.add(device)
        db.session.commit()
        return device

    @staticmethod
    def update(device_id: int, data: dict) -> Device:
        device = db.session.get(Device, device_id)
        if not device:
            return None

        if 'serial_number' in data and data['serial_number']:
            new_serial = data['serial_number'].strip()
            if new_serial != device.serial_number:
                existing = Device.query.filter_by(serial_number=new_serial).first()
                if existing and existing.id != device.id:
                    raise ValidationError({'serial_number': ['Device with this serial number already exists.']})
                device.serial_number = new_serial

        if 'name' in data and data['name']:
            device.name = data['name'].strip()

        if 'device_type' in data:
            device.device_type = data['device_type']

        if 'status' in data and data['status']:
            device.status = data['status']

        for field in TELEMETRY_FIELDS:
            if field in data:
                setattr(device, field, data[field])
                if field in ('last_latitude', 'last_longitude', 'battery_level'):
                    device.last_seen = datetime.now(timezone.utc)

        if 'customer_id' in data:
            customer_id = data['customer_id']
            if customer_id is not None:
                customer = db.session.get(Customer, customer_id)
                if not customer:
                    raise ValidationError({'customer_id': [f'Customer with id {customer_id} does not exist.']})
            device.customer_id = customer_id

        if 'user_id' in data:
            user_id = data['user_id']
            if user_id is not None:
                user = db.session.get(User, user_id)
                if not user:
                    raise ValidationError({'user_id': [f'User with id {user_id} does not exist.']})
            device.user_id = user_id

        db.session.commit()
        return device

    @staticmethod
    def delete(device_id: int) -> bool:
        device = db.session.get(Device, device_id)
        if not device:
            return False

        db.session.delete(device)
        db.session.commit()
        return True
