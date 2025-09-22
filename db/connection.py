import oracledb
from cryptography.fernet import Fernet
import logging
from config import settings_db
from config.settings import DB_KEY_FILE, DB_LOG_FILE, DB_PASSWORD_FILE

logging.basicConfig(
    filename=DB_LOG_FILE,
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)

def connection_db():
    """
    Conecta ao banco de dados Oracle usando as configurações atuais de settings_db.
    """
    try:
        # lê a chave
        with open(DB_KEY_FILE, "rb") as key_file:
            key = key_file.read()
        fernet = Fernet(key)

        # lê e descriptografa a senha
        with open(DB_PASSWORD_FILE, "rb") as f:
            senha_cripto = f.read()
        senha = fernet.decrypt(senha_cripto).decode()

        # monta DSN usando settings_db
        dsn = oracledb.makedsn(
            host=settings_db.DB_HOST,
            port=settings_db.DB_PORT,
            sid=settings_db.DB_SID
        )

        conn = oracledb.connect(
            user=settings_db.DB_USER,
            password=senha,
            dsn=dsn
        )
        logging.info("Conectado ao Oracle com sucesso!")
        return conn

    except oracledb.DatabaseError as e:
        logging.error(f"❌ Não foi possível conectar ao banco de dados: {e}")
        return None
