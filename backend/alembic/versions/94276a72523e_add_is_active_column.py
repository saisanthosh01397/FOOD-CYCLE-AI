"""add_is_active_column

Revision ID: 94276a72523e
Revises: 9efa6494f433
Create Date: 2026-09-27 23:03:51.209358

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision: str = '94276a72523e'
down_revision: Union[str, Sequence[str], None] = '9efa6494f433'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('users', sa.Column('is_active', sa.Boolean(), nullable=False, server_default='1'))

def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('users', 'is_active')
