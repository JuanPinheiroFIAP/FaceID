@echo off
REM ===================================================================
REM Script de setup do projeto Python
REM ===================================================================

REM Verifica se o Python está instalado
python --version >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo ❌ Python nao encontrado. Por favor, instale o Python 3.10+ antes de continuar.
    pause
    exit /b 1
)

echo ✅ Python encontrado!

REM Define nome da virtual environment
SET VENV_DIR=venv

REM Cria virtual environment se não existir
IF NOT EXIST "%VENV_DIR%" (
    echo Criando virtual environment...
    python -m venv %VENV_DIR%
    IF %ERRORLEVEL% NEQ 0 (
        echo ❌ Falha ao criar virtual environment.
        pause
        exit /b 1
    )
) ELSE (
    echo Virtual environment ja existe.
)

REM Ativa o virtual environment
echo Ativando virtual environment...
call %VENV_DIR%\Scripts\activate.bat

REM Atualiza pip
echo Atualizando pip...
python -m pip install --upgrade pip

REM Instala dependencias
echo Instalando dependencias do projeto...
pip install opencv-python numpy deepface cryptography pytest

echo ✅ Setup concluido com sucesso!
pause
