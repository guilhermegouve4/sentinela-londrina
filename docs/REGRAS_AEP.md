# Regras da AEP — Sentinela Londrina

**Curso:** Tecnologia em Análise e Desenvolvimento de Sistemas (ADS) e Graduação em Engenharia de Software
**Série:** 3ª | **Ano/Período:** 2026.1
**Prazo 1º Bim:** 06/04/2026 | **Prazo 2º Bim:** 08/06/2026
**Título:** Operação Sentinela Londrina: Arquitetura de Software para Monitoramento de Arboviroses via Dados Abertos

---

## Contextualização

A Secretaria Municipal de Saúde de Londrina publica periodicamente o Informe Epidemiológico de Dengue, Zika e Chikungunya. Esses dados são cruciais para a tomada de decisão, mas muitas vezes estão dispersos em textos de notícias e tabelas de boletins informativos.

O desafio dos alunos é desenvolver um sistema que atue como uma camada de inteligência. O software deve ser capaz de receber registros minerados desses boletins (focados em Londrina e seus distritos), organizar essas informações em uma estrutura de memória eficiente e gerar relatórios de vulnerabilidade por região.

> "A escolha de uma estrutura de dados adequada é fundamental para a eficiência de um algoritmo. [...] Estruturas dinâmicas, como as listas encadeadas, permitem que o sistema gerencie a memória de forma flexível, adaptando-se ao volume de dados que cresce conforme novas informações são coletadas." — ZIVIANE, 2011

> "O uso de tecnologias de informação para processar dados de infestações, como o LIRAa, permite a identificação precoce de áreas de risco e a otimização dos recursos públicos no combate ao Aedes aegypti." — TAUIL, 2002

---

## Problemática

A cidade de Londrina enfrenta desafios cíclicos no combate às arboviroses (Dengue, Zika e Chikungunya). Embora a Secretaria Municipal de Saúde disponibilize dados públicos de monitoramento através do LIRAa e de boletins epidemiológicos semanais, essas informações encontram-se, frequentemente, de forma não estruturada ou fragmentada.

O problema central não é a falta de dados, mas a **ausência de uma arquitetura de software mínima** que se utilize das estruturas de dados dinâmicas e princípios de orientação a objetos para minerar, organizar e transformar esses registros dispersos em um panorama situacional fidedigno.

Três obstáculos técnicos que este projeto visa mitigar:

1. **Inconsistência na Estrutura dos Dados** — A variação no volume de notificações por região exige gestão de memória dinâmica. Estruturas estáticas mostram-se ineficientes durante picos epidêmicos.
2. **Dificuldade de Recuperação Cronológica** — Sem organização lógica que relacione localidade ao tempo, torna-se complexo identificar tendências de evolução da doença por bairro.
3. **Abstração Deficiente do Domínio** — A falta de modelagem orientada a objetos resulta em softwares rígidos, dificultando a integração de novas variáveis.

---

## Cenário de Aplicação

### A. Modelagem de Domínio (APOO)

Classes principais:

- **Localidade** — Representa as regiões (Norte, Sul, Leste, Oeste, Centro e Distritos)
- **BoletimSemanal** — Armazena data, casos notificados, confirmados e índice LIRAa
- **AnaliseSituacional** — Aplica regras de negócio (ex: taxa de positividade = Confirmados / Notificados × 100)

A classe `Localidade` pode ter especializações `RegiaoUrbana` e `DistritoRural`, com pesos diferentes para o cálculo de risco epidemiológico (polimorfismo).

### B. Implementação Técnica (Estrutura de Dados)

- **Lista de Regiões** — Cada nó da lista principal é uma `Regiao`
- **Sublista de Registros** — Cada `Regiao` possui um ponteiro para uma sublista de `BoletinsSemanais`
- **Operação Crítica** — Inserção em ordem cronológica, permitindo visualização da evolução da dengue por bairro

### C. Mineração e Ingestão de Dados

Criar um *parser* que leia um arquivo CSV/TXT bruto contendo as métricas de Londrina e instancie os objetos correspondentes, inserindo-os na lista encadeada.

