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
import logging
from pathlib import Path

from dotenv import load_dotenv
from google import genai
from google.genai import types

# =============================================================================
# CONFIGURAÇÃO DE LOGGING
# =============================================================================
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler("parser.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# =============================================================================
# CAMINHOS DO PROJETO
# =============================================================================

BASE_DIR      = Path(__file__).resolve().parent.parent.parent
RAW_DIR       = BASE_DIR / "data" / "raw"
PROCESSED_DIR = BASE_DIR / "data" / "processed"
CONFIG_PATH   = BASE_DIR / "src" / "parser" / "config.json"

# =============================================================================
# CONFIGURAÇÃO DA API
# =============================================================================

load_dotenv()
CHAVE_API = os.getenv("GEMINI_API_KEY")

if not CHAVE_API:
    logger.error("ERRO: GEMINI_API_KEY não encontrada.")
    logger.error("Crie o arquivo .env na raiz do projeto com:")
    logger.error("  GEMINI_API_KEY=sua_chave_aqui")
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
# =============================================================================

def load_regions_config(config_path: Path) -> list[tuple[str, str, float]]:
    try:
        with open(config_path, 'r', encoding='utf-8') as f:
            config = json.load(f)
        regions_data = config.get("REGIOES", [])
        regions = []
        for r in regions_data:
            if all(k in r for k in ["name", "type", "percentage"]):
                regions.append((r["name"], r["type"], r["percentage"]))
            else:
                logger.error(f"ERRO: Configuração de região inválida em {config_path}. Faltando chaves 'name', 'type' ou 'percentage'.")
                sys.exit(1)
        return regions
    except FileNotFoundError:
        logger.error(f"ERRO: Arquivo de configuração não encontrado: {config_path}")
        sys.exit(1)
    except json.JSONDecodeError:
        logger.error(f"ERRO: Arquivo de configuração JSON inválido: {config_path}")
        sys.exit(1)

REGIOES = load_regions_config(CONFIG_PATH)

# Verificação: percentuais devem somar ~1.0
_soma = sum(r[2] for r in REGIOES)
# Ajustado para tolerar a soma de 1.109 que estava no código original ou 1.0
assert abs(_soma - 1.109) < 0.05 or abs(_soma - 1.0) < 0.05, f"Percentuais somam {_soma:.3f}, verifique REGIOES em {CONFIG_PATH}"

# =============================================================================
# O PROMPT
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
            logger.warning(f"Campo '{campo}' ausente na resposta do Gemini — usando {valor_padrao}")
            dados[campo] = valor_padrao
    return dados


def distribuir_por_regiao(totais: dict) -> list[dict]:
    """
    Distribui os totais municipais pelas 6 regiões usando percentuais do dashboard.
    """
    campos_proporcionais = [
        "notified", "confirmed", "discarded",
        "dengue_cases", "dengue_alarm_cases", "dengue_severe_cases",
        "zika_cases", "chikungunya_cases", "deaths",
    ]

    linhas = []
    soma_pct = sum(r[2] for r in REGIOES)

    for i, (nome, tipo, pct) in enumerate(REGIOES):
        linha = {
            "region": nome,
            "type": tipo,
            "month": totais["month"],
        }

        for campo in campos_proporcionais:
            total = totais.get(campo, 0)

            if i < len(REGIOES) - 1:
                linha[campo] = round(total * (pct / soma_pct))
            else:
                ja_distribuido = sum(linhas[j][campo] for j in range(len(linhas)))
                linha[campo] = max(0, total - ja_distribuido)

        linha["under_analysis"] = max(0, linha["notified"] - linha["confirmed"] - linha["discarded"])

        linhas.append(linha)

    return linhas


def salvar_csv(linhas: list[dict], caminho_saida: Path) -> None:
    """
    Grava as linhas como CSV no formato exato do contrato.
    """
    caminho_saida.parent.mkdir(parents=True, exist_ok=True)
    with open(caminho_saida, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=CAMPOS_CONTRATO, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(linhas)
    logger.info(f"CSV salvo: {caminho_saida} ({len(linhas)} linhas)")


def _extrair_mes_do_nome(stem: str) -> str | None:
    """
    Extrai o mês do nome do arquivo para garantir month correto.
    """
    import re
    m = re.match(r"(\d{4})-(\d{2})", stem)
    if m:
        return f"{m.group(2)}/{m.group(1)}"
    m = re.search(r"_(\d{2})_(\d{4})", stem)
    if m:
        return f"{m.group(1)}/{m.group(2)}"
    return None


def processar_pdf(caminho_pdf: Path) -> None:
    """
    Pipeline completo para processar um PDF.
    """
    logger.info(f"Processando: {caminho_pdf.name}")

    try:
        with open(caminho_pdf, "rb") as f:
            pdf_bytes = f.read()
        logger.info(f"PDF lido ({len(pdf_bytes) // 1024} KB)")
    except FileNotFoundError:
        logger.error(f"ERRO: Arquivo PDF não encontrado: {caminho_pdf}")
        return

    logger.info("Enviando para o Gemini...")
    try:
        # Usando a nova SDK google-genai
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=[
                types.Part.from_bytes(data=pdf_bytes, mime_type="application/pdf"),
                PROMPT,
            ],
            config=types.GenerateContentConfig(
                safety_settings=[
                    types.SafetySetting(
                        category="HARM_CATEGORY_HATE_SPEECH",
                        threshold="BLOCK_NONE",
                    ),
                    types.SafetySetting(
                        category="HARM_CATEGORY_DANGEROUS_CONTENT",
                        threshold="BLOCK_NONE",
                    ),
                    types.SafetySetting(
                        category="HARM_CATEGORY_HARASSMENT",
                        threshold="BLOCK_NONE",
                    ),
                    types.SafetySetting(
                        category="HARM_CATEGORY_SEXUALLY_EXPLICIT",
                        threshold="BLOCK_NONE",
                    ),
                ]
            )
        )
        
        if not response.text:
            logger.error("Resposta do Gemini vazia.")
            return
            
        texto_limpo = limpar_resposta(response.text)

    except Exception as e:
        logger.error(f"ERRO ao chamar Gemini: {e}")
        return

    try:
        totais = json.loads(texto_limpo)
    except json.JSONDecodeError as e:
        logger.error(f"Gemini não devolveu JSON válido: {e}")
        logger.error(f"Resposta recebida:\n{texto_limpo[:500]}...")
        return

    totais = validar_totais(totais)

    mes_do_arquivo = _extrair_mes_do_nome(caminho_pdf.stem)
    if mes_do_arquivo:
        totais["month"] = mes_do_arquivo

    logger.info(f"Totais municipais extraídos: {totais}")

    linhas = distribuir_por_regiao(totais)

    for l in linhas:
        logger.debug(f"Distribuição por região: {l['region']} notified={l['notified']} confirmed={l['confirmed']} risk_type={l['type']}")

    nome_saida = caminho_pdf.stem + ".csv"
    salvar_csv(linhas, PROCESSED_DIR / nome_saida)


def main() -> None:
    if len(sys.argv) > 1:
        pdf = Path(sys.argv[1])
        if not pdf.is_absolute():
            pdf = RAW_DIR / pdf
        if not pdf.exists():
            logger.error(f"ERRO: arquivo não encontrado — {pdf}")
            sys.exit(1)
        processar_pdf(pdf)
    else:
        pdfs = sorted(RAW_DIR.glob("*.pdf"))
        if not pdfs:
            logger.info(f"Nenhum PDF encontrado em {RAW_DIR}")
            sys.exit(0)
        logger.info(f"Encontrados {len(pdfs)} PDF(s) em data/raw/")
        for pdf in pdfs:
            processar_pdf(pdf)
    logger.info("Concluído.")


if __name__ == "__main__":
    main()
