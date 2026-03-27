"""
ia_scan.py
Parser inteligente: usa o Gemini para ler PDFs epidemiológicos
e gerar CSVs no formato do contrato (docs/contrato-csv.md).

Como funciona:
    PDF → Gemini lê e entende → devolve JSON → script valida → salva CSV

Uso:
    python ia_scan.py                  # processa todos os PDFs em data/raw/
    python ia_scan.py boletim_x.pdf    # processa um PDF específico

Configuração necessária:
    Criar arquivo .env na raiz do projeto com:
    GEMINI_API_KEY=sua_chave_aqui
"""

import os
import json
import csv
import sys
from pathlib import Path

from dotenv import load_dotenv
from google import genai
from google.genai import types

# =============================================================================
# CAMINHOS DO PROJETO
# __file__ é o caminho desse script.
# Subimos 3 níveis (.parent x3) para chegar na raiz do projeto.
# Assim funciona em qualquer máquina, sem hardcodar caminho.
# =============================================================================

BASE_DIR      = Path(__file__).resolve().parent.parent.parent
RAW_DIR       = BASE_DIR / "data" / "raw"
PROCESSED_DIR = BASE_DIR / "data" / "processed"

# =============================================================================
# CONFIGURAÇÃO DA API
# load_dotenv() lê o .env. os.getenv() busca a chave.
# A chave nunca aparece no código — fica só no .env (que está no .gitignore).
# =============================================================================

load_dotenv()
CHAVE_API = os.getenv("GEMINI_API_KEY")

if not CHAVE_API:
    print("ERRO: GEMINI_API_KEY não encontrada.")
    print("Crie o arquivo .env na raiz do projeto com:")
    print("  GEMINI_API_KEY=sua_chave_aqui")
    sys.exit(1)

client = genai.Client(api_key=CHAVE_API)

# =============================================================================
# CAMPOS DO CONTRATO CSV
# Ordem exata das colunas definida em docs/contrato-csv.md
# =============================================================================

CAMPOS_CONTRATO = [
    "region", "type", "week",
    "notified", "confirmed", "discarded", "under_analysis",
    "dengue_cases", "dengue_alarm_cases", "dengue_severe_cases",
    "zika_cases", "chikungunya_cases", "deaths",
]

# =============================================================================
# O PROMPT
# A diferença principal em relação ao código do Pedro:
# pedimos JSON puro, não texto. Sem isso o json.loads() quebra.
# =============================================================================

PROMPT = """
Você é um extrator de dados epidemiológicos especializado em boletins da Prefeitura de Londrina.

Analise o PDF anexo e extraia os dados de arboviroses (Dengue, Zika e Chikungunya).

Retorne SOMENTE um objeto JSON válido, sem nenhum texto antes ou depois,
sem blocos de código markdown (sem ```), sem explicações.

O JSON deve ter exatamente esses campos:

{
  "region": "Londrina",
  "type": "urban",
  "week": "01/2025",
  "notified": 0,
  "confirmed": 0,
  "discarded": 0,
  "under_analysis": 0,
  "dengue_cases": 0,
  "dengue_alarm_cases": 0,
  "dengue_severe_cases": 0,
  "zika_cases": 0,
  "chikungunya_cases": 0,
  "deaths": 0
}

Instruções para preencher cada campo:
- region: sempre "Londrina"
- type: sempre "urban"
- week: semana epidemiológica inicial do período — formato "01/2025"
- notified: total de notificações de casos suspeitos de dengue
- confirmed: casos encerrados como confirmados
- discarded: casos descartados
- under_analysis: casos ainda em análise
- dengue_cases: mesmo valor que confirmed
- dengue_alarm_cases: casos de dengue com sinais de alarme (0 se não constar)
- dengue_severe_cases: casos de dengue grave (0 se não constar)
- zika_cases: casos de Zika confirmados (0 se não constar)
- chikungunya_cases: casos de Chikungunya confirmados (0 se não constar)
- deaths: óbitos confirmados por dengue

Se um campo não existir no documento, use 0.
Todos os campos numéricos devem ser inteiros, sem pontos de milhar.
"""


def limpar_resposta(texto: str) -> str:
    """
    Remove marcadores de código markdown da resposta.
    Mesmo pedindo JSON puro, o Gemini às vezes devolve dentro de ```json```.
    Essa função é uma proteção extra.
    """
    texto = texto.strip()
    if texto.startswith("```"):
        linhas = texto.split("\n")
        texto = "\n".join(linhas[1:-1])
    return texto.strip()


