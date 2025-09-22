import os

#Diretório base do projeto (Raiz)
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

# Caminhos importantes
DB_KEY_FILE = os.path.join(BASE_DIR, "security", "secret.key")
DB_PASSWORD_FILE = os.path.join(BASE_DIR, "security","senha.enc")

# Caminho de logs 
EMBADDING_LOG_FILE = os.path.join(BASE_DIR, "vision", "log","embedding.log")
DB_LOG_FILE = os.path.join(BASE_DIR, "db", "log", "app.log")
CRYPTO_LOG_FILE = os.path.join(BASE_DIR, "utils", "log", "crypto.log")
MAIN_LOG = os.path.join(BASE_DIR,"src", "log", "main.log")

# Caminho de arquivos
SETTINGS_DB = os.path.join(BASE_DIR, "config", "settings_db.py")