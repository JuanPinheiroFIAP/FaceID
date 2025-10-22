
---

# 🧠 SPRINT3-IoT — Reconhecimento Facial com Oracle DB

Aplicativo de **reconhecimento facial** utilizando **DeepFace**, **OpenCV** e **Oracle Database**, com suporte a **API para aplicativo mobile** desenvolvido em **React Native (Expo)**.

---

## 👥 Integrantes do Projeto

| Aluno                          | RM     |
| ------------------------------ | ------ |
| Juan Pinheiro de França        | 552202 |
| Kaiky Alvaro de Miranda        | 98118  |
| Lucas Rodrigues da Silva       | 98344  |
| Matheus Gusmão Aragão          | 550826 |
| Júlia Marques Mendes das Neves | 98680  |

---

## 🧩 Estrutura do Projeto

```
SPRINT3-IoT/
├─ config/
│  ├─ settings.py
│  ├─ settings_db.py
│  └─ __init__.py
├─ db/
│  ├─ connection.py
│  ├─ emedding_dao.py
│  ├─ setup.py
│  ├─ log/
│  │  └─ app.log
│  └─ __init__.py
├─ security/
│  ├─ secret.key
│  └─ senha.enc
├─ src/
│  ├─ app.py               # fluxo principal da aplicação
│  └─ log/
│     └─ main.log
├─ utils/
│  ├─ config_db.py
│  ├─ config_db_check.py
│  ├─ cryptography_embendding.py
│  ├─ listar_diretorios.py
│  └─ log/
│     └─ crypto.log
├─ vision/
│  ├─ embedding.py
│  └─ log/
│     └─ embedding.log
├─ test/
│  ├─ test_connection.py
│  ├─ test_config_check.py
│  ├─ test_cryptography_embedding.py
│  ├─ test_decrypt_embedding.py
│  ├─ conftest.py
│  └─ __init__.py
├─ FaceAuthApp/              # Aplicativo mobile (Expo)
├─ api.py                    # API Flask para integração com o app mobile
├─ setup.bat                 # Setup automatizado
├─ requirements.txt
├─ LICENSE
├─ .gitignore
└─ README.md
```

---

## ⚙️ Pré-requisitos

* **Python 3.10+**
* **Oracle Database** acessível
* **Webcam** funcional (para captura facial)
* **Node.js + Expo CLI** (para o app mobile)
* **Sistema Windows** (para o `setup.bat`)

---

## 🚀 Instalação e Setup

### 1️⃣ Clonar o Repositório

```bash
git clone https://github.com/seuusuario/SPRINT3-IoT.git
cd SPRINT3-IoT
```

### 2️⃣ Executar o Setup Automático

O `setup.bat` cria o ambiente virtual e instala todas as dependências automaticamente:

```bat
setup.bat
```

---

## 🗄️ Configuração do Banco de Dados

Antes de rodar qualquer módulo, é **obrigatório configurar o banco de dados Oracle**.

Você pode fazer isso de **duas formas**:

### 🔹 **1. Configuração Automática (via fluxo principal)**

Rode o aplicativo principal para seguir o fluxo guiado:

```bash
python src/app.py
```

O sistema verificará a configuração e permitirá gerar a **chave e senha criptografadas** automaticamente.

### 🔹 **2. Configuração Manual**

Edite o arquivo `config/settings_db.py`:

```python
DB_HOST = "oracle.fiap.com.br"
DB_PORT = 1521
DB_SID  = "ORCL"
DB_USER = "SEU_USUARIO"
```

Após configurar, garanta que os arquivos de segurança (`security/secret.key` e `security/senha.enc`) estejam presentes e válidos.

Para verificar se esta tudo certo rode o: `python src/app.py` ele vai garantir que tudo vai estar configurado.

---

## 🧠 Execução do Sistema de Reconhecimento Facial

Para iniciar o sistema principal de reconhecimento facial:

```bash
python src/app.py
```

O aplicativo irá:

* Verificar a configuração do banco
* Inicializar a webcam
* Capturar o rosto
* Gerar e armazenar o **embedding facial** no Oracle DB

---

## 📱 Execução da API e Aplicativo Mobile

O sistema conta com uma **API Flask** e um **aplicativo mobile Expo** para autenticação facial.

### 🔹 Passo 1 — Iniciar a API

Entre na pasta raiz do projeto e execute:

```bash
python api.py
```

Isso iniciará o servidor Flask responsável por processar as requisições do aplicativo mobile.

### 🔹 Passo 2 — Rodar o Aplicativo Mobile

Entre na pasta `FaceAuthApp`:

```bash
cd FaceAuthApp
```

Em seguida, altere a linha 18 do `FaceAuthApp\App.js` e coloque seu ip de rede:
```Javascript
const API_URL = 'http://SEU_IP_AQUI/api';
```

Você pode achar ele indo no `CMD` do seu computador e digitando:
```cmd
ipconfig
```
basta compiar o que vim depois do `IPv4`


Em seguida, inicie o app no Expo:

```bash
npx expo start
```

Aponte a câmera do celular para o QR Code exibido no terminal para abrir o app no Expo Go.

⚠️ **Importante:**
Antes de rodar a API ou o app, **confira se o banco de dados Oracle está corretamente configurado** e se o servidor Flask está em execução.

---

## 🧪 Testes

O diretório `test/` contém scripts de verificação das funções principais, como:

* Conexão com o banco (`test_connection.py`)
* Criptografia de embeddings (`test_cryptography_embedding.py`)
* Validação da configuração (`test_config_check.py`)

Execute todos os testes com:

```bash
pytest
```

---

## 🧰 Dependências Principais

As principais bibliotecas utilizadas estão listadas em `requirements.txt`:

* `deepface`
* `opencv-python`
* `cx_Oracle`
* `cryptography`
* `flask`
* `pytest`

Instale manualmente (se necessário):

```bash
pip install -r requirements.txt
```

---

## 📄 Licença

Este projeto está licenciado sob os termos da **MIT License**.
Consulte o arquivo [`LICENSE`](LICENSE) para mais detalhes.

---
