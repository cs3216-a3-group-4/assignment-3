"""Link user and tier tables

Revision ID: ab4ed15e0a83
Revises: 1b8471e6604d
Create Date: 2024-10-09 17:20:31.305894

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "ab4ed15e0a83"
down_revision: Union[str, None] = "1b8471e6604d"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        "user", sa.Column("tier_id", sa.Integer(), server_default="1", nullable=False)
    )
    op.create_foreign_key(None, "user", "tier", ["tier_id"], ["id"])
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, "user", type_="foreignkey")
    op.drop_column("user", "tier_id")
    # ### end Alembic commands ###
