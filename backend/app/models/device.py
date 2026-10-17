from datetime import datetime, timezone
from app.extensions import db


class Device(db.Model):
    __tablename__ = 'devices'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    serial_number = db.Column(db.String(100), unique=True, nullable=False)
    device_type = db.Column(db.String(80), nullable=True)
    status = db.Column(db.String(30), default='active', nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    customer = db.relationship('Customer', back_populates='devices')
    user = db.relationship('User', back_populates='devices')

    def __repr__(self):
        return f'<Device {self.serial_number}>'

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'serial_number': self.serial_number,
            'device_type': self.device_type,
            'status': self.status,
            'customer_id': self.customer_id,
            'user_id': self.user_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }
