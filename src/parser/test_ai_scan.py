import pytest
import json
from pathlib import Path
from unittest.mock import patch, mock_open

# Importar as funções do ai_scan.py
# Para isso, precisamos ajustar o sys.path ou importar diretamente se o módulo estiver acessível
# Para fins de teste, vamos simular o ambiente de importação.
import sys
sys.path.append(str(Path(__file__).resolve().parent))
import ai_scan

# Mock para a API do Gemini, para evitar chamadas reais durante os testes
class MockResponse:
    def __init__(self, text_content):
        self.text = text_content

@pytest.fixture
def mock_gemini_client():
    with patch('ai_scan.genai.Client') as mock_client:
        mock_instance = mock_client.return_value
        mock_instance.models.generate_content.return_value = MockResponse('{}')
        yield mock_instance

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
    # Teste para verificar se a configuração é carregada corretamente
    regions = ai_scan.load_regions_config(mock_config_file)
    assert len(regions) == 6
    assert regions[0] == ("Norte", "urban", 0.370)
    assert regions[-1] == ("Rural", "rural", 0.116)


def test_load_regions_config_file_not_found():
    # Teste para arquivo de configuração não encontrado
    with pytest.raises(SystemExit):
        ai_scan.load_regions_config(Path("non_existent_config.json"))


def test_load_regions_config_invalid_json(tmp_path):
    # Teste para JSON inválido
    invalid_config_path = tmp_path / "invalid.json"
    invalid_config_path.write_text("{\"REGIOES\": [}")
    with pytest.raises(SystemExit):
        ai_scan.load_regions_config(invalid_config_path)


def test_limpar_resposta():
    # Teste para remover marcadores de código markdown
    assert ai_scan.limpar_resposta("```json\n{\"key\": \"value\"}\n```") == '{\"key\": \"value\"}'