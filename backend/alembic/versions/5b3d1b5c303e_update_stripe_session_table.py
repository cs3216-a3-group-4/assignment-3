"""Update stripe_session table

Revision ID: 5b3d1b5c303e
Revises: ca97c704b851
Create Date: 2024-10-23 15:52:32.429271

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5b3d1b5c303e'
down_revision: Union[str, None] = 'ca97c704b851'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('stripe_session', 'subscription_id',
               existing_type=sa.VARCHAR(),
               nullable=True)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('stripe_session', 'subscription_id',
               existing_type=sa.VARCHAR(),
               nullable=False)
    # ### end Alembic commands ###
