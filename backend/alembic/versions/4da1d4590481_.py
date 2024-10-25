"""empty message

Revision ID: 4da1d4590481
Revises: 125e6db5e654, ed7688df4af4
Create Date: 2024-10-23 16:43:49.897188

"""

from typing import Sequence, Union


# revision identifiers, used by Alembic.
revision: str = "4da1d4590481"
down_revision: Union[str, None] = ("125e6db5e654", "ed7688df4af4")
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
