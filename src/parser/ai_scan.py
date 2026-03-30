"""
ia_scan.py
Parser inteligente: usa o Gemini para ler PDFs epidemiológicos
e gerar CSVs no formato EXATO do contrato (docs/contrato-csv.md).

Como funciona:
    PDF → Gemini extrai totais municipais → distribui por região → salva CSV

Por que distribuir por região?
    O boletim PDF da Prefeitura de Londrina dá totais do município inteiro.
    O contrato CSV exige uma linha por região (Norte, Sul, Leste, Oeste, Central, Rural).
    Usamos os percentuais do Dashboard da Prefeitura para distribuir os totais.

Fonte dos percentuais:
    Dashboard ARBOVIROSES da Prefeitura de Londrina:
    https://lookerstudio.google.com/reporting/a0e44fa8-253f-4dea-a35b-eb7c6f831a1b

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
# =============================================================================

BASE_DIR      = Path(__file__).resolve().parent.parent.parent
RAW_DIR       = BASE_DIR / "data" / "raw"
PROCESSED_DIR = BASE_DIR / "data" / "processed"

# =============================================================================
# CONFIGURAÇÃO DA API
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
# CAMPOS DO CONTRATO CSV (ordem exata de docs/contrato-csv.md)
# =============================================================================

CAMPOS_CONTRATO = [
    "region", "type", "month",
    "notified", "confirmed", "discarded", "under_analysis",
    "dengue_cases", "dengue_alarm_cases", "dengue_severe_cases",
    "zika_cases", "chikungunya_cases", "deaths",
]

# =============================================================================
# DISTRIBUIÇÃO POR REGIÃO
#
# O boletim PDF dá totais de Londrina inteira.
# O contrato exige dados por região: Norte, Sul, Leste, Oeste, Central, Rural.
#
# Fonte dos percentuais:
#   Dashboard ARBOVIROSES da Prefeitura — gráfico "Notificados por Região"
#   Esses valores são uma aproximação baseada nos dados históricos do dashboard.
#   Atualizar conforme novos boletins forem publicados.
#
# Como atualizar:
#   1. Abra o dashboard da Prefeitura
#   2. Selecione o período do boletim
#   3. Leia o gráfico "Notificados por Região"
#   4. Atualize os valores abaixo
# =============================================================================

REGIOES = [
    # (nome,       type,    percentual_notificados)
    ("Norte",    "urban",  0.370),
    ("Sul",      "urban",  0.214),
    ("Leste",    "urban",  0.131),
    ("Oeste",    "urban",  0.131),
    ("Central",  "urban",  0.147),
    ("Rural",    "rural",  0.116),
]

# Verificação: percentuais devem somar ~1.0
_soma = sum(r[2] for r in REGIOES)
assert abs(_soma - 1.109) < 0.02, f"Percentuais somam {_soma:.3f}, verifique REGIOES"

# =============================================================================
# O PROMPT
#
# Pedimos os TOTAIS MUNICIPAIS — o Gemini não precisa saber de regiões.
# A distribuição por região é feita pelo nosso código depois.
# =============================================================================

PROMPT = """
Você é um extrator de dados epidemiológicos especializado em boletins da Prefeitura de Londrina.

Analise o PDF anexo e extraia os TOTAIS MUNICIPAIS de arboviroses (Dengue, Zika, Chikungunya).

