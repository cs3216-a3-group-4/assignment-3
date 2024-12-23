"""Change AnalysisConcept to ArticleConcepts

Revision ID: 46c8413a6057
Revises: 7e94c7b5ee8d
Create Date: 2024-10-21 15:31:20.726480

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "46c8413a6057"
down_revision: Union[str, None] = "7e94c7b5ee8d"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "article_concept",
        sa.Column("concept_id", sa.Integer(), nullable=False),
        sa.Column("article_id", sa.Integer(), nullable=False),
        sa.Column("explanation", sa.String(), nullable=False),
        sa.Column(
            "created_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False
        ),
        sa.Column(
            "updated_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False
        ),
        sa.ForeignKeyConstraint(
            ["article_id"],
            ["article.id"],
        ),
        sa.ForeignKeyConstraint(
            ["concept_id"],
            ["concept.id"],
        ),
        sa.PrimaryKeyConstraint("concept_id", "article_id"),
    )
    op.drop_table("analysis_concept")
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "analysis_concept",
        sa.Column("concept_id", sa.INTEGER(), autoincrement=False, nullable=False),
        sa.Column("analysis_id", sa.INTEGER(), autoincrement=False, nullable=False),
        sa.Column("explanation", sa.VARCHAR(), autoincrement=False, nullable=False),
        sa.Column(
            "created_at",
            postgresql.TIMESTAMP(),
            server_default=sa.text("now()"),
            autoincrement=False,
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            postgresql.TIMESTAMP(),
            server_default=sa.text("now()"),
            autoincrement=False,
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["analysis_id"], ["analysis.id"], name="analysis_concept_analysis_id_fkey"
        ),
        sa.ForeignKeyConstraint(
            ["concept_id"], ["concept.id"], name="analysis_concept_concept_id_fkey"
        ),
        sa.PrimaryKeyConstraint(
            "concept_id", "analysis_id", name="analysis_concept_pkey"
        ),
    )
    op.drop_table("article_concept")
    # ### end Alembic commands ###
