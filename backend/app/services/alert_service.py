"""AlertService — safety event persistence and acknowledgement."""
from marshmallow import ValidationError

from app.extensions import db
from app.models.alert import Alert
from app.models.customer import Customer
from app.models.device import Device
from app.utils.pagination import paginate_query


class AlertService:
    @staticmethod
    def get_all(acknowledged: bool | None = None) -> dict:
        query = Alert.query.order_by(Alert.created_at.desc())
        if acknowledged is not None:
            query = query.filter_by(acknowledged=acknowledged)
        return paginate_query(query)

    @staticmethod
    def get_by_id(alert_id: int) -> Alert | None:
        return db.session.get(Alert, alert_id)

    @staticmethod
    def create(data: dict) -> Alert:
        device_id = data.get('device_id')
        if device_id is not None and not db.session.get(Device, device_id):
            raise ValidationError({'device_id': [f'Device with id {device_id} does not exist.']})

        customer_id = data.get('customer_id')
        if customer_id is not None and not db.session.get(Customer, customer_id):
            raise ValidationError({'customer_id': [f'Customer with id {customer_id} does not exist.']})

        alert = Alert(
            alert_type=data['alert_type'].strip(),
            severity=data.get('severity', 'info'),
            message=data['message'].strip(),
            acknowledged=data.get('acknowledged', False),
            device_id=device_id,
            customer_id=customer_id,
        )
        db.session.add(alert)
        db.session.commit()
        return alert

    @staticmethod
    def update(alert_id: int, data: dict) -> Alert | None:
        alert = db.session.get(Alert, alert_id)
        if not alert:
            return None

        for field in ('alert_type', 'severity', 'message', 'acknowledged'):
            if field in data:
                setattr(alert, field, data[field])

        db.session.commit()
        return alert

    @staticmethod
    def acknowledge(alert_id: int) -> Alert | None:
        return AlertService.update(alert_id, {'acknowledged': True})

    @staticmethod
    def delete(alert_id: int) -> bool:
        alert = db.session.get(Alert, alert_id)
        if not alert:
            return False
        db.session.delete(alert)
        db.session.commit()
        return True
