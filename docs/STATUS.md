# STATUS — AEP Sentinela Londrina

> Última atualização: 16/03/2026

## FASE ATUAL
Planejamento concluído. Issues criadas no GitHub. Zero código produzido.

## PRAZOS

| Entrega | Data | Status |
|---------|------|--------|
| Parcial (1º bim) | 06/04/2026 | NÃO INICIADA |
| Final (2º bim) | 08/06/2026 | NÃO INICIADA |

## ENTREGÁVEIS DO 1º BIMESTRE

| Item | Responsável | Issue | Status |
|------|-------------|-------|--------|
| Contrato CSV | Guilherme + Pedro | #20 | Pendente |
| Diagrama de Classes UML | Guilherme | #10 | Pendente |
| Lista Encadeada (C++) | Guilherme | #1–#7 | Pendente |
| Parser/Extração (Python) | Pedro | #8 | Pendente |
| Coleta manual dos boletins | Pedro | — | Pendente |
| Wireframes | Gabriel + Alan | #9 | Pendente |
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
| 007 | calcularRisco() usa taxa de positividade (confirmados/notificados) | 16/03/2026 |
| 008 | DistritoRural usa fator 1.5 de subnotificação no risco | 16/03/2026 |
| 009 | LIRAa removido — não consta nos boletins disponíveis | 16/03/2026 |

## LOG DE MUDANÇAS

- **16/03/2026** — Sessão 0: definido stack, equipe, prazos, decisões iniciais
- **16/03/2026** — Sessão 1: revisão completa das issues, definição de atributos e fórmulas
