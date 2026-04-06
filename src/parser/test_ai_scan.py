import pytest
import json
import sys
import os
from pathlib import Path
from unittest.mock import patch, MagicMock

# Adiciona o diretório src/parser ao path para importar o ai_scan
sys.path.append(str(Path(__file__).resolve().parent))

# Mock do genai antes de importar o ai_scan para evitar erros de API Key
with patch('google.genai.Client'):
    # Define uma chave fake para o import não falhar
    os.environ["GEMINI_API_KEY"] = "fake_key"
    import ai_scan

# Mock para a resposta do Gemini
class MockResponse:
    def __init__(self, text_content):
        self.text = text_content

@pytest.fixture
def mock_config_file(tmp_path):
    config_data = {
        "REGIOES": [
            {"name": "Norte",    "type": "urban",  "percentage": 0.370},
            {"name": "Sul",      "type": "urban",  "percentage": 0.214},
            {"name": "Leste",    "type": "urban",  "percentage": 0.131},
            {"name": "Oeste",    "type": "urban",  "percentage": 0.131},
            {"name": "Central",  "type": "urban",  "percentage": 0.147},
            {"name": "Rural",    "type": "rural",  "percentage": 0.116}
        ]
    }
    config_path = tmp_path / "config.json"
    with open(config_path, 'w', encoding='utf-8') as f:
        json.dump(config_data, f)
    return config_path

def test_load_regions_config_success(mock_config_file):
    regions = ai_scan.load_regions_config(mock_config_file)
    assert len(regions) == 6
    assert regions[0] == ("Norte", "urban", 0.370)
    assert regions[-1] == ("Rural", "rural", 0.116)

def test_limpar_resposta():
    assert ai_scan.limpar_resposta("```json\n{\"key\": \"value\"}\n```") == '{"key": "value"}'
    assert ai_scan.limpar_resposta("{\"key\": \"value\"}") == '{"key": "value"}'

def test_validar_totais():
    dados_incompletos = {"month": "02/2025", "notified": 100}
    validados = ai_scan.validar_totais(dados_incompletos)
    assert validados["confirmed"] == 0
    assert validados["deaths"] == 0
    assert validados["month"] == "02/2025"
