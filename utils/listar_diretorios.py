from pathlib import Path

# Diretório atual é a raiz do projeto
project_root = Path(".")

# Pastas que queremos ignorar
ignore_dirs = {"venv", "__pycache__",".git"}

def list_project_files(root: Path):
    print(f"Listando arquivos e pastas de: {root.resolve()}\n")

    for path in root.rglob("*"):
        # Ignora pastas dentro do ignore_dirs
        if any(ignored in path.parts for ignored in ignore_dirs):
            continue

        if path.is_dir():
            print(f"[DIR]  {path}")
        else:
            # destaque arquivos importantes
            if path.suffix in [".py", ".enc", ".key"]:
                print(f"[FILE IMPORTANT] {path}")
            else:
                print(f"[FILE] {path}")

if __name__ == "__main__":
    list_project_files(project_root)
