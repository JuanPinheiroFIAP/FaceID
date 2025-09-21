import os
import pytest
from utils.config_db_check import check_db_config

def test_check_db_config(monkeypatch, tmp_path):
    # cria arquivos temporários simulando a chave e senha
    key_file = tmp_path / "secret.key"
    password_file = tmp_path / "senha.enc"

    # Teste quando arquivos existem
    key_file.write_text("fake-key")
    password_file.write_text("fake-password")

    monkeypatch.setattr("config.settings.DB_KEY_FILE", str(key_file))
    monkeypatch.setattr("config.settings.DB_PASSWORD_FILE", str(password_file))
    assert check_db_config() is True

    # Teste quando arquivos ausentes
    key_file.unlink()
    password_file.unlink()
    assert check_db_config() is False