def validar_e_completar(dados: dict) -> dict:
    """
    Garante que todos os campos do contrato estão presentes.
    Se o Gemini não devolver algum campo, ele recebe valor padrão.
    Melhor ter 0 do que o CSV quebrado.
    """
    padroes = {
        "region": "Londrina", "type": "urban", "week": "01/2025",
        "notified": 0, "confirmed": 0, "discarded": 0, "under_analysis": 0,
        "dengue_cases": 0, "dengue_alarm_cases": 0, "dengue_severe_cases": 0,
        "zika_cases": 0, "chikungunya_cases": 0, "deaths": 0,
    }
    for campo, valor_padrao in padroes.items():
        if campo not in dados:
            print(f"  ⚠ Campo '{campo}' ausente — usando {valor_padrao}")
            dados[campo] = valor_padrao
    return dados


def salvar_csv(dados: dict, caminho_saida: Path) -> None:
    """
    Grava o dicionário como CSV.
    DictWriter garante a ordem exata das colunas do contrato,
    independente da ordem que o Gemini devolveu.
    extrasaction='ignore' descarta campos extras que o Gemini possa ter adicionado.
    """
    caminho_saida.parent.mkdir(parents=True, exist_ok=True)
    with open(caminho_saida, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=CAMPOS_CONTRATO, extrasaction="ignore")
        writer.writeheader()
        writer.writerow(dados)
    print(f"  ✔ CSV salvo: {caminho_saida}")


def processar_pdf(caminho_pdf: Path) -> None:
    """
    Pipeline completo para um PDF:
    1. Lê o PDF como bytes
    2. Manda para o Gemini com o prompt
    3. Limpa a resposta
    4. Converte JSON texto → dicionário Python
    5. Valida os campos
    6. Salva como CSV
    """
    print(f"\nProcessando: {caminho_pdf.name}")

    # "rb" = read binary — PDFs são binários, não texto
    with open(caminho_pdf, "rb") as f:
        pdf_bytes = f.read()
    print(f"  → PDF lido ({len(pdf_bytes) // 1024} KB)")

    print("  → Enviando para o Gemini...")
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[
            types.Part.from_bytes(data=pdf_bytes, mime_type="application/pdf"),
            PROMPT,
        ]
    )

    texto_limpo = limpar_resposta(response.text)

    # json.loads() converte string JSON → dicionário Python
    # Quebra se o texto não for JSON válido — por isso a limpeza acima importa
    try:
        dados = json.loads(texto_limpo)
    except json.JSONDecodeError as e:
        print(f"  ✘ Gemini não devolveu JSON válido: {e}")
        print(f"  Resposta recebida:\n{texto_limpo[:300]}")
        return

    dados = validar_e_completar(dados)

    # stem pega o nome do arquivo sem extensão
    # boletim_londrina.pdf → boletim_londrina → boletim_londrina.csv
    nome_saida = caminho_pdf.stem + ".csv"
    salvar_csv(dados, PROCESSED_DIR / nome_saida)

    print(f"  → Semana:      {dados['week']}")
    print(f"  → Notificados: {dados['notified']}")
    print(f"  → Confirmados: {dados['confirmed']}")
    print(f"  → Descartados: {dados['discarded']}")
    print(f"  → Em análise:  {dados['under_analysis']}")
    print(f"  → Óbitos:      {dados['deaths']}")
    print(f"  → Zika:        {dados['zika_cases']}")
    print(f"  → Chikungunya: {dados['chikungunya_cases']}")


def main() -> None:
    """
    sys.argv é a lista de argumentos da linha de comando.
    sys.argv[0] = nome do script
    sys.argv[1] = primeiro argumento (se existir)
    """
    if len(sys.argv) > 1:
        pdf = Path(sys.argv[1])
        if not pdf.is_absolute():
            pdf = RAW_DIR / pdf
        if not pdf.exists():
            print(f"ERRO: arquivo não encontrado — {pdf}")
            sys.exit(1)
        processar_pdf(pdf)
    else:
        pdfs = sorted(RAW_DIR.glob("*.pdf"))
        if not pdfs:
            print(f"Nenhum PDF encontrado em {RAW_DIR}")
            sys.exit(1)
        print(f"Encontrados {len(pdfs)} PDF(s) em data/raw/")
        for pdf in pdfs:
            processar_pdf(pdf)
    print("\nConcluído.")


# Esse if garante que main() só roda quando você executa o script diretamente.
# Se outro arquivo importar esse módulo, main() não é chamada automaticamente.
if __name__ == "__main__":
    main()