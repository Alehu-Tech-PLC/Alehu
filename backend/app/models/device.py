from datetime import datetime, timezone
from app.extensions import db


class Device(db.Model):
    __tablename__ = 'devices'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    serial_number = db.Column(db.String(100), unique=True, nullable=False)
    device_type = db.Column(db.String(80), nullable=True)
    status = db.Column(db.String(30), default='active', nullable=False)
    firmware_version = db.Column(db.String(40), nullable=True)
    battery_level = db.Column(db.Integer, nullable=True)
    last_latitude = db.Column(db.Float, nullable=True)
    last_longitude = db.Column(db.Float, nullable=True)
    last_seen = db.Column(db.DateTime, nullable=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    customer = db.relationship('Customer', back_populates='devices')
    user = db.relationship('User', back_populates='devices')
    alerts = db.relationship('Alert', back_populates='device', lazy='dynamic', cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Device {self.serial_number}>'

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'serial_number': self.serial_number,
            'device_type': self.device_type,
            'status': self.status,
            'firmware_version': self.firmware_version,
            'battery_level': self.battery_level,
            'last_latitude': self.last_latitude,
            'last_longitude': self.last_longitude,
            'last_seen': self.last_seen.isoformat() if self.last_seen else None,
            'customer_id': self.customer_id,
            'user_id': self.user_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }
