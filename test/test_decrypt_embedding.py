import numpy as np
import pytest
from cryptography.fernet import Fernet
from utils.cryptography_embendding import cryptography_embedding, decrypt_embedding, DB_KEY_FILE

def test_decrypt_embedding_blob(tmp_path):
    # Cria uma chave temporária
    key_path = tmp_path / "test_key.key"
    key = Fernet.generate_key()
    key_path.write_bytes(key)

    # Substitui temporariamente a variável DB_KEY_FILE
    import utils.cryptography_embendding as crypto_mod
    original_key_file = crypto_mod.DB_KEY_FILE
    crypto_mod.DB_KEY_FILE = str(key_path)

    try:
        # Gera uma embedding aleatória (np.float32)
        original_embedding = np.random.rand(128).astype(np.float32)

        # Criptografa
        encrypted_bytes = cryptography_embedding(original_embedding)

        # Simula que o banco retornou um BLOB (em bytes)
        blob_from_db = bytes(encrypted_bytes)

        # Descriptografa
        decrypted = decrypt_embedding(blob_from_db, dtype=np.float32)

        # Verificações
        assert isinstance(decrypted, np.ndarray)
        assert decrypted.dtype == np.float32
        assert np.allclose(decrypted, original_embedding)

    finally:
        # Restaura variável original
        crypto_mod.DB_KEY_FILE = original_key_file
