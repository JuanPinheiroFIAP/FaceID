# fluxo resumido (exemplo)
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from db.connection import connection_db
from db.setup import check_table_exists
from db.emedding_dao import insert_embedding, get_embeddings_by_user
from utils.cryptography_embendding import cryptography_embedding, decrypt_embedding
from utils.config_db_check import check_db_config
from utils.config_db import config_db
from vision.embedding import embedding  
from numpy.linalg import norm
import numpy as np
from numpy import dot
import importlib
import os
from config import settings_db
from config.settings import SETTINGS_DB

def reload_settings_db():
    importlib.reload(settings_db)
    print("✅ Configurações do banco recarregadas")

def configure_db_interactively():
    """
    Menu interativo para configurar DB_HOST, DB_PORT, DB_SID e DB_USER.
    Salva no arquivo settings_db.py.
    """
    print("\n--- Configuração do Banco de Dados ---")
    db_host = input("Digite o DB_HOST (ex: oracle.fiap.com.br): ").strip()
    db_port = input("Digite o DB_PORT (ex: 1521): ").strip()
    db_sid = input("Digite o DB_SID (ex: ORCL): ").strip()
    db_user = input("Digite o DB_USER (ex: rm552202): ").strip()

    # Validações básicas
    if not all([db_host, db_port, db_sid, db_user]):
        print("❌ Todos os campos são obrigatórios!")
        return False

    # Cria o conteúdo do arquivo settings_db.py
    content = f"""# Configurações do banco
DB_HOST = "{db_host}"
DB_PORT = {db_port}
DB_SID = "{db_sid}"
DB_USER = "{db_user}"
"""

    try:
        with open(SETTINGS_DB, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"✅ Configuração salva com sucesso em {SETTINGS_DB}")
        return True
    except Exception as e:
        print(f"❌ Erro ao salvar configuração: {e}")
        return False


def register_my_face(conn, username):
    # 1) captura e gera embedding (numpy array)
    arr = embedding()  # retorna np.ndarray (ex: dtype float32)
    if arr is None:
        print("Falha ao captar rosto")
        return False

    # 2) criptografa
    emb_crypt = cryptography_embedding(arr)  # deve retornar bytes
    if emb_crypt is None:
        print("Erro na criptografia")
        return False

    # 3) insere no banco
    insert_embedding(conn, username, emb_crypt, metadata="cadastro inicial")
    return True

def try_unlock(conn, username, similarity_threshold=0.90):
    """
    Tenta desbloquear o app para um usuário específico.
    A decisão é baseada na cosine similarity.
    """
    print(f"\n🔹 Tentativa de login para usuário: {username}")

    # 1) captura a embedding atual
    current = embedding()
    if current is None:
        print("❌ Nenhum rosto detectado")
        return False

    print("✅ Embedding atual gerada (vetor de tamanho):", current.shape)

    # 2) pega embeddings do usuário
    rows = get_embeddings_by_user(conn, username)
    if not rows:
        print("❌ Usuário não encontrado ou sem embeddings cadastradas")
        return False

    print(f"🔹 Encontradas {len(rows)} embeddings no banco para {username}")

    # 3) compara com cada embedding armazenada
    for i, (uname, emb_bytes, metadata) in enumerate(rows, 1):
        if emb_bytes is None:
            print(f"⚠️ Embedding {i} está vazia, pulando")
            continue

        try:
            stored = decrypt_embedding(emb_bytes, dtype=np.float32)
        except Exception as e:
            print(f"❌ Erro ao descriptografar embedding {i}: {e}")
            continue

        print(f"\n🔹 Comparando embedding {i} (metadata: {metadata})")
        print(f"Primeiros 5 valores embedding armazenada: {stored[:5]}")

        # Distância L2 (apenas para inspeção)
        l2_distance = np.linalg.norm(current.astype(np.float32) - stored.astype(np.float32))
        print(f"Distância L2: {l2_distance:.4f}")

        # Cosine similarity
        cosine_sim = np.dot(current, stored) / (np.linalg.norm(current) * np.linalg.norm(stored))
        print(f"Semelhança (cosine) entre embeddings: {cosine_sim*100:.2f}%")

        # Critério de desbloqueio
        if cosine_sim >= similarity_threshold:
            print("✅ Match encontrado! Desbloqueio autorizado.")
            return True
        else:
            print("❌ Não corresponde, continuando...")

    print("❌ Nenhuma embedding correspondeu. Acesso negado.")
    return False


def main():
    conn = None

    # --- MENU INICIAL DE CONFIGURAÇÃO ---
    while True:
        print("\n--- MENU INICIAL ---")
        print("1 - Verificar configuração do banco de dados")
        print("2 - Configurar banco de dados")
        print("3 - Sair")
        choice = input("Escolha uma opção: ").strip()

        if choice == "1":
            if check_db_config():
                print("✅ Arquivos de configuração encontrados. Tentando conectar...")
                try:
                    conn = connection_db()
                    if conn:
                        print("✅ Conexão com o banco realizada com sucesso!")
                        break  # segue para o menu FACEID
                    else:
                        print("❌ Falha ao conectar. Verifique DB_KEY/DB_PASSWORD ou credenciais.")
                except Exception as e:
                    print(f"❌ Erro ao conectar: {e}")
                    print("⚠️ Tente configurar o banco novamente (opção 2).")
            else:
                print("⚠️ Configuração ausente. Rode a opção 2 para configurar o banco.")
        
        elif choice == "2":
            if configure_db_interactively():
                config_db()
                reload_settings_db()
                print("✅ Banco configurado. Agora tente verificar a conexão (opção 1).")
            else:
                print("❌ Falha ao configurar o banco. Tente novamente.")
        
        elif choice == "3":
            print("Saindo...")
            return
        else:
            print("Opção inválida. Escolha 1, 2 ou 3.")

    # --- MENU FACEID ---
    try:
        check_table_exists(conn)

        while True:
            print("\n--- MENU FACEID ---")
            print("1 - Criar nova senha (cadastrar face)")
            print("2 - Login (desbloquear)")
            print("3 - Sair")
            opc = input("Escolha: ").strip()

            if opc == "1":
                username = input("Digite seu username: ").strip()
                if register_my_face(conn, username):
                    print("✅ Face cadastrada com sucesso!")
                else:
                    print("❌ Falha no cadastro.")

            elif opc == "2":
                username = input("Digite seu username: ").strip()
                if try_unlock(conn, username):
                    print("✅ Login bem-sucedido!")
                else:
                    print("❌ Login falhou.")

            elif opc == "3":
                print("Saindo...")
                break
            else:
                print("Opção inválida.")

    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    main()
    