"""Add upi_qr_code column to Space model

Revision ID: b8581207ac77
Revises: 
Create Date: 2025-06-10 19:06:53.842856

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'b8581207ac77'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    #op.drop_table('chat_messages')
    with op.batch_alter_table('owners', schema=None) as batch_op:
        batch_op.alter_column('username',
               existing_type=sa.VARCHAR(length=100),
               type_=sa.String(length=255),
               existing_nullable=False)
        batch_op.alter_column('email',
               existing_type=sa.VARCHAR(length=150),
               type_=sa.String(length=255),
               existing_nullable=False)
        batch_op.alter_column('password',
               existing_type=sa.VARCHAR(length=200),
               type_=sa.Text(),
               existing_nullable=False)

    with op.batch_alter_table('spaces', schema=None) as batch_op:
        batch_op.add_column(sa.Column('upi_qr_code', sa.String(length=255), nullable=True))

    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.create_unique_constraint(None, ['username'])
        batch_op.drop_column('created_at')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('created_at', postgresql.TIMESTAMP(), server_default=sa.text('CURRENT_TIMESTAMP'), autoincrement=False, nullable=True))
        batch_op.drop_constraint(None, type_='unique')

    with op.batch_alter_table('spaces', schema=None) as batch_op:
        batch_op.drop_column('upi_qr_code')

    with op.batch_alter_table('owners', schema=None) as batch_op:
        batch_op.alter_column('password',
               existing_type=sa.Text(),
               type_=sa.VARCHAR(length=200),
               existing_nullable=False)
        batch_op.alter_column('email',
               existing_type=sa.String(length=255),
               type_=sa.VARCHAR(length=150),
               existing_nullable=False)
        batch_op.alter_column('username',
               existing_type=sa.String(length=255),
               type_=sa.VARCHAR(length=100),
               existing_nullable=False)

    op.create_table('chat_messages',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('sender_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('receiver_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('sender_type', sa.VARCHAR(), autoincrement=False, nullable=False),
    sa.Column('receiver_type', sa.VARCHAR(), autoincrement=False, nullable=False),
    sa.Column('space_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('message', sa.TEXT(), autoincrement=False, nullable=False),
    sa.Column('timestamp', postgresql.TIMESTAMP(), server_default=sa.text('CURRENT_TIMESTAMP'), autoincrement=False, nullable=True),
    sa.Column('is_read', sa.BOOLEAN(), server_default=sa.text('false'), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['space_id'], ['spaces.id'], name=op.f('chat_messages_space_id_fkey')),
    sa.PrimaryKeyConstraint('id', name=op.f('chat_messages_pkey'))
    )
    # ### end Alembic commands ###
