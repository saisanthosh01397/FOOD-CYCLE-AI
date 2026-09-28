"""add_missing_analytics_columns

Revision ID: d32e51750b24
Revises: e0967c95f2fd
Create Date: 2026-09-28 16:53:24.819308

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd32e51750b24'
down_revision: Union[str, Sequence[str], None] = 'e0967c95f2fd'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('food_waste_logs', sa.Column('actual_measurements', sa.JSON(), nullable=True))
    op.add_column('image_metadata', sa.Column('log_id', sa.String(length=36), nullable=True))
    op.add_column('waste_predictions', sa.Column('items', sa.JSON(), nullable=False))
    op.add_column('waste_predictions', sa.Column('total_preparation_kg', sa.Float(), nullable=False))
    op.add_column('waste_predictions', sa.Column('total_expected_waste_kg', sa.Float(), nullable=False))
    op.add_column('waste_predictions', sa.Column('preventive_actions', sa.JSON(), nullable=False))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('waste_predictions', 'preventive_actions')
    op.drop_column('waste_predictions', 'total_expected_waste_kg')
    op.drop_column('waste_predictions', 'total_preparation_kg')
    op.drop_column('waste_predictions', 'items')
    op.drop_column('image_metadata', 'log_id')
    op.drop_column('food_waste_logs', 'actual_measurements')
