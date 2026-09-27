"""add_missing_user_columns

Revision ID: 43f2fa62f9a6
Revises: 94276a72523e
Create Date: 2026-09-27 23:20:47.119625

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '43f2fa62f9a6'
down_revision: Union[str, Sequence[str], None] = '94276a72523e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('users', sa.Column('last_login', sa.DateTime(), nullable=True))
    op.add_column('users', sa.Column('total_predictions', sa.Integer(), nullable=False, server_default='0'))
    op.add_column('users', sa.Column('total_image_analyses', sa.Integer(), nullable=False, server_default='0'))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('users', 'total_image_analyses')
    op.drop_column('users', 'total_predictions')
    op.drop_column('users', 'last_login')