| Disciplina | Entregável Esperado |
|---|---|
| Análise e Projeto | Diagrama de Classes UML detalhando herança e associações |
| Estrutura de Dados | Código-fonte C++ com lista encadeada manual |
| Engenharia de Software | Relatório situacional identificando a região crítica |

---

## Requisitos Mínimos

### 1. Engenharia e POO (Obrigatórios)

- **Modelagem de Domínio** — Mínimo 4 classes principais interconectadas (ex: `Localidade`, `RegistroEpidemiologico`, `AnaliseRisco`, `LeitorDados`)
- **Encapsulamento** — Todos os atributos privados, acesso via getters/setters
- **Herança/Polimorfismo** — Classe base com especializações (ex: `Dengue`, `LIRAa`)
- **Diagramação** — Diagrama de Classes UML atualizado

### 2. Estrutura de Dados (Obrigatórios)

- **Implementação Manual** — Proibido usar `std::list` ou equivalentes
- **Operações obrigatórias:**
  - `inserirOrdenado()` — por data ou gravidade
  - `remover()` — registros duplicados ou incorretos
  - `buscar()` — localizar região específica
- **Gestão de Memória** — Percorrer lista para totais acumulados sem estouro

### 3. Requisitos Funcionais

- **Módulo de Ingestão** — Ler CSV/TXT e popular a lista encadeada
- **Relatório Situacional:**
  - Região com maior índice LIRAa
  - Taxa de crescimento entre último e penúltimo boletim
- **Filtro por Localidade** — Histórico completo de uma região em ordem cronológica

### 4. Fontes de Dados

- **Blog da Prefeitura de Londrina** — `blog.londrina.pr.gov.br` — boletins semanais com notificações, confirmados e óbitos por região
- **SESA Paraná** — `www.dengue.pr.gov.br` — informe epidemiológico semanal para validação
- **Portal de Dados Abertos de Londrina** — seção Transparência → Saúde (UBS por região)

---

## Regras de Entrega

### 1º Bimestre — 06/04/2026

Foco: modelagem e infraestrutura de dados.

**Entregáveis:**
- Diagrama de Classes UML (Região, Boletim, IBGE e relacionamentos)
- Código-fonte funcional da lista encadeada (inserção, busca, remoção)
- Parser capaz de ler CSV/TXT e instanciar objetos na lista
- Documento textual ABNT contemplando:
  - Referencial teórico
  - Descrição do escopo
  - Modelagem de dados
  - Prototipagem em baixo nível
  - Implementação da lista encadeada

### 2º Bimestre — 08/06/2026

- Refatoração com base no feedback dos professores
- Lógica de análise: taxas de incidência, rankings e alertas (LIRAa)
- Interface de saída: relatórios via terminal ou interface simples
- **Pitch de no máximo 5 minutos**

**Entregáveis:** código + interface gráfica, modelagem, scripts, listagem de implementação, regras de negócio e UML finais.

---

## Regras Gerais

- Trabalho em equipe de **4 alunos** (grupo não pode ser modificado após início)
- Trabalho **original** — plágio (internet ou entre equipes) resulta em nota zero
- Toda citação deve ser referenciada
- Cada aluno deve postar **individualmente** no Studeo dentro do prazo
- **Sem prorrogação de prazo** — não são aceitos trabalhos por e-mail

## Critérios Avaliativos

1. Observância às regras da proposta
2. Potencial técnico-científico
3. Aplicabilidade do projeto à temática proposta
4. Criatividade na solução do problema
5. Clareza e objetividade na apresentação dos resultados

---

## Referências

ZIVIANI, Nivio. *Projeto de Algoritmos com implementações em Java e C++*. São Paulo: Cengage Learning, 2011.

TAUIL, Pedro Luis. *Aspectos críticos do controle do dengue no Brasil*. Disponível em: https://www.scielo.br/j/csp/a/c98RZLMkn9MqxgBmHTZTSFD. Acesso em: 12 fev. 2026.

HUANG, Kalley. *ChatGPT força universidades dos EUA a mudar*. Estadão, 29 jan. 2023.
