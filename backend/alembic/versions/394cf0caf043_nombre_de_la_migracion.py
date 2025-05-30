"""Nombre de la migracion

Revision ID: 394cf0caf043
Revises: 96cbe4f6df2e
Create Date: 2025-03-24 16:00:25.570492

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '394cf0caf043'
down_revision: Union[str, None] = '96cbe4f6df2e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('example',
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('description', sa.String(), nullable=True),
    sa.Column('other', sa.String(), nullable=True),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('my_route',
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('description', sa.String(), nullable=True),
    sa.Column('other', sa.String(), nullable=True),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('subject',
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('usertype',
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('user',
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('email', sa.String(), nullable=False),
    sa.Column('profile_pic', sa.String(), nullable=False),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_type_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['user_type_id'], ['usertype.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('topic',
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('description', sa.String(), nullable=False),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('subject_id', sa.Integer(), nullable=True),
    sa.Column('teacher_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['subject_id'], ['subject.id'], ),
    sa.ForeignKeyConstraint(['teacher_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('lesson',
    sa.Column('max_capacity', sa.Integer(), nullable=False),
    sa.Column('start_time', sa.String(), nullable=False),
    sa.Column('end_time', sa.String(), nullable=False),
    sa.Column('lesson_url', sa.String(), nullable=False),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('topic_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['topic_id'], ['topic.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('attend',
    sa.Column('assistance', sa.Boolean(), nullable=False),
    sa.Column('student_id', sa.Integer(), nullable=False),
    sa.Column('lesson_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['lesson_id'], ['lesson.id'], ),
    sa.ForeignKeyConstraint(['student_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('student_id', 'lesson_id')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('attend')
    op.drop_table('lesson')
    op.drop_table('topic')
    op.drop_table('user')
    op.drop_table('usertype')
    op.drop_table('subject')
    op.drop_table('my_route')
    op.drop_table('example')
    # ### end Alembic commands ###
