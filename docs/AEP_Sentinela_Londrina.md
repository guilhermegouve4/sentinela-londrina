# OPERAÇÃO SENTINELA LONDRINA
## Arquitetura de Software para Monitoramento de Arboviroses via Dados Abertos

**CST em Análise e Desenvolvimento de Sistemas — Unicesumar**

Alan Rossini Paulino
Gabriel Damião de Castro
Guilherme Augusto Gouvea
Pedro Lucas Cabral dos Santos

Londrina, 2026

---

> Primeira Etapa de Atividade de Estudo Programado, apresentada ao Curso de Análise e Desenvolvimento de Sistemas para obtenção parcial de nota semestral.

---

## SUMÁRIO

1. [Introdução](#1-introdução)
   - 1.1 [Objetivos](#11-objetivos)
   - 1.2 [Proposta e Justificativa](#12-proposta-e-justificativa)
2. [Fundamentação Teórica](#2-fundamentação-teórica)
3. [Desenvolvimento do Sistema](#3-desenvolvimento-do-sistema)
   - 3.1 [Ambiente](#31-ambiente)
   - 3.2 [Recursos a Serem Utilizados](#32-recursos-a-serem-utilizados)
   - 3.3 [Diagramas](#33-diagramas)
     - 3.3.1 [Diagrama de Caso de Uso](#331-diagrama-de-caso-de-uso)
     - 3.3.2 [Especificação dos Casos de Uso](#332-especificação-dos-casos-de-uso)
     - 3.3.3 [Diagrama de Classes](#333-diagrama-de-classes)
   - 3.4 [Protótipos](#34-protótipos)
4. [Considerações Finais](#4-considerações-finais)
5. [Referências](#5-referências)

---

## 1. INTRODUÇÃO

> *TODO: Contextualizar a proposta — como chegamos a este sistema e o que o leitor encontrará ao continuar lendo.*

### 1.1 Objetivos

> *TODO: Definir o objetivo geral e os objetivos específicos do sistema.*

### 1.2 Proposta e Justificativa

> *TODO: Descrever o sistema (proposta) e sua importância (justificativa), incluindo o que o sistema irá e o que NÃO irá contemplar.*

---

## 2. FUNDAMENTAÇÃO TEÓRICA

> *TODO: Apresentar os elementos teóricos que nortearam a proposta.*

---

## 3. DESENVOLVIMENTO DO SISTEMA

### 3.1 Ambiente

> *TODO: Descrever o ambiente de desenvolvimento e implementação.*

### 3.2 Recursos a Serem Utilizados

> *TODO: Descrever metodologia, padrões e ferramental utilizado.*

#### Requisitos Funcionais

| ID | Descrição do Requisito | Prioridade | Status |
|----|------------------------|------------|--------|
| RF-01 | O sistema deve ler arquivos CSV contendo dados minerados dos boletins epidemiológicos da Prefeitura de Londrina e popular a lista encadeada. | Alta | Pendente |
| RF-02 | O sistema deve organizar os registros em uma Lista Encadeada dinâmica, onde cada nó da lista principal representa uma Região e cada região possui uma sublista encadeada de Boletins Mensais. | Alta | Pendente |
| RF-03 | O sistema deve permitir inserção ordenada de boletins via método `insertOrdered()`. | Alta | Pendente |
| RF-04 | O sistema deve permitir a remoção de registros duplicados ou incorretos via método `remove()`. | Alta | Pendente |
| RF-05 | O sistema deve permitir a busca de uma região específica via método `find()`. | Alta | Pendente |
| RF-06 | O sistema deve gerar um relatório situacional que aponte a região com maior risco epidemiológico. | Alta | Pendente |
| RF-07 | O sistema deve calcular a taxa de positividade por região: (Casos Confirmados / Notificados) × 100. | Alta | Pendente |
| RF-08 | O sistema deve calcular a taxa de crescimento de casos entre o último e o penúltimo boletim mensal. | Média | Pendente |
| RF-09 | O sistema deve gerar um ranking de regiões ordenado pelo índice de risco, identificando áreas de maior vulnerabilidade. | Média | Pendente |
| RF-10 | O sistema deve emitir alertas críticos quando o índice de risco de uma região ultrapassar o limiar epidemiológico. | Média | Pendente |
| RF-11 | O sistema deve permitir filtrar e visualizar o histórico completo de uma região específica em ordem cronológica. | Alta | Pendente |
| RF-12 | O módulo de extração (Python) deve minerar texto dos boletins publicados no portal da prefeitura, gerando arquivos CSV estruturados. | Alta | Pendente |
| RF-13 | O frontend (Next.js) deve exibir os dados em dashboard com visualizações gráficas dos índices por região. | Média | Pendente |
| RF-14 | O sistema deve diferenciar o cálculo de risco epidemiológico entre Regiões Urbanas e Distritos Rurais (polimorfismo). | Média | Pendente |

**Legenda de Prioridade:** Alta / Média / Baixa

#### Requisitos Não Funcionais

| ID | Descrição do Requisito | Prioridade | Status |
|----|------------------------|------------|--------|
| RNF-01 | O sistema deve suportar crescimento imprevisível de registros durante picos epidêmicos, utilizando alocação dinâmica de memória (listas encadeadas). | Alta | Pendente |
| RNF-02 | A Lista Encadeada deve ser implementada manualmente em C++, sem uso de `std::list` ou equivalentes. | Alta | Pendente |
| RNF-03 | Todos os atributos de dados das classes devem ser privados, com acesso exclusivo via getters e setters. | Alta | Pendente |
| RNF-04 | O backend deve ser desenvolvido em C++ para manipulação direta de ponteiros e memória. | Alta | Pendente |
| RNF-05 | O frontend deve ser desenvolvido em React/Next.js, proporcionando uma interface web responsiva. | Alta | Pendente |
| RNF-06 | A ferramenta de extração e mineração de dados dos boletins deve ser desenvolvida em Python. | Alta | Pendente |
| RNF-07 | O sistema deve percorrer a lista encadeada para gerar totais acumulados com eficiência O(n). | Média | Pendente |
| RNF-08 | O código deve seguir os princípios de POO: encapsulamento, herança, polimorfismo e abstração. | Alta | Pendente |
| RNF-09 | O sistema deve conter no mínimo quatro classes principais interconectadas. | Alta | Pendente |
| RNF-10 | A documentação do projeto deve seguir as normas ABNT. | Média | Pendente |

**Legenda de Prioridade:** Alta / Média / Baixa

### 3.3 Diagramas

#### 3.3.1 Diagrama de Caso de Uso

> *O diagrama de caso de uso representa as interações entre os atores externos e o sistema, evidenciando as funcionalidades disponíveis sob a perspectiva do usuário.*

`[Inserir diagrama de caso de uso]`

**Fonte:** Elaboração própria (2026).

**Descrição dos Atores:**

- **Usuário (Agente de Saúde)** — Profissional da vigilância epidemiológica que interage com o sistema para importar dados, consultar históricos por localidade, gerar relatórios situacionais, visualizar rankings e remover registros incorretos.
- **Módulo Extrator (Python)** — Componente automatizado responsável pela mineração de texto dos boletins epidemiológicos publicados no portal da prefeitura, transformando dados não estruturados em arquivos CSV para ingestão pelo sistema.

#### 3.3.2 Especificação dos Casos de Uso

**UC-01 — Importar Dados (CSV)**

| Campo | Conteúdo |
|---|---|
| **Identificador** | UC-01 |
| **Nome** | Importar Dados (CSV) |
| **Ator(es)** | Usuário (Agente de Saúde) |
| **Descrição** | O usuário carrega um arquivo CSV contendo dados minerados dos boletins epidemiológicos. O sistema lê, valida e insere os registros na lista encadeada. |
| **Pré-condições** | Arquivo CSV disponível no sistema de arquivos. |
| **Pós-condições** | Dados inseridos na lista encadeada. |
| **Fluxo Principal** | 1. O usuário seleciona o arquivo CSV. <br>2. O sistema aciona o `CSVReader` para parsear o arquivo. <br>3. Para cada linha, o sistema instancia um `MonthlyBulletin`. <br>4. O sistema insere cada boletim na sublista da região correspondente via `insertOrdered()`. <br>5. O sistema exibe confirmação com total de registros importados. |
| **Fluxo Alternativo** | A1. Arquivo com formato inválido: o sistema exibe mensagem de erro e aborta a importação. |
| **Fluxo de Exceção** | E1. Arquivo não encontrado: o sistema exibe erro de arquivo inexistente. |
| **Regras de Negócio** | O arquivo deve conter as colunas definidas no contrato CSV (`docs/contrato-csv.md`). |
| **Requisitos Associados** | RF-01, RF-02, RF-03 |

---

**UC-02 — Extrair Dados de Boletins**

| Campo | Conteúdo |
|---|---|
| **Identificador** | UC-02 |
| **Nome** | Extrair Dados de Boletins |
| **Ator(es)** | Módulo Extrator (Python) |
| **Descrição** | O módulo Python realiza a mineração de texto dos boletins epidemiológicos publicados no portal da prefeitura, extraindo dados estruturados e gerando arquivos CSV. |
| **Pré-condições** | Boletins epidemiológicos disponíveis no portal da prefeitura de Londrina. |
| **Pós-condições** | Arquivo CSV estruturado gerado em `data/processed/`. |
| **Fluxo Principal** | 1. O módulo acessa o boletim epidemiológico (PDF). <br>2. O parser envia o documento à Gemini API. <br>3. Os dados são extraídos e normalizados para o formato do contrato CSV. <br>4. O arquivo CSV é salvo em `data/processed/`. |
| **Fluxo Alternativo** | A1. Formato do boletim alterado: o parser não consegue identificar as seções e gera log de erro. |
| **Fluxo de Exceção** | E1. Boletim inacessível: o módulo registra erro de acesso. |
| **Regras de Negócio** | A extração deve manter rastreabilidade da fonte (data e origem do boletim). |
| **Requisitos Associados** | RF-12 |

---

**UC-03 — Consultar Histórico por Localidade**

| Campo | Conteúdo |
|---|---|
| **Identificador** | UC-03 |
| **Nome** | Consultar Histórico por Localidade |
| **Ator(es)** | Usuário (Agente de Saúde) |
| **Descrição** | O usuário busca o histórico completo de uma região específica, visualizando os boletins em ordem cronológica. |
| **Pré-condições** | Lista encadeada populada com pelo menos um registro. |
| **Pós-condições** | Histórico da região exibido em ordem cronológica. |
| **Fluxo Principal** | 1. O usuário informa o nome da região. <br>2. O sistema percorre a lista de regiões via `find()`. <br>3. O sistema retorna a sublista de boletins mensais da região. <br>4. Os boletins são exibidos em ordem cronológica na interface. |
| **Fluxo Alternativo** | A1. Região não encontrada: o sistema informa que não há registros para a localidade. |
| **Fluxo de Exceção** | — |
| **Regras de Negócio** | A busca deve percorrer a lista encadeada sem indexação direta. |
| **Requisitos Associados** | RF-05, RF-11 |

---

**UC-04 — Gerar Relatório Situacional**

| Campo | Conteúdo |
|---|---|
| **Identificador** | UC-04 |
| **Nome** | Gerar Relatório Situacional |
| **Ator(es)** | Usuário (Agente de Saúde) |
| **Descrição** | O sistema gera um relatório consolidado com a análise situacional de todas as regiões, incluindo taxa de positividade, crescimento e ranking de risco. |
| **Pré-condições** | Lista encadeada populada com boletins de pelo menos dois meses. |
| **Pós-condições** | Relatório gerado e exibido. |
| **Fluxo Principal** | 1. O usuário solicita a geração do relatório. <br>2. O sistema percorre todas as regiões calculando a taxa de positividade. <br>3. O sistema gera o ranking por índice de risco. <br>4. O sistema calcula a taxa de crescimento entre os dois últimos boletins. <br>5. O relatório é formatado e exibido no dashboard. |
| **Fluxo Alternativo** | A1. Dados insuficientes: o sistema alerta que são necessários ao menos dois boletins por região para calcular crescimento. |
| **Fluxo de Exceção** | — |
| **Regras de Negócio** | Taxa de positividade = (Confirmados / Notificados) × 100. Inclui UC-05, UC-06 e pode disparar UC-08. |
| **Requisitos Associados** | RF-06, RF-07, RF-08, RF-09, RF-10 |

---

**UC-05 — Calcular Taxa de Positividade**

| Campo | Conteúdo |
|---|---|
| **Identificador** | UC-05 |
| **Nome** | Calcular Taxa de Positividade |
| **Ator(es)** | Sistema (interno, incluído por UC-04) |
| **Descrição** | O sistema calcula automaticamente a taxa de positividade de cada região com base nos dados do último boletim mensal. |
| **Pré-condições** | Boletim com campos `notified` e `confirmed` preenchidos. |
| **Pós-condições** | Taxa de positividade calculada e disponível para o relatório. |
| **Fluxo Principal** | 1. O sistema obtém `confirmed` e `notified` do boletim mais recente. <br>2. O sistema aplica: `(confirmed / notified) × 100`. <br>3. O resultado é armazenado na análise situacional. |
| **Fluxo Alternativo** | A1. `notified` igual a zero: o sistema registra taxa como 0% e adiciona aviso. |
| **Fluxo de Exceção** | — |
| **Regras de Negócio** | Divisão por zero deve ser tratada. Para `RuralDistrict`, aplica fator de subnotificação × 1.5. |
| **Requisitos Associados** | RF-07, RF-14 |

---

**UC-06 — Visualizar Ranking de Regiões**

| Campo | Conteúdo |
|---|---|
| **Identificador** | UC-06 |
| **Nome** | Visualizar Ranking de Regiões |
| **Ator(es)** | Usuário (Agente de Saúde) |
| **Descrição** | O sistema exibe um ranking das regiões ordenado pelo índice de risco, permitindo identificar rapidamente as áreas de maior vulnerabilidade. |
| **Pré-condições** | Lista encadeada populada com boletins. |
| **Pós-condições** | Ranking exibido em ordem decrescente de risco. |
| **Fluxo Principal** | 1. O sistema percorre a lista de regiões coletando o risco calculado de cada uma. <br>2. O sistema ordena as regiões por índice decrescente. <br>3. O ranking é exibido com destaque para regiões acima do limiar crítico. |
| **Fluxo Alternativo** | A1. Todas as regiões abaixo do limiar: ranking exibido sem destaques de alerta. |
| **Fluxo de Exceção** | — |
| **Regras de Negócio** | LIRAa > 3.9 = situação de risco. LIRAa entre 1.0 e 3.9 = alerta. LIRAa < 1.0 = satisfatório. |
| **Requisitos Associados** | RF-06, RF-09 |

---

**UC-07 — Remover Registros Duplicados**

| Campo | Conteúdo |
|---|---|
| **Identificador** | UC-07 |
| **Nome** | Remover Registros Duplicados |
| **Ator(es)** | Usuário (Agente de Saúde) |
| **Descrição** | O usuário identifica e remove registros duplicados ou incorretos da lista encadeada. |
| **Pré-condições** | Lista encadeada populada com registros. |
| **Pós-condições** | Registros removidos e memória liberada. |
| **Fluxo Principal** | 1. O usuário seleciona a região e o boletim a ser removido. <br>2. O sistema localiza o nó correspondente via `find()`. <br>3. O sistema executa `remove()` atualizando os ponteiros da lista. <br>4. O sistema confirma a remoção. |
| **Fluxo Alternativo** | A1. Registro não encontrado: o sistema informa que o registro não existe. |
| **Fluxo de Exceção** | — |
| **Regras de Negócio** | A memória alocada para o nó removido deve ser liberada (`delete`). |
| **Requisitos Associados** | RF-04 |

---

**UC-08 — Gerar Alertas Críticos**

| Campo | Conteúdo |
|---|---|
| **Identificador** | UC-08 |
| **Nome** | Gerar Alertas Críticos |
| **Ator(es)** | Sistema (interno, estendido por UC-04) |
| **Descrição** | O sistema emite alertas automáticos quando indicadores epidemiológicos ultrapassam limiares definidos. |
| **Pré-condições** | Relatório situacional sendo gerado com dados de risco. |
| **Pós-condições** | Alertas emitidos e exibidos na interface. |
| **Fluxo Principal** | 1. Durante a geração do relatório, o sistema verifica o índice de risco de cada região. <br>2. Se LIRAa > 3.9, gera alerta de situação de risco. <br>3. Se taxa de crescimento > 50%, gera alerta de surto. <br>4. Alertas são exibidos em destaque no dashboard. |
| **Fluxo Alternativo** | A1. Nenhuma região em situação crítica: nenhum alerta é gerado. |
| **Fluxo de Exceção** | — |
| **Regras de Negócio** | Limiares baseados nos parâmetros da vigilância epidemiológica (TAUIL, 2002). |
| **Requisitos Associados** | RF-10 |

#### 3.3.3 Diagrama de Classes

> *O diagrama de classes representa a estrutura estática do sistema, modelando as classes, seus atributos, métodos e os relacionamentos entre elas (herança, associação, composição).*

`[Inserir diagrama de classes UML]`

**Fonte:** Elaboração própria (2026).

### 3.4 Protótipos

> *TODO: Inserir wireframes do dashboard (ver `docs/wireframes/`).*

---

## 4. CONSIDERAÇÕES FINAIS

> *TODO: Apresentar o alcance dos objetivos propostos até o momento.*

---

## 5. REFERÊNCIAS

BOOCH, Grady; RUMBAUGH, James; JACOBSON, Ivar. **UML**: guia do usuário. 2. ed. Rio de Janeiro: Campus, 2006.

FOWLER, Martin. **UML essencial**. 3. ed. Porto Alegre: Bookman, 2005.

PRESSMAN, Roger S. **Engenharia de software**. São Paulo: Makron Books, 1995.

SOMMERVILLE, Ian. **Engenharia de software**. 6. ed. São Paulo: Addison-Wesley, 2003.

TAUIL, Pedro Luis. Aspectos críticos do controle do dengue no Brasil. Disponível em: https://www.scielo.br/j/csp/a/c98RZLMkn9MqxgBmHTZTSFD. Acesso em: 12 fev. 2026.

ZIVIANI, Nivio. **Projeto de Algoritmos com implementações em Java e C++**. São Paulo: Cengage Learning, 2011.
