"""wearable telemetry and alerts

Revision ID: b7c2e91a4d10
Revises: 4fa1f38381d2
Create Date: 2026-10-22 16:40:00.000000

"""
from alembic import op
import sqlalchemy as sa


revision = 'b7c2e91a4d10'
down_revision = '4fa1f38381d2'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('devices') as batch_op:
        batch_op.add_column(sa.Column('firmware_version', sa.String(length=40), nullable=True))
        batch_op.add_column(sa.Column('battery_level', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('last_latitude', sa.Float(), nullable=True))
        batch_op.add_column(sa.Column('last_longitude', sa.Float(), nullable=True))
        batch_op.add_column(sa.Column('last_seen', sa.DateTime(), nullable=True))

    op.create_table(
        'alerts',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('alert_type', sa.String(length=60), nullable=False),
        sa.Column('severity', sa.String(length=20), nullable=False),
        sa.Column('message', sa.String(length=500), nullable=False),
        sa.Column('acknowledged', sa.Boolean(), nullable=False),
        sa.Column('device_id', sa.Integer(), nullable=True),
        sa.Column('customer_id', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['customer_id'], ['customers.id']),
        sa.ForeignKeyConstraint(['device_id'], ['devices.id']),
        sa.PrimaryKeyConstraint('id'),
    )


def downgrade():
    op.drop_table('alerts')
    with op.batch_alter_table('devices') as batch_op:
        batch_op.drop_column('last_seen')
        batch_op.drop_column('last_longitude')
        batch_op.drop_column('last_latitude')
        batch_op.drop_column('battery_level')
        batch_op.drop_column('firmware_version')