Retorne SOMENTE um objeto JSON válido, sem nenhum texto antes ou depois,
sem blocos de código markdown (sem ```), sem explicações.

O JSON deve ter exatamente esses campos:

{
  "month": "01/2025",
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
- month: mês de referência do boletim — formato "01/2025"
- notified: total de notificações de casos suspeitos de dengue em Londrina
- confirmed: casos encerrados como confirmados em Londrina
- discarded: casos descartados em Londrina
- under_analysis: casos ainda em análise em Londrina
- dengue_cases: mesmo valor que confirmed
- dengue_alarm_cases: casos de dengue com sinais de alarme (0 se não constar)
- dengue_severe_cases: casos de dengue grave (0 se não constar)
- zika_cases: casos de Zika confirmados (0 se não constar)
- chikungunya_cases: casos de Chikungunya confirmados (0 se não constar)
- deaths: óbitos confirmados por dengue

Se um campo não existir no documento, use 0.
Todos os campos numéricos devem ser inteiros, sem pontos de milhar.
NÃO inclua o campo "region" — esse campo é gerenciado pelo sistema.
"""


def limpar_resposta(texto: str) -> str:
    """Remove marcadores de código markdown da resposta do Gemini."""
    texto = texto.strip()
    if texto.startswith("```"):
        linhas = texto.split("\n")
        texto = "\n".join(linhas[1:-1])
    return texto.strip()


def validar_totais(dados: dict) -> dict:
    """
    Garante que todos os campos numéricos estão presentes.
    Campos faltantes recebem 0.
    """
    padroes = {
        "month": "01/2025",
        "notified": 0, "confirmed": 0, "discarded": 0, "under_analysis": 0,
        "dengue_cases": 0, "dengue_alarm_cases": 0, "dengue_severe_cases": 0,
        "zika_cases": 0, "chikungunya_cases": 0, "deaths": 0,
    }
    for campo, valor_padrao in padroes.items():
        if campo not in dados:
            print(f"  ⚠ Campo '{campo}' ausente — usando {valor_padrao}")
            dados[campo] = valor_padrao
    return dados


def distribuir_por_regiao(totais: dict) -> list[dict]:
    """
    Distribui os totais municipais pelas 6 regiões usando percentuais do dashboard.

    Exemplo:
        totais["notified"] = 1000
        Norte tem 37% → Norte.notified = 370
        Sul tem 21.4% → Sul.notified = 214
        ...

    A última região recebe o restante para evitar erros de arredondamento.
    Isso garante que a soma das regiões = total municipal.
    """
    # Campos numéricos que serão distribuídos proporcionalmente
    campos_numericos = [
        "notified", "confirmed", "discarded", "under_analysis",
        "dengue_cases", "dengue_alarm_cases", "dengue_severe_cases",
        "zika_cases", "chikungunya_cases", "deaths",
    ]

    linhas = []
    soma_pct = sum(r[2] for r in REGIOES)  # normaliza se não somar exatamente 1

    for i, (nome, tipo, pct) in enumerate(REGIOES):
        linha = {
            "region": nome,
            "type": tipo,
            "month": totais["month"],
        }

        for campo in campos_numericos:
            total = totais.get(campo, 0)

            if i < len(REGIOES) - 1:
                # Distribui proporcionalmente
                linha[campo] = round(total * (pct / soma_pct))
            else:
                # Última região: pega o restante para fechar o total
                ja_distribuido = sum(
                    linhas[j][campo] for j in range(len(linhas))
                )
                linha[campo] = max(0, total - ja_distribuido)

        linhas.append(linha)

    return linhas


def salvar_csv(linhas: list[dict], caminho_saida: Path) -> None:
    """
    Grava as linhas como CSV no formato exato do contrato.
    Uma linha por região — 6 linhas no total.
    """
    caminho_saida.parent.mkdir(parents=True, exist_ok=True)
    with open(caminho_saida, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=CAMPOS_CONTRATO, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(linhas)
    print(f"  ✔ CSV salvo: {caminho_saida} ({len(linhas)} linhas)")


def processar_pdf(caminho_pdf: Path) -> None:
    """
    Pipeline completo:
    1. Lê o PDF
    2. Gemini extrai totais municipais
    3. Distribui por região (6 linhas)
    4. Salva CSV
    """
    print(f"\nProcessando: {caminho_pdf.name}")

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

    try:
        totais = json.loads(texto_limpo)
    except json.JSONDecodeError as e:
        print(f"  ✘ Gemini não devolveu JSON válido: {e}")
        print(f"  Resposta recebida:\n{texto_limpo[:300]}")
        return

    totais = validar_totais(totais)

    print(f"  → Totais municipais extraídos:")
    print(f"     Mês:      {totais['month']}")
    print(f"     Notificados: {totais['notified']}")
    print(f"     Confirmados: {totais['confirmed']}")
    print(f"     Descartados: {totais['discarded']}")
    print(f"     Em análise:  {totais['under_analysis']}")
    print(f"     Óbitos:      {totais['deaths']}")

    linhas = distribuir_por_regiao(totais)

    print(f"  → Distribuição por região:")
    for l in linhas:
        print(f"     {l['region']:10} notified={l['notified']:5}  confirmed={l['confirmed']:4}  risk_type={l['type']}")

    nome_saida = caminho_pdf.stem + ".csv"
    salvar_csv(linhas, PROCESSED_DIR / nome_saida)


def main() -> None:
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


if __name__ == "__main__":
    main()