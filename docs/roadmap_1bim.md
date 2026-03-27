# ROADMAP — 1º Bimestre (16/03 → 06/04/2026)

> **Meta:** Entrega parcial funcional — UML, Lista Encadeada (C++), Parser (Python), Wireframes, Documento ABNT.

---

## Premissas

- **Guilherme:** 
- **Pedro:** Parser Python (paralelo, desacoplado via CSV mock)
- **Gabriel + Alan:** Wireframes (autônomos, Guilherme só direciona)
- **Dependência crítica:** contrato do CSV definido antes de qualquer código

---

## SEMANA 0 — Ignição (16/03 → 22/03)

**Tema: Arquitetura + Contrato + Setup**

| Dia | Quem | O quê | Entregável |
|-----|------|-------|------------|
| Seg 16 | Guilherme | Sessão 0 no Claude. Montar repo GitHub, estrutura de pastas, README | Repo criado com estrutura |
| Ter 17 | Grupo | Reunião: apresentar o plano, definir contrato do CSV juntos | `docs/contrato-csv.md` com colunas, tipos, exemplo |
| Qua 18 | Guilherme | Criar CSV mock (10-15 linhas) baseado no contrato | `data/mock/boletim_mock.csv` |
| Qua 18 | Pedro | Baixar 2-3 boletins reais do blog da prefeitura, estudar estrutura | Boletins salvos em `data/raw/` |
| Qui 19 | Guilherme | Começar estudo C++: sintaxe básica, classes, construtores, new/delete | Anotações pessoais |
| Sex 20 | Guilherme | C++: ponteiros, alocação dinâmica, struct vs class | Exercícios pequenos compilando |
| Sáb 21 | Guilherme | Diagrama de Classes UML (rascunho v1) | `docs/diagrama-classes-v1.png` ou `.drawio` |
| Sáb 21 | Gabriel | Iniciar wireframes das telas principais | Rascunhos low-fi |

**Marco da semana:** Repo no ar, contrato CSV fechado, CSV mock pronto, C++ básico rodando.

### Direcionamento pro Gabriel e Alan (passar na terça)
- Telas mínimas: (1) Dashboard geral, (2) Filtro por região, (3) Relatório situacional
- Dados que cada tela mostra: usar o contrato CSV como referência
- Entregar wireframes low-fi até sábado 28/03

---

## SEMANA 1 — Estrutura (23/03 → 29/03)

**Tema: Lista Encadeada + Parser em paralelo**

| Dia | Quem | O quê | Entregável |
|-----|------|-------|------------|
| Seg 23 | Guilherme | C++: implementar classe `Node` e `LinkedList` (inserir no fim, imprimir) | Código compilando, testes manuais |
| Ter 24 | Guilherme | `insertOrdered()` — inserção mantendo ordem (por data ou gravidade) | Método funcionando com dados hardcoded |
| Ter 24 | Pedro | Parser v1: script Python que lê boletim PDF e extrai texto bruto | Script rodando em pelo menos 1 boletim |
| Qua 25 | Guilherme | `find()` e `remove()` — operações obrigatórias | Os 3 métodos obrigatórios funcionando |
| Qui 26 | Guilherme | Refinar UML: ajustar diagrama conforme código real. Adicionar herança (UrbanRegion / RuralDistrict) | `docs/diagrama-classes-v2` |
| Qui 26 | Pedro | Parser v2: transformar texto bruto → CSV no formato do contrato | CSV gerado a partir de boletim real |
| Sex 27 | Guilherme | Classe `CSVReader` em C++: ler o CSV mock e popular a lista encadeada | Lista populada a partir do arquivo |
| Sáb 29 | Guilherme | Integração: rodar o fluxo completo (CSV → CSVReader → LinkedList → print) | Fluxo end-to-end com mock |
| Sáb 29 | Pedro | Gerar CSVs de pelo menos 3 boletins reais | Arquivos em `data/processed/` |

**Marco da semana:** Lista encadeada completa com 3 operações, parser gerando CSVs, UML v2 pronto.

### Checkpoint com Pedro (quinta 26)
- O CSV dele bate com o contrato?
- Testar o CSV real no lugar do mock no C++
- Se não bater: ajustar contrato ou parser (melhor ajustar agora que na semana 3)

---

## SEMANA 2 — Integração + Documento (30/03 → 05/04)

**Tema: Polimento do código + Documento ABNT**

| Dia | Quem | O quê | Entregável |
|-----|------|-------|------------|
| Seg 30 | Guilherme | Substituir CSV mock pelos CSVs reais do Pedro. Testar, corrigir bugs | Sistema rodando com dados reais |
| Ter 31 | Guilherme | Implementar herança + polimorfismo (UrbanRegion/RuralDistrict com cálculos diferentes) | Classes especializadas funcionando |
| Ter 31 | Grupo | Reunião: status check — código, wireframes, parser. Alinhar documento | Lista de pendências |
| Qua 01 | Guilherme | Documento ABNT: estrutura + referencial teórico (reaproveitar contexto do REGRAS_AEP) | Seções 1-3 do documento |
| Qui 02 | Guilherme | Documento ABNT: descrição do escopo, modelagem de dados, inserir UML | Seções 4-5 |
| Sex 03 | Guilherme | Documento ABNT: prototipagem (inserir wireframes do Gabriel), implementação da lista | Seções 6-7 |
| Sáb 04 | Guilherme | Revisão geral: documento, código, repo organizado | Tudo pronto pra entrega |
| Dom 05 | Grupo | Buffer de emergência — corrigir qualquer pendência | — |

**Marco da semana:** Entrega pronta. Código funcional + UML + Documento ABNT + Wireframes.

---

## Entrega: 06/04/2026 (Segunda)

### Checklist final
- [ ] Diagrama de Classes UML (versão final, coerente com o código)
- [ ] LinkedList C++ com `insertOrdered()`, `remove()`, `find()`
- [ ] Encapsulamento (atributos privados + getters/setters)
- [ ] Herança + Polimorfismo (UrbanRegion / RuralDistrict)
- [ ] Parser Python gerando CSVs no formato do contrato
- [ ] CSVReader em C++ consumindo os CSVs
- [ ] Wireframes das telas principais
- [ ] Documento ABNT completo (ref. teórico, escopo, modelagem, protótipos, implementação)
- [ ] Código no repositório GitHub
- [ ] Cada aluno postou no Studeo

---

## Riscos e Mitigações

| Risco | Probabilidade | Mitigação |
|-------|--------------|-----------|
| Pedro atrasa o parser | Média | CSV mock desacopla o trabalho. Guilherme pode gerar CSV manualmente se necessário |
| C++ mais difícil que o esperado | Alta | Guilherme tem base de C (ponteiros, memória). Focar no subset necessário, não em C++ "completo" |
| Wireframes incompletos | Baixa | Gabriel é experiente. Pior caso: wireframes simplificados são suficientes |
| Documento ABNT toma mais tempo | Média | Contexto do REGRAS_AEP já tem referencial teórico pronto pra adaptar. Anotações do Claude ajudam |
| Professor não aceita C++ | Baixa | Confirmar na terça (17/03). Se negar: pivotar pra Java/C (impacto alto mas tratável) |

---

## Notas de Gestão (GitHub)

- **Issues por tarefa** — cada linha da tabela vira uma issue com assignee e data
- **Labels sugeridas:** `backend`, `parser`, `frontend`, `docs`, `blocker`
- **Milestone:** "Entrega Parcial — 06/04"
- **Branch strategy:** `main` protegida, cada feature em branch (`feat/lista-encadeada`, `feat/parser-csv`, etc.)