import os 
import sys
import getpass
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from cryptography.fernet import Fernet
from config.settings import DB_KEY_FILE, DB_PASSWORD_FILE

def key():
    """Gera chave secreta e salva no arquivo"""
    print("🔑 Gerando chave secreta...")
    key = Fernet.generate_key()
    with open(DB_KEY_FILE, "wb") as key_file:
        key_file.write(key)
    print(f"✅ Chave gerada e salva em: {DB_KEY_FILE}")
    return key

def password():
    """Criptografa a senha do Oracle usando a chave"""
    print("🔐 Lendo chave secreta...")
    with open(DB_KEY_FILE, "rb") as key_file:
        key = key_file.read()
    
    fernet = Fernet(key)
    
    senha = getpass.getpass("Digite a senha do Oracle: ")
    
    print("🔒 Criptografando senha...")
    senha_cripto = fernet.encrypt(senha.encode())
    
    with open(DB_PASSWORD_FILE, "wb") as f:
        f.write(senha_cripto)
    
    print(f"✅ Senha criptografada salva em: {DB_PASSWORD_FILE}")

# Permite rodar diretamente o arquivo
if __name__ == "__main__":
    print("=== Configuração do Banco de Dados ===")
    gerar_chave = input("Deseja gerar uma nova chave secreta? (s/n): ").lower()
    if gerar_chave == "s":
        key()
    
    gerar_senha = input("Deseja criptografar a senha do Oracle? (s/n): ").lower()
    if gerar_senha == "s":
        password()
    
    print("🎉 Etapa de configuração concluída!")
