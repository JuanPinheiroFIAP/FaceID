import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'  # 0 = tudo, 1 = info, 2 = warning, 3 = erro

import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from vision.embedding import embedding
from config.settings import DB_KEY_FILE, DB_PASSWORD_FILE
from utils.config_db_check import check_db_config

def main():
    print("Bem-vindo ao nosso app de FaceID!\n")

    if not check_db_config():
        sys.exit()  # Sai do programa se faltar configuração

    print("✅ Configuração encontrada! Iniciando captura de face...\n")

    try:
        emb = embedding()  # Chama a função que gera o embedding
        print(f"Embedding gerado com sucesso! Dimensão: {emb.shape}")
    except Exception as e:
        print(f"❌ Ocorreu um erro ao gerar o embedding: {e}")

if __name__ == "__main__":
    main()
