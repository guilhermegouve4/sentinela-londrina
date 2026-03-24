import os
from dotenv import load_dotenv
from google import genai
from google.genai import types

# 1. Configuração
load_dotenv()
CHAVE_API = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=CHAVE_API)

# 2. Caminho do arquivo
#caminho_arquivo = "C:\Users\pedro\OneDrive\Documentos\sentinela-londrina\sentinela-londrina\data\raw\boletim_londrina.pdf"
caminho_arquivo = "C:/Users/pedro/OneDrive/Documentos/sentinela-londrina/sentinela-londrina/data/raw/boletim_londrina.pdf"
print("[LOG] Iniciando análise do PDF...")

# 3. Prompt específico para o seu Boletim
prompt = """
Analise o boletim epidemiológico anexo:
1. Resuma o panorama da Dengue em Londrina (notificações, positivos e óbitos da pág 4).
2. Com base na tabela de vírus respiratórios da pág 6, cite os mais prevalentes.
3. Extraia as orientações de preenchimento do SINAN para metanol.
4. Resuma os casos de Sarampo e Mpox.
"""

# 4. Execução (Usando o modelo 2.5-flash que apareceu no seu LOG)
try:
    # Na nova biblioteca, você pode enviar o arquivo local direto no generate
    with open(caminho_arquivo, "rb") as f:
        pdf_data = f.read()

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[
            types.Part.from_bytes(data=pdf_data, mime_type="application/pdf"),
            prompt
        ]
    )

    print("\n" + "="*30)
    print("--- RESULTADO DA EXTRAÇÃO ---")
    print(response.text)
    print("="*30)

except Exception as e:
    print(f"[LOG] ERRO CRÍTICO: {e}")