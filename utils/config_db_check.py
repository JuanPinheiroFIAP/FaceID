import os
from config import settings

def check_db_config():
    """
    Verifica se os arquivos de chave e senha criptografada existem.
    Retorna True se ambos existirem, False caso contrário.
    """
    missing_files = []

    if not os.path.exists(settings.DB_KEY_FILE):
        missing_files.append(settings.DB_KEY_FILE)

    if not os.path.exists(settings.DB_PASSWORD_FILE):
        missing_files.append(settings.DB_PASSWORD_FILE)

    if missing_files:
        print("⚠️ Arquivos de configuração do banco ausentes!")
        print("Por favor, configure seu banco de dados antes de rodar o programa")
        print("Rode o arquivo 'config_db.py'")
        return False

    return True
