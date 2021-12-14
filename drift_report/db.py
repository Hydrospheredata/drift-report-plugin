from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from .config import CONFIG

engine = create_engine(CONFIG.db_connection_string)
Session = sessionmaker(bind=engine)
Base = declarative_base()
