"""Fix minor typos

Revision ID: be03a1fbbf72
Revises: 46c8413a6057
Create Date: 2024-10-21 15:45:22.321050

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'be03a1fbbf72'
down_revision: Union[str, None] = '46c8413a6057'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('article_concepts',
    sa.Column('concept_id', sa.Integer(), nullable=False),
    sa.Column('article_id', sa.Integer(), nullable=False),
    sa.Column('explanation', sa.String(), nullable=False),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
    sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
    sa.ForeignKeyConstraint(['article_id'], ['article.id'], ),
    sa.ForeignKeyConstraint(['concept_id'], ['concept.id'], ),
    sa.PrimaryKeyConstraint('concept_id', 'article_id')
    )
    op.drop_table('article_concept')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('article_concept',
    sa.Column('concept_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('article_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('explanation', sa.VARCHAR(), autoincrement=False, nullable=False),
    sa.Column('created_at', postgresql.TIMESTAMP(), server_default=sa.text('now()'), autoincrement=False, nullable=False),
    sa.Column('updated_at', postgresql.TIMESTAMP(), server_default=sa.text('now()'), autoincrement=False, nullable=False),
    sa.ForeignKeyConstraint(['article_id'], ['article.id'], name='article_concept_article_id_fkey'),
    sa.ForeignKeyConstraint(['concept_id'], ['concept.id'], name='article_concept_concept_id_fkey'),
    sa.PrimaryKeyConstraint('concept_id', 'article_id', name='article_concept_pkey')
    )
    op.drop_table('article_concepts')
    # ### end Alembic commands ###
