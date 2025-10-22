import os
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import getpass
from cryptography.fernet import Fernet
from config.settings import DB_KEY_FILE, DB_PASSWORD_FILE, DB_KEY_PASTA

def key():
    # Garante que a pasta do arquivo de chave existe
    os.makedirs(DB_KEY_PASTA, exist_ok=True)
    
    key = Fernet.generate_key()
    with open(DB_KEY_FILE, "wb") as key_file:
        key_file.write(key)
    return key

def password():
    """Criptografa a senha do Oracle usando a chave"""
    with open(DB_KEY_FILE, "rb") as key_file:
        key = key_file.read()
    
    fernet = Fernet(key)
    
    # Solicita a senha do Oracle apenas uma vez
    senha = getpass.getpass("Digite a senha do Oracle: ")
    senha_cripto = fernet.encrypt(senha.encode())
    
    with open(DB_PASSWORD_FILE, "wb") as f:
        f.write(senha_cripto)

def config_db():
    key()
    password()

if __name__ == "__main__":
    config_db()
