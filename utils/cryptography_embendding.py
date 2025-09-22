import numpy as np
import logging
from cryptography.fernet import Fernet
from config.settings import DB_KEY_FILE, CRYPTO_LOG_FILE

logging.basicConfig(
    filename=CRYPTO_LOG_FILE,
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)


def cryptography_embedding(embedding: np.ndarray) -> bytes:
    """
    Criptografa a embedding (NumPy array) e retorna bytes criptografados.
    """
    try:
        # Carrega a chave
        with open(DB_KEY_FILE, 'rb') as key_file:
            key = key_file.read()

        fernet = Fernet(key)

        # Converte array para bytes
        embedding_bytes = embedding.astype(np.float32).tobytes()

        # Criptografa
        embedding_cryp = fernet.encrypt(embedding_bytes)
        logging.info("✅ Embedding criptografada com sucesso!")
        return embedding_cryp

    except Exception as e:
        logging.error(f"❌ Erro ao criptografar embedding: {e}")
        return None


def decrypt_embedding(embedding_cryp: bytes, dtype=np.float32) -> np.ndarray:
    """
    Descriptografa a embedding vinda do banco e reconstrói o NumPy array.
    """
    try:
        # Carrega a chave
        with open(DB_KEY_FILE, 'rb') as key_file:
            key = key_file.read()

        fernet = Fernet(key)

        # Descriptografa
        decrypted_bytes = fernet.decrypt(embedding_cryp)

        # Reconstrói o array
        embedding = np.frombuffer(decrypted_bytes, dtype=dtype)
        logging.info("✅ Embedding descriptografada com sucesso!")
        return embedding

    except Exception as e:
        logging.error(f"❌ Erro ao descriptografar embedding: {e}")
        return None
