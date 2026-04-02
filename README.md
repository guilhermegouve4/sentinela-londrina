# 🦟 Sentinela Londrina

> Sistema de monitoramento de arboviroses (Dengue, Zika, Chikungunya) usando dados abertos da prefeitura de Londrina.

**AEP — Unicesumar 2026 | Análise e Desenvolvimento de Sistemas — 3ª Série**

---

## Sobre o Projeto

A Secretaria Municipal de Saúde de Londrina publica periodicamente boletins epidemiológicos com dados de Dengue, Zika e Chikungunya. Este sistema atua como uma camada de inteligência sobre esses dados: minerando, organizando e gerando relatórios situacionais por região.

### O que o sistema faz

- **Ingere** dados extraídos dos boletins epidemiológicos (CSV)
- **Organiza** em listas encadeadas dinâmicas por região e cronologia
- **Analisa** risco por região, status epidemiológico e taxa de crescimento entre boletins
- **Apresenta** dashboard visual com filtros por localidade

## Stack

| Camada | Tecnologia | Responsável |
|--------|-----------|-------------|
| Backend | C++ (POO, lista encadeada manual) | Guilherme |
| Parser | Python (extração de boletins → CSV) | Pedro, Gabriel |
| Frontend | Next.js (dashboard) | Gabriel, Alan |

## Estrutura do Repositório

```
sentinela-londrina/
├── src/
│   ├── cpp/            # Backend C++
│   ├── parser/         # Scripts Python de extração
│   └── frontend/       # Next.js app
├── data/
│   ├── raw/            # Boletins PDF originais
│   └── processed/      # CSVs gerados pelo parser
├── docs/
│   ├── wireframes/     # Screenshots do dashboard
│   └── uml/            # Diagramas UML
└── .gitignore
```

## Prazos

| Entrega | Data | Status |
|---------|------|--------|
| Parcial (1º bim) | 06/04/2026 | 🟡 Em andamento |
| Final (2º bim) | 08/06/2026 | ⚪ Não iniciada |

## Como rodar

### Backend C++

```bash
# Compilar
g++ -std=c++17 -o sentinela src/cpp/src/main.cpp src/cpp/src/LinkedList.cpp src/cpp/src/Locality.cpp src/cpp/src/UrbanRegion.cpp src/cpp/src/RuralDistrict.cpp src/cpp/src/MonthlyBulletin.cpp src/cpp/src/Node.cpp src/cpp/src/CSVReader.cpp src/cpp/src/JSONWriter.cpp src/cpp/src/SituationalAnalysis.cpp

# Executar (gera src/frontend/public/result.json)
./sentinela
```

### Parser Python

```bash
pip install -r requirements.txt
python src/parser/ai_scan.py data/raw/<boletim>.pdf
```

### Frontend

```bash
cd src/frontend
npm install
npm run dev
# Acesse http://localhost:3000
```

## Equipe

| Nome | Papel |
|------|-------|
| Guilherme | Backend C++ |
| Pedro | Parser Python |
| Gabriel | Parser Python + Frontend Next.js |
| Alan | Frontend Next.js |

## Fontes de Dados

- [Blog da Prefeitura de Londrina — Aedes aegypti](https://blog.londrina.pr.gov.br/?tag=aedes-aegypti)
- [SESA Paraná — Boletins da Dengue](https://www.dengue.pr.gov.br/Pagina/Boletins-da-Dengue)
