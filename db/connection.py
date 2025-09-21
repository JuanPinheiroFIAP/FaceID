import oracledb
from cryptography.fernet import Fernet
import logging
from config.settings import DB_KEY_FILE, DB_LOG_FILE, DB_PASSWORD_FILE
from config.settings_db import DB_HOST, DB_PORT, DB_SID, DB_USER



logging.basicConfig(
    filename=DB_LOG_FILE,
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)

def connection_db():
    """
    Essa função tem como objetivo realizar a conexão como bando de dados oracle
    """
    try:
        # lê a chave
        with open(DB_KEY_FILE) as key_file:
            key = key_file.read()
        fernet = Fernet(key)

        # lê e descriptografa a senha
        with open(DB_PASSWORD_FILE) as f:
            senha_cripto = f.read()
        senha = fernet.decrypt(senha_cripto).decode()

        # monta DSN do Oracle
        dsn = oracledb.makedsn(
            host=DB_HOST,
            port=DB_PORT,
            sid=DB_SID
        )

        # conecta no banco (Configure aqui suas iformações do banco oracle)
        conn = oracledb.connect(
            user=DB_USER,
            password=senha,
            dsn=dsn
        )
        logging.info("Conectado ao Oracle com sucesso!")
        return conn

    except Exception as e:
        logging.error(f"Erro ao conectar ao Oracle: {e}")
        return None
