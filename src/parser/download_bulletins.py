"""
baixar_boletins.py
Baixa automaticamente os boletins epidemiológicos da Prefeitura de Londrina
e salva em data/raw/ para o ia_scan.py processar.

Como funciona:
    URL previsível → tenta baixar → se existir, salva → se não, pula

Por que as URLs são previsíveis?
    O site da Prefeitura segue sempre o mesmo padrão:
    .../Informe_Epidemiol%C3%B3gico/{ANO}/Informe_epidemiologico_{NN}{ANO}.pdf
    Onde NN = número do boletim (01, 02, 03...) e ANO = ano (2025, 2026...)

Uso:
    python baixar_boletins.py          # baixa todos os boletins do ano atual
    python baixar_boletins.py 2025     # baixa todos os boletins de 2025
    python baixar_boletins.py 2025 3   # baixa só o boletim 03/2025
"""

import sys
import time
import datetime
from pathlib import Path

import requests  # biblioteca para fazer requisições HTTP (baixar arquivos da web)

# =============================================================================
# CAMINHOS DO PROJETO
# Mesma lógica do ia_scan.py — sobe 3 níveis para chegar na raiz
# =============================================================================

BASE_DIR = Path(__file__).resolve().parent.parent.parent
RAW_DIR  = BASE_DIR / "data" / "raw"

# =============================================================================
# URL BASE
# Padrão descoberto analisando os PDFs disponíveis no site:
#   2025: Informe_Epidemiol%C3%B3gico/2025/Informe_epidemiologico_032025.pdf
#   2024: Informe_Epidemiol%C3%B3gico/2024/Informe_epidemiologico_062024.pdf
#
# %C3%B3 é o ó (letra ó) codificado para URL — o Python faz isso automaticamente
# mas a URL base já vem assim do site, então mantemos como está.
# =============================================================================

URL_BASE = (
    "https://saude.londrina.pr.gov.br/images/Epidemiologia/DEPIS/"
    "Informe_Epidemiol%C3%B3gico/{ano}/Informe_epidemiologico_{nn}{ano}.pdf"
)

# Máximo de boletins por ano — a Prefeitura publica ~12 por ano (um por mês)
# Colocamos 13 como margem de segurança
MAX_BOLETINS = 13

# Pausa entre downloads para não sobrecarregar o servidor da Prefeitura
# Boa prática em web scraping — respeita o servidor público
PAUSA_SEGUNDOS = 1.5


# =============================================================================
# FUNÇÃO: construir URL de um boletim específico
#
# Exemplo:
#   construir_url(2025, 3) → URL do boletim 03/2025
#   construir_url(2026, 12) → URL do boletim 12/2026
# =============================================================================

def construir_url(ano: int, numero: int) -> str:
    """
    Constrói a URL de um boletim a partir do ano e número.
    O número é formatado com dois dígitos: 3 → '03', 12 → '12'
    """
    nn = str(numero).zfill(2)  # zfill(2) preenche com zero à esquerda: 3 → '03'
    return URL_BASE.format(ano=ano, nn=nn)


# =============================================================================
# FUNÇÃO: construir nome do arquivo local
#
# Exemplo:
#   nome_arquivo(2025, 3) → 'boletim_03_2025.pdf'
#   nome_arquivo(2026, 12) → 'boletim_12_2026.pdf'
#
# Usamos um nome padronizado nosso — mais legível que o nome original do site
# =============================================================================

def nome_arquivo(ano: int, numero: int) -> str:
    """Gera o nome do arquivo local para um boletim."""
    nn = str(numero).zfill(2)
    return f"{ano}-{nn}.pdf"


# =============================================================================
# FUNÇÃO: baixar um boletim específico
#
# Retorna True se baixou com sucesso, False se não encontrou ou já existia
#
# O que é um status code HTTP?
#   200 = OK (arquivo existe e foi baixado)
#   404 = Not Found (boletim ainda não foi publicado)
#   Outros = erro inesperado
# =============================================================================

