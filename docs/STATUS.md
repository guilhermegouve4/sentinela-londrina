# STATUS — AEP Sentinela Londrina

> Última atualização: 23/03/2026

## PROGRESSO

1º Bim (06/04): 🟩🟩⬜⬜⬜⬜⬜⬜⬜⬜ 20%
2º Bim (08/06): ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜  0%

## PRAZOS

| Entrega | Data | Status |
|---------|------|--------|
| Parcial (1º bim) | 06/04/2026 | EM ANDAMENTO |
| Final (2º bim) | 08/06/2026 | NÃO INICIADA |

## ENTREGÁVEIS DO 1º BIMESTRE

| Item | Responsável | Issue | Status |
|------|-------------|-------|--------|
| Contrato CSV | Guilherme + Pedro | #20 | ✅ Concluído |
| Diagrama de Classes UML | Guilherme | #10 | Pendente |
| Lista Encadeada (C++) | Guilherme | #1–#7 | Em andamento |
| Parser/Extração (Python) | Pedro | #8 | Pendente |
| Coleta manual dos boletins | Pedro | — | Pendente |
| Wireframes | Gabriel + Alan | #9 | ✅ Concluído |
| Documento ABNT parcial | Grupo | #11 | Pendente |

## DECISÕES DE ARQUITETURA

| # | Decisão | Data |
|---|---------|------|
| 001 | Backend em C++ | 16/03/2026 |
| 002 | Python para parser/extração | 16/03/2026 |
| 003 | Coleta manual no 1º bim | 16/03/2026 |
| 004 | CSV como formato intermediário Python → C++ | 16/03/2026 |
| 005 | Frontend em Next.js | 16/03/2026 |
| 006 | C++ gera resultado.json, Next.js consome estático | 16/03/2026 |
| 007 | calculateRisk() usa taxa de positividade (confirmed/notified) | 16/03/2026 |
| 008 | RuralDistrict usa fator 1.5 de subnotificação no risco | 16/03/2026 |
| 009 | LIRAa removido — não consta nos boletins disponíveis | 16/03/2026 |
| 010 | Classes, métodos e atributos em inglês; texto de documentação e comentários em português | 17/03/2026 |

## LOG DE MUDANÇAS

- **16/03/2026** — Sessão 0: definido stack, equipe, prazos, decisões iniciais
- **16/03/2026** — Sessão 1: revisão completa das issues, definição de atributos e fórmulas
- **17/03/2026** — Sessão 2: início da implementação C++; decisão de padronizar código em inglês; frontend movido para src/frontend/; issues e project atualizados
- **19/03/2026** — Sessão 3: pesquisa de fonte de dados e benchmark de bibliotecas PDF (Gabriel); wireframes do dashboard concluídos (Gabriel + Alan)
- **23/03/2026** — Sessão 4: implementação de Locality.h e Locality.cpp (#1 concluída); criação do contrato-csv.md (#20 concluída); implementação de Node.h (#2 concluída); configuração do markdownlint
