# SPRINT3-IoT

Aplicativo desenvolvido para trabalhar com **Oracle Database** e reconhecimento facial utilizando **DeepFace e OpenCV**.

---

## Pré-requisitos

- Python 3.10+
- Oracle Database acessível
- Webcam para captura de rosto
- Sistema operacional Windows (para uso do `.bat`)

---

## Instalação e Setup

1. Clone este repositório ou baixe os arquivos.  
2. Abra o terminal na raiz do projeto e execute o arquivo `setup.bat` para criar a virtual environment e instalar todas as dependências:  

```bat
setup.bat
````

3. Configure o arquivo `config/settings_db.py` com os dados do seu banco Oracle:

```python
# Configurações do banco
DB_HOST = "oracle.fiap.com.br"
DB_PORT = 1521
DB_SID = "ORCL"
DB_USER = "SEU_USUARIO"
```

4. Execute o script `config_db.py` para gerar a chave e a senha criptografada:

```bat
python src/config_db.py
```

---

## Como usar

1. Execute o arquivo principal `src/main.py`:

```bat
python src/main.py
```

2. O aplicativo verificará se a configuração do banco está pronta, iniciará a captura de rosto e gerará o embedding facial.

---

## Estrutura do Projeto

```
SPRINT3-IoT/
├─ config/
│  ├─ settings.py
│  └─ settings_db.py
├─ db/
│  ├─ connection.py
│  └─ log/
├─ security/
│  └─ db/
├─ src/
│  └─ main.py
├─ test/
├─ utils/
├─ vision/
└─ setup.bat
```

---

## Observações

* Este é apenas um README inicial, será atualizado com mais instruções e exemplos de uso.
* Para problemas de dependências ou erros de caminho, certifique-se de estar usando a **virtual environment criada pelo setup.bat**.

---
