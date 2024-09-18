from sqlalchemy import create_engine
from src.common.constants import DATABASE_URL


engine = create_engine(DATABASE_URL)
