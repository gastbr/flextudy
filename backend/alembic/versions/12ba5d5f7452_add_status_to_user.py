"""add status to user

Revision ID: 12ba5d5f7452
Revises: a3948c706c5c
Create Date: 2025-04-25 10:34:43.313072

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '12ba5d5f7452'
down_revision: Union[str, None] = 'a3948c706c5c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('user', sa.Column('status', sa.String(), nullable=False))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('user', 'status')
    # ### end Alembic commands ###
