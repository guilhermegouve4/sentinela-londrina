# STATUS — AEP Sentinela Londrina

> Última atualização: 03/04/2026 | Entrega: 06/04/2026 (3 dias)

## FASE ATUAL

Projeto completo. Pipeline end-to-end funcionando: PDF → Parser Python (Gemini) → CSV → C++ (LinkedList) → result.json → Dashboard Next.js. Faltam UML e documento ABNT.

## PROGRESSO

🟩🟩🟩🟩🟩🟩🟩🟩🟩⬜ 90%

## ENTREGÁVEIS

| Issue | Item | Responsável | Status |
|-------|------|-------------|--------|
| #20 | Contrato CSV | Guilherme | ✅ Feito |
| #1  | Classe `Locality` (abstrata, C++) | Guilherme | ✅ Feito |
| #2  | Classe `Node` (C++) | Guilherme | ✅ Feito |
| #21 | Pesquisa: fontes de dados e libs PDF | Gabriel | ✅ Feito |
| #8  | Parser IA: `ai_scan.py` (PDF → Gemini → CSV) | Gabriel | ✅ Feito |
| —   | Download automático de PDFs (`download_bulletins.py`) | Gabriel | ✅ Feito |
| —   | 10 boletins reais processados (2025) | Gabriel | ✅ Feito |
| #5  | Classe `MonthlyBulletin` (C++) | Guilherme | ✅ Feito |
| #4  | Herança: `UrbanRegion` / `RuralDistrict` | Guilherme | ✅ Feito |
| #3  | `LinkedList` com `insertOrdered`, `find`, `remove` | Guilherme | ✅ Feito |
| #6  | `CSVReader` C++ | Guilherme | ✅ Feito |
| #28 | `JSONWriter` C++ | Guilherme | ✅ Feito |
| #7  | `SituationalAnalysis` C++ | Guilherme | ✅ Feito |
| #12 | Integração end-to-end: CSV → C++ → result.json | Guilherme | ✅ Feito |
| #9  | Wireframes do dashboard | Gabriel + Alan | ✅ Feito |
| #19 | Dashboard Next.js — 9 páginas com dados reais | Gabriel | ✅ Feito |
| #11 | Documento ABNT | Grupo | 🔄 Em andamento |
| #10 | Diagrama de Classes UML | Alan | 🔄 Em andamento |
| #18 | Pitch de 5 minutos | Grupo | ⏳ Pendente |

## O QUE FOI FEITO (por sessão)

- **16/03** — Sessão 0: stack, equipe, prazos, ADRs iniciais. Repo criado.
- **17-22/03** — Sessão 1-3: `Locality.h/.cpp`, `Node.h/.cpp`, contrato CSV, frontend Next.js inicializado, benchmark de bibliotecas PDF, wireframes do dashboard (Gabriel).
- **23-25/03** — Sessão 4: `Node` implementado. Documento AEP iniciado. `ai_scan.py` (parser Gemini completo), `result.json` mock para o frontend.
- **27/03** — Gabriel: 10 boletins 2025 processados, CSVs em `data/processed/`. `download_bulletins.py` (download automático de PDFs).
- **28/03** — Sessão 5: `MonthlyBulletin`, `UrbanRegion`, `RuralDistrict`, `LinkedList` implementados. Refactor: `WeeklyBulletin` → `MonthlyBulletin`, campo `week` → `month`.
- **30/03** — Sessão 6: `CSVReader`, `JSONWriter` implementados. Gabriel: estrutura de rotas do Next.js, fix do parser, primeiras páginas do dashboard.
- **01/04** — Sessão 7: `main.cpp`, `SituationalAnalysis` implementados. Pipeline end-to-end validado. ADRs 013-017 registrados.
- **03/04** — Sessão 8: Dashboard completo — 9 páginas implementadas com dados reais do `result.json` (Visão Geral, Evolução, Relatório, Alertas, Boletins, Filtros, Histórico, Hierarquia, Ingestão). Fix issues #40 e #41 no parser. CSVs e `result.json` regenerados.

## DECISÕES DE ARQUITETURA (ADRs)

| # | Decisão | Data |
|---|---------|------|
| 001 | Backend em C++ (não C puro) | 16/03/2026 |
| 002 | Python para parser/extração de texto | 16/03/2026 |
| 003 | ~~Coleta manual no 1º bim~~ — substituída por ADR 005 | 16/03/2026 |
| 004 | CSVs como formato intermediário (Python → C++) | 16/03/2026 |
| 005 | Gemini API (`gemini-2.5-flash`) como parser de PDF | 24/03/2026 |
| 006 | `result.json` como contrato entre C++ e frontend | 24/03/2026 |
| 007 | Boletins mensais — atualização uma vez por mês | 28/03/2026 |
| 008 | `WeeklyBulletin` renomeado para `MonthlyBulletin`, campo `week` → `month` | 28/03/2026 |
| 009 | `insertOrdered` ordena alfabeticamente por nome de região | 28/03/2026 |
| 010 | Código-fonte em inglês | ~20/03/2026 |
| 011 | Sublista de boletins: `head` = boletim mais recente (insert no início) | 28/03/2026 |
| 012 | Serialização JSON em classe `JSONWriter` separada — `main` só orquestra | 30/03/2026 |
| 013 | `SituationalAnalysis` calcula análises — `JSONWriter` serializa resultados | 01/04/2026 |
| 014 | Fator 1.25 no risco do `RuralDistrict` — subnotificação estrutural rural | 01/04/2026 |
| 015 | Status por região: `normal` (risk < 10%), `alert` (10-20%), `critical` (> 20%) | 01/04/2026 |
| 016 | NaN para `growth_rate` quando penúltimo boletim tem 0 confirmados | 01/04/2026 |
| 017 | Ranking de regiões por risco feito no frontend — LinkedList permanece alfabética | 01/04/2026 |
| 018 | Frontend calcula `summary` a partir de `regions[].bulletins[0]` — C++ não precisa gerar | 03/04/2026 |
| 019 | `under_analysis` = `notified - confirmed - discarded` (fix #41) — garante soma exata | 03/04/2026 |
| 020 | `month` derivado do nome do arquivo no parser (fix #40) — mais confiável que Gemini | 03/04/2026 |

## BLOQUEIOS

- UML ainda não criado (Alan)
- Documento ABNT em andamento (grupo)