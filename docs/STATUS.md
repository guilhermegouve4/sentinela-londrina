# STATUS — AEP Sentinela Londrina

> Última atualização: 28/03/2026 | Semana 2 de 3 | Entrega: 06/04/2026 (9 dias)

## FASE ATUAL

Implementação. Backend C++ com estrutura de classes completa. Parser processando 11 boletins reais. Faltam `CSVReader`, integração e UML.

## PRAZOS

| Entrega | Data | Status |
|---------|------|--------|
| Parcial (1º bim) | 06/04/2026 | EM ANDAMENTO |
| Final (2º bim) | 08/06/2026 | Não iniciada |

## PROGRESSO

1º Bim (06/04): 🟩🟩🟩🟩🟩🟩⬜⬜⬜⬜ 60%
2º Bim (08/06): ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜  0%

## ENTREGÁVEIS DO 1º BIMESTRE

| Issue | Item | Responsável | Status |
|-------|------|-------------|--------|
| #20 | Contrato CSV | Guilherme + Pedro | ✅ Feito |
| #1  | Classe `Locality` (abstrata, C++) | Guilherme | ✅ Feito |
| #2  | Classe `Node` (C++) | Guilherme | ✅ Feito |
| #21 | Pesquisa: fontes de dados e libs PDF | Pedro | ✅ Feito |
| #8  | Parser IA: `ia_scan.py` (PDF → Gemini → CSV) | Pedro + Gabriel | ✅ Feito |
| #5  | Classe `MonthlyBulletin` (C++) | Guilherme | ✅ Feito |
| #4  | Herança: `UrbanRegion` / `RuralDistrict` | Guilherme | ✅ Feito |
| #3  | `LinkedList` com `insertOrdered`, `find`, `remove` | Guilherme | ✅ Feito |
| —   | 11 boletins reais processados (2025) | Pedro | ✅ Feito |
| —   | Download automático de PDFs (`baixar_boletins.py`) | Gabriel | ✅ Feito |
| #9  | Wireframes do dashboard | Gabriel + Alan | 🔄 Em andamento |
| #19 | Dashboard Next.js | Gabriel + Alan | 🔄 Em andamento |
| #11 | Documento ABNT — entrega parcial | Grupo todo | 🔄 Em andamento |
| #6  | `CSVReader` C++ | Guilherme | ⏳ Pendente |
| #12 | Integração end-to-end: CSV → C++ → resultado.json | Guilherme | ⏳ Pendente |
| #10 | Diagrama de Classes UML | Guilherme | ⏳ Pendente |

## O QUE FOI FEITO (por sessão)

- **16/03** — Sessão 0: stack, equipe, prazos, ADRs iniciais. Repo criado.
- **17-22/03** — Sessão 1-3: `Locality.h/.cpp`, `Node.h/.cpp`, contrato CSV, frontend Next.js inicializado, benchmark de bibliotecas PDF, wireframes do dashboard (Gabriel).
- **23-25/03** — Sessão 4: `Node` implementado. Documento AEP iniciado. `ia_scan.py` (parser Gemini completo), `output-schema.json`, `resultado.json` mock para o frontend.
- **27/03** — Pedro: 11 boletins 2025 processados, CSVs em `data/processed/`. Gabriel: `baixar_boletins.py` (download automático de PDFs).
- **28/03** — Sessão 5: `MonthlyBulletin`, `UrbanRegion`, `RuralDistrict`, `LinkedList` implementados. Reorganização de pastas. Refactor: `WeeklyBulletin` → `MonthlyBulletin`, campo `week` → `month`.

## DECISÕES DE ARQUITETURA (ADRs)

| # | Decisão | Data |
|---|---------|------|
| 001 | Backend em C++ (não C puro) | 16/03/2026 |
| 002 | Python para parser/extração de texto | 16/03/2026 |
| 003 | ~~Coleta manual no 1º bim~~ — substituída por ADR 005 | 16/03/2026 |
| 004 | CSVs como formato intermediário (Python → C++) | 16/03/2026 |
| 005 | Gemini API (`gemini-2.5-flash`) como parser de PDF | 24/03/2026 |
| 006 | `resultado.json` como contrato entre C++ e frontend | 24/03/2026 |
| 007 | Boletins mensais — atualização uma vez por mês | 28/03/2026 |
| 010 | Código-fonte em inglês | ~20/03/2026 |

## BLOQUEIOS

- UML ainda não criado
- `ia_scan.py` ainda usa campo `week` — Pedro precisa atualizar para `month`
- Parser ainda distribui por percentuais fixos — validar se percentuais somando 110.9% é intencional

## PRÓXIMOS PASSOS (Semana 2)

| Dia | Quem | O quê |
|-----|------|-------|
| Sáb 29 | Guilherme | `CSVReader` em C++ |
| Sáb 29 | Pedro | Atualizar `week` → `month` no `ia_scan.py` |
| Dom 30 | Guilherme | Integração end-to-end: CSV → CSVReader → LinkedList → resultado.json |
| Seg 31 | Guilherme | UML de classes |
| Seg 31 | Grupo | Reunião: status check — código, wireframes, documento |