def baixar_boletim(ano: int, numero: int, forcar: bool = False) -> bool:
    """
    Tenta baixar o boletim de número {numero} do ano {ano}.

    forcar=True → baixa mesmo se o arquivo já existir (para atualizar)
    forcar=False → pula se o arquivo já existir (padrão)

    Retorna True se baixou, False se não encontrou ou pulou.
    """
    url       = construir_url(ano, numero)
    nome      = nome_arquivo(ano, numero)
    destino   = RAW_DIR / nome

    # Se já existe e não estamos forçando, pula
    if destino.exists() and not forcar:
        print(f"  ⏭ {nome} já existe — pulando")
        return False

    print(f"  ↓ Tentando: boletim {numero:02d}/{ano}...")

    try:
        # stream=True baixa em partes — importante para arquivos grandes como PDFs
        # timeout=30 evita que o script fique travado esperando para sempre
        response = requests.get(url, stream=True, timeout=30)

        if response.status_code == 200:
            # Cria a pasta se não existir
            RAW_DIR.mkdir(parents=True, exist_ok=True)

            # Salva o arquivo em partes (chunks) de 8KB
            # Isso evita carregar o PDF inteiro na memória de uma vez
            with open(destino, "wb") as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)

            tamanho_kb = destino.stat().st_size // 1024
            print(f"  ✔ {nome} baixado ({tamanho_kb} KB)")
            return True

        elif response.status_code == 404:
            # Boletim não publicado ainda — normal para meses futuros
            print(f"  · {nome} não encontrado (404) — boletim não publicado")
            return False

        else:
            # Erro inesperado — avisa mas não trava o script
            print(f"  ✘ {nome} — erro HTTP {response.status_code}")
            return False

    except requests.exceptions.Timeout:
        print(f"  ✘ {nome} — timeout (servidor demorou demais)")
        return False

    except requests.exceptions.ConnectionError:
        print(f"  ✘ {nome} — sem conexão com a internet")
        return False


# =============================================================================
# FUNÇÃO PRINCIPAL: baixar todos os boletins de um ano
# =============================================================================

def baixar_ano(ano: int, forcar: bool = False) -> None:
    """
    Tenta baixar todos os boletins de um ano (01 a 13).
    Para quando encontra 3 boletins seguidos não publicados —
    isso indica que chegamos no limite do que foi publicado.
    """
    print(f"\nBaixando boletins de {ano}...")
    print(f"Destino: {RAW_DIR}\n")

    baixados   = 0
    nao_encontrados_seguidos = 0

    for numero in range(1, MAX_BOLETINS + 1):
        resultado = baixar_boletim(ano, numero, forcar)

        if resultado:
            baixados += 1
            nao_encontrados_seguidos = 0
        else:
            # Se o arquivo já existe localmente, não conta como "não encontrado"
            destino = RAW_DIR / nome_arquivo(ano, numero)
            if not destino.exists():
                nao_encontrados_seguidos += 1

        # Se 3 boletins seguidos não existem no servidor,
        # provavelmente chegamos no limite do que foi publicado
        if nao_encontrados_seguidos >= 3:
            print(f"\n  → 3 boletins seguidos não encontrados — parando busca")
            break

        # Pausa entre requisições para não sobrecarregar o servidor
        if numero < MAX_BOLETINS:
            time.sleep(PAUSA_SEGUNDOS)

    print(f"\nResumo: {baixados} boletim(ns) novo(s) baixado(s) de {ano}")


# =============================================================================
# ENTRADA DO SCRIPT
# =============================================================================

def main() -> None:
    ano_atual = datetime.datetime.now().year

    if len(sys.argv) == 1:
        # Sem argumentos → baixa ano atual
        baixar_ano(ano_atual)

    elif len(sys.argv) == 2:
        # Um argumento → baixa o ano informado
        try:
            ano = int(sys.argv[1])
            baixar_ano(ano)
        except ValueError:
            print(f"ERRO: '{sys.argv[1]}' não é um ano válido")
            sys.exit(1)

    elif len(sys.argv) == 3:
        # Dois argumentos → baixa um boletim específico
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