# STATUS — AEP Sentinela Londrina

> Última atualização: 30/03/2026 | Semana 2 de 3 | Entrega: 06/04/2026 (7 dias)

## FASE ATUAL

Implementação. Backend C++ com estrutura de classes completa, incluindo `CSVReader` e `JSONWriter`. Parser processando 10 boletins reais. Faltam `main.cpp` e UML.

## PRAZOS

| Entrega | Data | Status |
|---------|------|--------|
| Parcial (1º bim) | 06/04/2026 | EM ANDAMENTO |
| Final (2º bim) | 08/06/2026 | Não iniciada |

## PROGRESSO

1º Bim (06/04): 🟩🟩🟩🟩🟩🟩🟩🟩🟩⬜ 90%
2º Bim (08/06): ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜  0%

## ENTREGÁVEIS DO 1º BIMESTRE

| Issue | Item | Responsável | Status |
|-------|------|-------------|--------|
| #20 | Contrato CSV | Guilherme + Pedro | ✅ Feito |
| #1  | Classe `Locality` (abstrata, C++) | Guilherme | ✅ Feito |
| #2  | Classe `Node` (C++) | Guilherme | ✅ Feito |
| #21 | Pesquisa: fontes de dados e libs PDF | Pedro | ✅ Feito |
| #8  | Parser IA: `ai_scan.py` (PDF → Gemini → CSV) | Pedro + Gabriel | ✅ Feito |
| #5  | Classe `MonthlyBulletin` (C++) | Guilherme | ✅ Feito |
| #4  | Herança: `UrbanRegion` / `RuralDistrict` | Guilherme | ✅ Feito |
| #3  | `LinkedList` com `insertOrdered`, `find`, `remove` | Guilherme | ✅ Feito |
| —   | 11 boletins reais processados (2025) | Gabriel | ✅ Feito |
| —   | Download automático de PDFs (`download_bulletins.py`) | Gabriel | ✅ Feito |
| #9  | Wireframes do dashboard | Gabriel + Alan | ✅ Feito |
| #19 | Dashboard Next.js | Gabriel + Alan | 🔄 Em andamento |
| #11 | Documento ABNT — entrega parcial | Grupo todo | 🔄 Em andamento |
| #6  | `CSVReader` C++ | Guilherme | ✅ Feito |
| #28 | `JSONWriter` C++ | Guilherme | ✅ Feito |
| #12 | Integração end-to-end: CSV → C++ → result.json | Guilherme | ⏳ Pendente |
| #10 | Diagrama de Classes UML | Alan | 🔄 Em andamento |

## O QUE FOI FEITO (por sessão)

- **16/03** — Sessão 0: stack, equipe, prazos, ADRs iniciais. Repo criado.
- **17-22/03** — Sessão 1-3: `Locality.h/.cpp`, `Node.h/.cpp`, contrato CSV, frontend Next.js inicializado, benchmark de bibliotecas PDF, wireframes do dashboard (Gabriel).
- **23-25/03** — Sessão 4: `Node` implementado. Documento AEP iniciado. `ai_scan.py` (parser Gemini completo), `result.json` mock para o frontend.
- **27/03** — Gabriel: 11 boletins 2025 processados, CSVs em `data/processed/`. Gabriel: `download_bulletins.py` (download automático de PDFs).
- **28/03** — Sessão 5: `MonthlyBulletin`, `UrbanRegion`, `RuralDistrict`, `LinkedList` implementados. Reorganização de pastas. Refactor: `WeeklyBulletin` → `MonthlyBulletin`, campo `week` → `month`.
- **30/03** — Sessão 6: `CSVReader` implementado. `JSONWriter` implementado como classe separada (ADR 012). `getHead()` adicionado em `LinkedList` e `Locality`. Headers dos CSVs corrigidos (`week` → `month`). Gabriel: estrutura de rotas do Next.js, fix do parser.

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

## BLOQUEIOS

- UML ainda não criado
- Parser ainda distribui por percentuais fixos — validar se percentuais somando 110.9% é intencional

## PRÓXIMOS PASSOS (Semana 2)

| Dia | Quem | O quê |
|-----|------|-------|
| Ter 31 | Guilherme | `main.cpp` — orquestração end-to-end |
| Ter 31 | Alan | UML de classes |
| Ter 31 | Grupo | Reunião: status check — código, wireframes, documento |
