## Integrantes do Projeto

| Aluno                     | RM    |
|----------------------------|------------|
| Juan Pinheiro de França    | 552202   |
| Kaiky Alvaro de Miranda               | 98118   |
| Lucas Rodrigues da Silva               | 98344   |
| Matheus Gusmão Aragão               | 550826   |
| Júlia Marques Mendes das Neves              | 98680   |



### Estrutura sugerida

```
SPRINT3-IoT/
├─ config/
│  ├─ settings.py
│  └─ settings_db.py
├─ db/
│  ├─ connection.py
│  ├─ emedding_dao.py
│  └─ setup.py
├─ security/
│  ├─ secret.key
│  └─ senha.enc
├─ src/
│  └─ app.py          # arquivo principal (main)
├─ utils/
│  ├─ config_db.py
│  ├─ config_db_check.py
│  └─ cryptography_embendding.py
├─ vision/
│  └─ embedding.py
├─ README.md
├─ requirements.txt
└─ setup.bat
```

# SPRINT3-IoT

Aplicativo de reconhecimento facial com **DeepFace e OpenCV** integrado a **Oracle Database**.

---

## Pré-requisitos

- Python 3.10+
- Oracle Database acessível
- Webcam para captura de rosto
- Sistema operacional Windows (para uso do `.bat`)

---

## Instalação e Setup

1. Clone o repositório ou baixe os arquivos.
2. Abra o terminal na raiz do projeto e execute o arquivo `setup.bat` para criar a virtual environment e instalar todas as dependências:  

```bat
setup.bat
````

3. Configure o arquivo `config/settings_db.py` com os dados do seu banco Oracle:

```python
DB_HOST = "oracle.fiap.com.br"
DB_PORT = 1521
DB_SID = "ORCL"
DB_USER = "SEU_USUARIO"
```

4. Execute o script `config_db.py` para gerar a chave e a senha criptografada:

```bat
python src/app.py
```

---

## Como usar

1. Execute o arquivo principal `src/app.py`:

```bat
python src/app.py
```

2. O aplicativo verificará se a configuração do banco está pronta, iniciará a captura de rosto e gerará o embedding facial.

---

## Estrutura do Projeto

```
SPRINT3-IoT/
├─ config/
├─ db/
├─ security/
├─ src/
├─ utils/
├─ vision/
├─ README.md
├─ requirements.txt
└─ setup.bat
```