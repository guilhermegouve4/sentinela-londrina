# 🦟 Sentinela Londrina

> Sistema de monitoramento de arboviroses (Dengue, Zika, Chikungunya) usando dados abertos da prefeitura de Londrina.

**AEP — Unicesumar 2026 | Análise e Desenvolvimento de Sistemas — 3ª Série**

---

## Sobre o Projeto

A Secretaria Municipal de Saúde de Londrina publica periodicamente boletins epidemiológicos com dados de Dengue, Zika e Chikungunya. Este sistema atua como uma camada de inteligência sobre esses dados: minerando, organizando e gerando relatórios situacionais por região.

### O que o sistema faz

- **Ingere** dados extraídos dos boletins epidemiológicos (CSV)
- **Organiza** em listas encadeadas dinâmicas por região e cronologia
- **Analisa** taxas de incidência, índice LIRAa e crescimento entre boletins
- **Apresenta** dashboard visual com filtros por localidade

## Stack

| Camada | Tecnologia | Responsável |
|--------|-----------|-------------|
| Backend | C++ (POO, lista encadeada manual) | Guilherme, Pedro |
| Parser | Python (extração de boletins → CSV) | Gabriel, Pedro |
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
│   ├── mock/           # CSVs de desenvolvimento
│   └── processed/      # CSVs gerados pelo parser
├── docs/
│   ├── ROADMAP_1BIM.md
│   ├── contrato-csv.md
│   └── documento-abnt/
├── CLAUDE.md
└── .gitignore
```

## Prazos

| Entrega | Data | Status |
|---------|------|--------|
| Parcial (1º bim) | 06/04/2026 | 🔴 Em andamento |
| Final (2º bim) | 08/06/2026 | ⚪ Não iniciada |

## Como rodar

> Em breve.

## Equipe

| Nome | Papel |
|------|-------|
| Guilherme | Backend C++|
| Gabriel | Parser Python |
| Pedro | Parser Python |
| Gabriel | Frontend Next.js |
| Alan | Frontend Next.js |

## Fontes de Dados

- [Blog da Prefeitura de Londrina — Aedes aegypti](https://blog.londrina.pr.gov.br/?tag=aedes-aegypti)
- [SESA Paraná — Boletins da Dengue](https://www.dengue.pr.gov.br/Pagina/Boletins-da-Dengue)
