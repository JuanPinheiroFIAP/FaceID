import os

#Diretório base do projeto (Raiz)
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

# Caminhos importantes
DB_KEY_FILE = os.path.join(BASE_DIR, "security", "secret.key")
DB_PASSWORD_FILE = os.path.join(BASE_DIR, "security","senha.enc")
DB_LOG_FILE = os.path.join(BASE_DIR, "db", "log", "app.log")

# Caminho do log Embadding 
EMBADDING_LOG_FILE = os.path.join(BASE_DIR, "vision", "log","embedding.log")