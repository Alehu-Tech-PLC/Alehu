from datetime import datetime, timezone
from app.extensions import db


# Many-to-many join table between roles and permissions
role_permissions = db.Table(
    'role_permissions',
    db.Column(
        'role_id',
        db.Integer,
        db.ForeignKey('roles.id', ondelete='CASCADE'),
        primary_key=True,
    ),
    db.Column(
        'permission_id',
        db.Integer,
        db.ForeignKey('permissions.id', ondelete='CASCADE'),
        primary_key=True,
    ),
)


class Permission(db.Model):
    __tablename__ = 'permissions'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.String(255), nullable=True)
    resource = db.Column(db.String(100), nullable=False)
    action = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    roles = db.relationship(
        'Role',
        secondary='role_permissions',
        back_populates='permissions',
        lazy='subquery',
    )

    def __repr__(self):
        return f'<Permission {self.name}>'

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'resource': self.resource,
            'action': self.action,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }
