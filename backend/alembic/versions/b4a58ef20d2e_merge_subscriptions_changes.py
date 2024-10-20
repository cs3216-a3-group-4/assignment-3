"""Merge subscriptions changes

Revision ID: b4a58ef20d2e
Revises: 933d84ad4302, 7e94c7b5ee8d
Create Date: 2024-10-20 20:40:56.104719

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b4a58ef20d2e'
down_revision: Union[str, None] = ('933d84ad4302', '7e94c7b5ee8d')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
