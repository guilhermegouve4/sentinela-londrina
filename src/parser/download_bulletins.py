import sys
import time
import datetime
from pathlib import Path

import requests

BASE_DIR = Path(__file__).resolve().parent.parent.parent
RAW_DIR  = BASE_DIR / "data" / "raw"

URL_BASE = (
    "https://saude.londrina.pr.gov.br/images/Epidemiologia/DEPIS/"
    "Informe_Epidemiol%C3%B3gico/{ano}/Informe_epidemiologico_{nn}{ano}.pdf"
)

MAX_BOLETINS   = 13
PAUSA_SEGUNDOS = 1.5


def construir_url(ano: int, numero: int) -> str:
    nn = str(numero).zfill(2)
    return URL_BASE.format(ano=ano, nn=nn)


def nome_arquivo(ano: int, numero: int) -> str:
    nn = str(numero).zfill(2)
    return f"{ano}-{nn}.pdf"


def baixar_boletim(ano: int, numero: int, forcar: bool = False) -> bool:
    url     = construir_url(ano, numero)
    nome    = nome_arquivo(ano, numero)
    destino = RAW_DIR / nome

    if destino.exists() and not forcar:
        print(f"  ⏭ {nome} já existe — pulando")
        return False

    print(f"  ↓ Tentando: boletim {numero:02d}/{ano}...")

    try:
        response = requests.get(url, stream=True, timeout=30)

        if response.status_code == 200:
            RAW_DIR.mkdir(parents=True, exist_ok=True)
            with open(destino, "wb") as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            tamanho_kb = destino.stat().st_size // 1024
            print(f"  ✔ {nome} baixado ({tamanho_kb} KB)")
            return True

        elif response.status_code == 404:
            print(f"  · {nome} não encontrado (404) — boletim não publicado")
            return False

        else:
            print(f"  ✘ {nome} — erro HTTP {response.status_code}")
            return False

    except requests.exceptions.Timeout:
        print(f"  ✘ {nome} — timeout (servidor demorou demais)")
        return False

    except requests.exceptions.ConnectionError:
        print(f"  ✘ {nome} — sem conexão com a internet")
        return False


def baixar_ano(ano: int, forcar: bool = False) -> None:
    print(f"\nBaixando boletins de {ano}...")
    print(f"Destino: {RAW_DIR}\n")

    baixados                 = 0
    nao_encontrados_seguidos = 0

    for numero in range(1, MAX_BOLETINS + 1):
        resultado = baixar_boletim(ano, numero, forcar)

        if resultado:
            baixados += 1
            nao_encontrados_seguidos = 0
        else:
            destino = RAW_DIR / nome_arquivo(ano, numero)
            if not destino.exists():
                nao_encontrados_seguidos += 1

        if nao_encontrados_seguidos >= 3:
            print(f"\n  → 3 boletins seguidos não encontrados — parando busca")
            break

        if numero < MAX_BOLETINS:
            time.sleep(PAUSA_SEGUNDOS)

    print(f"\nResumo: {baixados} boletim(ns) novo(s) baixado(s) de {ano}")


def main() -> None:
    ano_atual = datetime.datetime.now().year

    if len(sys.argv) == 1:
        baixar_ano(ano_atual)

    elif len(sys.argv) == 2:
        try:
            ano = int(sys.argv[1])
            baixar_ano(ano)
        except ValueError:
            print(f"ERRO: '{sys.argv[1]}' não é um ano válido")
            sys.exit(1)

    elif len(sys.argv) == 3:
        try:
            ano    = int(sys.argv[1])
            numero = int(sys.argv[2])
            RAW_DIR.mkdir(parents=True, exist_ok=True)
            baixar_boletim(ano, numero, forcar=True)
        except ValueError:
            print("ERRO: use 'python baixar_boletins.py ANO NUMERO'")
            print("Exemplo: python baixar_boletins.py 2025 3")
            sys.exit(1)

    else:
        print("Uso:")
        print("  python baixar_boletins.py           # ano atual")
        print("  python baixar_boletins.py 2025      # ano específico")
        print("  python baixar_boletins.py 2025 3    # boletim específico")
        sys.exit(1)


if __name__ == "__main__":
    main()
