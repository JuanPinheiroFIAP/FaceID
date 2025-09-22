import logging

def insert_embedding(conn, username, embedding_bytes, metadata=None):
    """
    Insere uma nova embedding criptografada no banco.
    """
    cur = conn.cursor()
    try:
        cur.execute("""
            INSERT INTO users (username, embedding, metadata)
            VALUES (:1, :2, :3)
        """, (username, embedding_bytes, metadata))
        conn.commit()
        logging.info(f"✅ Embedding inserida com sucesso para usuário: {username}")
    except Exception as e:
        logging.error(f"❌ Erro ao inserir embedding: {e}")
    finally:
        cur.close()


def get_embeddings_by_user(conn, username):
    """
    Retorna todas as embeddings salvas no banco para um usuário específico.
    Cada item: (username, embedding_bytes, metadata)
    """
    cur = conn.cursor()
    try:
        cur.execute("""
            SELECT username, embedding, metadata 
            FROM users 
            WHERE username = :1
        """, (username,))
        rows = cur.fetchall()

        results = []
        for row in rows:
            uname = row[0]
            embedding_bytes = row[1].read() if row[1] else None
            metadata = row[2]
            results.append((uname, embedding_bytes, metadata))

        return results
    except Exception as e:
        logging.error(f"❌ Erro ao buscar embeddings do usuário {username}: {e}")
        return []
    finally:
        cur.close()

