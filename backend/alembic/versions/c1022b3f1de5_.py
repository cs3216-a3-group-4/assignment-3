"""empty message

Revision ID: c1022b3f1de5
Revises: 7f60f0211af1, 951ac4411b0d
Create Date: 2024-09-27 01:37:39.117941

"""

from typing import Sequence, Union


# revision identifiers, used by Alembic.
revision: str = "c1022b3f1de5"
down_revision: Union[str, None] = ("7f60f0211af1", "951ac4411b0d")
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
