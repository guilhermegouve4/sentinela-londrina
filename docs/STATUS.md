# STATUS — AEP Sentinela Londrina

> Última atualização: 25/03/2026 | Semana 1 de 3 | Entrega: 06/04/2026 (12 dias)

## FASE ATUAL

Implementação. Semana 1 — estrutura C++ em andamento. Parser substituído por `ia_scan.py` (Gemini API): Pedro só precisa rodar o script nos boletins reais.

## PRAZOS

| Entrega | Data | Status |
|---------|------|--------|
| Parcial (1º bim) | 06/04/2026 | EM ANDAMENTO |
| Final (2º bim) | 08/06/2026 | Não iniciada |

## PROGRESSO

1º Bim (06/04): 🟩🟩🟩🟩⬜⬜⬜⬜⬜⬜ 40%
2º Bim (08/06): ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜  0%

## ENTREGÁVEIS DO 1º BIMESTRE

| Issue | Item | Responsável | Status |
|-------|------|-------------|--------|
| #20 | Contrato CSV | Guilherme + Pedro | ✅ Feito |
| #1  | Classe `Locality` (abstrata, C++) | Guilherme | ✅ Feito (issue aberta) |
| #2  | Classe `Node` (C++) | Guilherme | ✅ Feito (issue aberta) |
| #21 | Pesquisa: fontes de dados e libs PDF | Pedro | ✅ Feito (issue aberta) |
| #8  | Parser IA: `ia_scan.py` (PDF → Gemini → CSV) | Pedro + Gabriel | ✅ Feito (issue aberta) |
| —   | Schema + Mock `resultado.json` | Guilherme | ✅ Feito |
| #3  | `LinkedList` com `insertOrdered`, `find`, `remove` | Guilherme | 🔄 Em andamento |
| #9  | Wireframes do dashboard | Gabriel + Alan | 🔄 Em andamento (screenshots adicionados) |
| #19 | Dashboard Next.js | Gabriel + Alan | 🔄 Em andamento (projeto inicializado) |
| #11 | Documento ABNT — entrega parcial | Grupo todo | 🔄 Em andamento (docx iniciado) |
| #5  | Classe `WeeklyBulletin` (C++) | Guilherme | ⏳ Pendente |
| #4  | Herança: `UrbanRegion` / `RuralDistrict` | Guilherme | ⏳ Pendente |
| #6  | `CSVReader` C++ | Guilherme | ⏳ Pendente |
| #10 | Diagrama de Classes UML | Guilherme | ⏳ Pendente |
| #12 | Integração completa do backend C++ | Guilherme | ⏳ Pendente |

## O QUE FOI FEITO (por sessão)

- **16/03** — Sessão 0: stack, equipe, prazos, ADRs iniciais. Repo criado.
- **17-22/03** — Sessão 1-3: `Locality.h/.cpp` (abstrata + `calculateRisk()` virtual), `Node.h/.cpp`, contrato CSV, frontend Next.js inicializado, benchmark de bibliotecas PDF, wireframes do dashboard (Gabriel).
- **23-25/03** — Sessão 4: `Node` implementado. `LinkedList` em andamento. Documento AEP iniciado. **Pull 25/03:** `ia_scan.py` (parser Gemini completo), `resultado-schema.json` (contrato C++→frontend), `resultado.json` mock para o frontend.

## DECISÕES DE ARQUITETURA (ADRs)

| # | Decisão | Data |
|---|---------|------|
| 001 | Backend em C++ (não C puro) | 16/03/2026 |
| 002 | Python para parser/extração de texto | 16/03/2026 |
| 003 | ~~Coleta manual no 1º bim~~ — **substituída por ADR 005** | 16/03/2026 |
| 004 | CSVs como formato intermediário (Python → C++) | 16/03/2026 |
| 005 | Gemini API (`gemini-2.5-flash`) como parser de PDF — PDF → JSON → CSV, sem extração manual | 24/03/2026 |
| 006 | `resultado.json` como contrato entre C++ e frontend | 24/03/2026 |
| 010 | Código-fonte em inglês | ~20/03/2026 |

## BLOQUEIOS

- `LinkedList` ainda não criada — necessária para `CSVReader` e integração final
- UML v1 não foi criado (estava planejado para sáb 21/03)
- Pedro precisa rodar `ia_scan.py` nos boletins reais (`data/raw/`) → CSVs em `data/processed/` (script pronto, só falta executar)

## PRÓXIMOS PASSOS (Semana 1, restam 4 dias úteis)

| Dia | Quem | O quê |
|-----|------|-------|
| Qua 25 (hoje) | Guilherme | `LinkedList`: `find()` e `remove()` |
| Qui 26 | Guilherme | UML v2 + checkpoint com Pedro |
| Qui 26 | Pedro | Rodar `ia_scan.py` nos boletins reais → CSVs em `data/processed/` |
| Sex 27 | Guilherme | `CSVReader` em C++ |
| Sáb 29 | Guilherme | Integração end-to-end: CSV → CSVReader → LinkedList → print |
| Sáb 29 | Pedro | CSVs de pelo menos 3 boletins reais |
