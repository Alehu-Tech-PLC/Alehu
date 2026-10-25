from datetime import datetime, timezone
from app.extensions import db


class Alert(db.Model):
    __tablename__ = 'alerts'

    id = db.Column(db.Integer, primary_key=True)
    alert_type = db.Column(db.String(60), nullable=False)
    severity = db.Column(db.String(20), default='info', nullable=False)
    message = db.Column(db.String(500), nullable=False)
    acknowledged = db.Column(db.Boolean, default=False, nullable=False)
    device_id = db.Column(db.Integer, db.ForeignKey('devices.id'), nullable=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    device = db.relationship('Device', back_populates='alerts')
    customer = db.relationship('Customer', back_populates='alerts')

    def __repr__(self):
        return f'<Alert {self.alert_type} {self.id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'alert_type': self.alert_type,
            'severity': self.severity,
            'message': self.message,
            'acknowledged': self.acknowledged,
            'device_id': self.device_id,
            'customer_id': self.customer_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }
