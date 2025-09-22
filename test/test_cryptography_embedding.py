import numpy as np
from utils.cryptography_embendding import cryptography_embedding

def test_cryptography_embedding():
    embedding = np.random.rand(128).astype(np.float32)

    # Teste para ver se o que volta da função é um byte
    result = cryptography_embedding(embedding)
    assert isinstance(result, bytes)


    # Teste se o resultado não é igual ao array original (ou seja, realmente criptografou)
    assert not np.array_equal(result, embedding)