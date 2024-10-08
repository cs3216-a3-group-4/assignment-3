"""Add user question models


Revision ID: 04e02312343d
Revises: d369cd69a23b
Create Date: 2024-09-22 21:35:48.778303

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "04e02312343d"
down_revision: Union[str, None] = "d369cd69a23b"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "user_question",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("question", sa.String(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["user.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "answer",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_question_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(
            ["user_question_id"],
            ["user_question.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "point",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("body", sa.String(), nullable=False),
        sa.Column("answer_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(
            ["answer_id"],
            ["answer.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table("point")
    op.drop_table("answer")
    op.drop_table("user_question")
    # ### end Alembic commands ###
