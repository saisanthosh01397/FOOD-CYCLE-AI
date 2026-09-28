"""fix_users_role_enum

Revision ID: 1bb0ee6f437f
Revises: 43f2fa62f9a6
Create Date: 2026-09-27 23:45:47.839543

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1bb0ee6f437f'
down_revision: Union[str, Sequence[str], None] = '43f2fa62f9a6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


from sqlalchemy.dialects import mysql

def upgrade() -> None:
    """Upgrade schema."""
    op.alter_column('users', 'role',
                    existing_type=mysql.ENUM('admin', 'manager', 'viewer'),
                    type_=mysql.ENUM('administrator', 'mess_manager'),
                    existing_nullable=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.alter_column('users', 'role',
                    existing_type=mysql.ENUM('administrator', 'mess_manager'),
                    type_=mysql.ENUM('admin', 'manager', 'viewer'),
                    existing_nullable=False)
