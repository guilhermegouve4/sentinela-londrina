import pdfplumber
import fitz  # PyMuPDF
from pdfminer.high_level import extract_text as pdfminer_extract
import time
import json
import os

# Caminho do arquivo
pdf_path = r"C:/Users/Usuario/Documents/projetos/sentinela-londrina/data/raw/boletim_londrina.pdf"

def test_pdfplumber():
    start = time.time()
    results = []
    settings = {
        "vertical_strategy": "text", 
        "horizontal_strategy": "text",
        "snap_y_tolerance": 5,
    }
    with pdfplumber.open(pdf_path) as pdf:
        for i, page in enumerate(pdf.pages):
            text = page.extract_text()
            tables = page.extract_tables(table_settings=settings)
            real_tables = [t for t in tables if t and len(t[0]) > 1]
            results.append({
                "page": i + 1,
                "text_len": len(text) if text else 0,
                "tables_count": len(real_tables)
            })
    return time.time() - start, results

def test_pymupdf():
    start = time.time()
    results = []
    doc = fitz.open(pdf_path)
    for i, page in enumerate(doc):
        text = page.get_text()
        results.append({"page": i + 1, "text_len": len(text) if text else 0})
    return time.time() - start, results

def test_pdfminer():
    start = time.time()
    text = pdfminer_extract(pdf_path)
    return time.time() - start, len(text)

print("Iniciando testes de extração...")

t_plumber, r_plumber = test_pdfplumber()
print(f"pdfplumber: {t_plumber:.2f}s")

t_mupdf, r_mupdf = test_pymupdf()
print(f"PyMuPDF: {t_mupdf:.2f}s")

t_miner, r_miner = test_pdfminer()
print(f"pdfminer.six: {t_miner:.2f}s")

# NOVA ESTRATÉGIA: Vasculha todas as páginas em busca de tabelas de dados
print("\n--- Vasculhando o PDF em busca de dados de saúde ---")
doc = fitz.open(pdf_path)
termos_chave = ["dengue", "bairro", "casos", "confirmados", "notificados"]

for i in range(len(doc)):
    page = doc[i]
    texto_pagina = page.get_text().lower()
    
    # Verifica se a página contém termos que indicam tabelas de dados
    if any(termo in texto_pagina for termo in termos_chave):
        print(f"\n[!] Possível página de dados encontrada: Página {i+1}")
        blocks = page.get_text("blocks")
        
        # Mostra os blocos que parecem conter informações relevantes
        for b in blocks:
            conteudo = b[4].strip().replace('\n', ' ')
            # Filtra blocos muito pequenos ou vazios
            if len(conteudo) > 2:
                print(f"-> {conteudo}")

summary = {
    "pdfplumber": {"time": t_plumber, "pages": r_plumber},
    "pymupdf": {"time": t_mupdf, "pages": r_mupdf},
    "pdfminer": {"time": t_miner, "total_text_len": r_miner}
}

output_path = r"C:/Users/Usuario/Documents/projetos/sentinela-londrina/src/parser/tests/test_results.json"

# Garante que a pasta de destino existe
os.makedirs(os.path.dirname(output_path), exist_ok=True)

with open(output_path, "w", encoding='utf-8') as f:
    json.dump(summary, f, indent=4, ensure_ascii=False)

print("\nTestes concluídos.")
print(f"Resultados salvos em: {output_path}")
