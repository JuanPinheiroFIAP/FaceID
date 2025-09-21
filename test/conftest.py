import pytest 
from config.settings import * 
from db.connection import connection_db

@pytest.fixture(scope="function")
def db_conn():
    conn = connection_db()
    if conn is None:
        pytest.fail("Não foi possível conectar com o banco de dados.")
    yield conn 
    conn.close()

