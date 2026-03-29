# Guia — Diagrama de Classes UML do Projeto

Este guia explica como criar o Diagrama de Classes UML do Sentinela Londrina.
Ele cobre os conceitos necessários e conduz o processo passo a passo usando o Astah.

---

## 1. O que é um Diagrama de Classes?

Um Diagrama de Classes é um mapa visual do sistema. Ele mostra:

- Quais **classes** existem no sistema
- Quais **atributos** (dados) e **métodos** (ações) cada classe tem
- Como as classes se **relacionam** entre si

É um dos diagramas mais importantes da UML (Unified Modeling Language), e é exigido
em projetos de software para documentar a arquitetura antes (ou durante) o desenvolvimento.

---

## 2. Conceitos de Orientação a Objetos que aparecem no diagrama

Antes de desenhar, vale entender o que cada coisa significa no nosso projeto.

### Classe

Uma classe é um molde. Ela define como um objeto vai ser.
No nosso projeto, `Locality` é uma classe — ela descreve o que toda região tem em comum.

```
┌─────────────────┐
│    Locality     │  ← nome da classe
├─────────────────┤
│ - m_name        │  ← atributos (dados que a classe guarda)
├─────────────────┤
│ + getName()     │  ← métodos (ações que a classe sabe fazer)
│ + setName()     │
│ + calculateRisk()│
└─────────────────┘
```

### Atributos e visibilidade

O símbolo antes do nome indica quem pode acessar:

| Símbolo | Significado | Quando usar |
|---------|-------------|-------------|
| `-` | `private` | só a própria classe acessa |
| `+` | `public` | qualquer um acessa |
| `#` | `protected` | a classe e suas filhas acessam |

No nosso projeto, todos os atributos são privados (`-`) e os métodos são públicos (`+`).
O atributo `head` em `Locality` é protegido (`#`) porque as subclasses precisam acessá-lo.

### Classe Abstrata

Uma classe abstrata é uma classe que **não pode ser instanciada diretamente** — ela serve
só como base para outras classes. No diagrama, o nome dela aparece em *itálico*.

No nosso projeto, `Locality` é abstrata porque ela define `calculateRisk()` como método
abstrato (virtual puro em C++). Ninguém cria um objeto `Locality` diretamente — cria-se
um `UrbanRegion` ou um `RuralDistrict`.

### Herança

Herança é quando uma classe **herda** atributos e métodos de outra.
A classe filha recebe tudo da mãe e pode adicionar ou sobrescrever comportamentos.

No diagrama, herança é representada por uma **seta com triângulo vazado** apontando para a classe mãe:

```
UrbanRegion ──────▷ Locality
RuralDistrict ────▷ Locality
```

### Polimorfismo

Polimorfismo é a capacidade de classes diferentes responderem ao mesmo método de formas diferentes.

No nosso projeto, `calculateRisk()` existe em `UrbanRegion` e em `RuralDistrict`, mas cada
uma calcula de forma diferente:

- `UrbanRegion`: `(confirmed / notified) × 100`
- `RuralDistrict`: `(confirmed / notified) × 100 × 1.5` — fator de subnotificação rural

No diagrama, isso aparece como o mesmo método declarado na classe mãe (em itálico, por ser
abstrato) e reimplementado nas filhas.

### Associação e Composição

**Associação** é quando uma classe conhece ou usa outra.
**Composição** é uma associação mais forte — uma classe *contém* a outra, e sem ela não existe.

No nosso projeto:
- `Node` **contém** um ponteiro para `Locality` → composição
- `LinkedList` **contém** um ponteiro para `Node` → composição
- `Locality` **contém** um ponteiro para `MonthlyBulletin` → composição (a sublista de boletins)

No diagrama, composição é representada por uma **linha com losango preenchido** no lado que contém.

---

## 3. As classes do projeto

O projeto tem 6 classes. Aqui está o que cada uma faz e o que ela tem.

### `Locality` — classe abstrata (base)

Representa uma região de Londrina (pode ser urbana ou rural).
Como é abstrata, nunca é usada diretamente.

**Atributos:**
- `- m_name : string` — nome da região (ex: "Norte", "Rural")
- `# head : MonthlyBulletin*` — ponteiro para o boletim mais recente (início da sublista)

**Métodos:**
- `+ getName() : string`
- `+ setName(name : string) : void`
- `+ calculateRisk() : double` — *abstrato* (cada subclasse implementa do seu jeito)
- `+ isUrban() : bool` — *abstrato*

---

### `UrbanRegion` — herda de `Locality`

Representa as regiões urbanas: Norte, Sul, Leste, Oeste, Central.

**Atributos:** nenhum além dos herdados

**Métodos:**
- `+ UrbanRegion(name : string)` — construtor
- `+ calculateRisk() : double` — fórmula: `(confirmed / notified) × 100`
- `+ isUrban() : bool` — retorna `true`

---

### `RuralDistrict` — herda de `Locality`

Representa a zona rural. O nome é sempre "Rural".

**Atributos:** nenhum além dos herdados

**Métodos:**
- `+ RuralDistrict()` — construtor (sem parâmetro, nome fixo "Rural")
- `+ calculateRisk() : double` — fórmula: `(confirmed / notified) × 100 × 1.5`
- `+ isUrban() : bool` — retorna `false`

---

### `MonthlyBulletin` — boletim mensal de uma região

Armazena os dados epidemiológicos de uma região em um mês específico.
Cada região tem uma sublista encadeada de boletins — o `head` aponta para o mais recente.

**Atributos:**
- `- m_month : string` — ex: "01/2025"
- `- m_notified : int` — casos notificados
- `- m_confirmed : int` — casos confirmados
- `- m_discarded : int` — casos descartados
- `- m_underAnalysis : int` — em análise
- `- m_dengueCases : int`
- `- m_dengueAlarmCases : int`
- `- m_dengueSevereCases : int`
- `- m_zikaCases : int`
- `- m_chikungunyaCases : int`
- `- m_deaths : int`
- `+ next : MonthlyBulletin*` — ponteiro pro próximo boletim na sublista

**Métodos:** getters para cada atributo (`getMonth()`, `getConfirmed()`, etc.)

---

### `Node` — nó da lista principal

Cada nó guarda uma região (`Locality*`) e aponta para o próximo nó.

**Atributos:**
- `+ data : Locality*` — ponteiro para a região
- `+ next : Node*` — ponteiro para o próximo nó

**Métodos:**
- `+ Node(locality : Locality*)` — construtor

---

### `LinkedList` — lista encadeada de regiões

A estrutura principal do sistema. Guarda todas as regiões em ordem alfabética.

**Atributos:**
- `- head : Node*` — ponteiro para o primeiro nó

**Métodos:**
- `+ LinkedList()` — construtor
- `+ insertOrdered(locality : Locality*) : void` — insere em ordem alfabética
- `+ find(name : string) : Locality*` — busca uma região pelo nome
- `+ remove(name : string) : void` — remove uma região

---

## 4. Como criar o diagrama no Astah

### Instalação

Se ainda não tiver o Astah instalado:
1. Acessa [astah.net](https://astah.net/products/astah-community/)
2. Baixa o **Astah Community** (gratuito)
3. Instala normalmente

### Criando o projeto

1. Abre o Astah
2. **File → New Project**
3. Salva como `sentinela-londrina.asta` dentro de `docs/uml/`

### Criando o diagrama

1. No painel esquerdo, clica com botão direito no projeto → **Add Diagram → Class Diagram**
2. Nomeia como `Diagrama de Classes — Sentinela Londrina`

### Adicionando as classes

Para cada classe:

1. Na barra de ferramentas, seleciona **Class**
2. Clica na área do diagrama para posicionar
3. Digita o nome da classe
4. Para adicionar atributos: clica com botão direito na classe → **Add → Attribute**
5. Para adicionar métodos: clica com botão direito na classe → **Add → Operation**

**Para marcar `Locality` como abstrata:**
- Clica com botão direito na classe → **Properties**
- Marca a opção **Abstract**
- O nome vai aparecer em itálico automaticamente

**Para marcar um método como abstrato:**
- Clica com botão direito no método → **Properties**
- Marca **Abstract**

### Adicionando herança

1. Na barra de ferramentas, seleciona **Generalization** (seta com triângulo vazado)
2. Clica na classe filha (`UrbanRegion`) e arrasta até a classe mãe (`Locality`)
3. Repete para `RuralDistrict → Locality`

### Adicionando composição

1. Na barra de ferramentas, seleciona **Composition** (linha com losango preenchido)
2. Para `LinkedList → Node`: clica em `LinkedList` e arrasta até `Node`
3. Para `Node → Locality`: clica em `Node` e arrasta até `Locality`
4. Para `Locality → MonthlyBulletin`: clica em `Locality` e arrasta até `MonthlyBulletin`

### Adicionando multiplicidade

A multiplicidade indica quantos objetos participam da relação. Clica na linha de composição
e adiciona nas pontas:

- `LinkedList` → `Node`: `1` para `0..*` (uma lista tem zero ou mais nós)
- `Node` → `Locality`: `1` para `1` (cada nó tem exatamente uma região)
- `Locality` → `MonthlyBulletin`: `1` para `0..*` (cada região tem zero ou mais boletins)

### Exportando a imagem

1. **File → Export → Image**
2. Salva como `diagrama-classes.png` dentro de `docs/uml/`

---

## 5. Como deve ficar no final

A estrutura visual esperada:

```
                    ┌──────────────────┐
                    │   «abstract»     │
                    │    Locality      │
                    └────────┬─────────┘
                             │
               ──────────────┴──────────────
               │                           │
    ┌──────────┴──────────┐     ┌──────────┴──────────┐
    │    UrbanRegion      │     │    RuralDistrict     │
    └─────────────────────┘     └─────────────────────┘

    ┌───────────────┐            ┌──────────────────────┐
    │  LinkedList   │◆──────────▶│        Node          │◆──────────▶ Locality
    └───────────────┘  0..*      └──────────────────────┘  1

    Locality ◆──────────▶ MonthlyBulletin
               0..*
```

---

## 6. Checklist antes de entregar

- [ ] `Locality` está em itálico (abstrata)
- [ ] `calculateRisk()` está em itálico em `Locality` (método abstrato)
- [ ] Herança: `UrbanRegion` e `RuralDistrict` apontam para `Locality`
- [ ] Composição: `LinkedList → Node → Locality`
- [ ] Composição: `Locality → MonthlyBulletin`
- [ ] Todos os atributos com visibilidade (`-`, `+`, `#`)
- [ ] Multiplicidades nas composições
- [ ] Arquivo exportado como `diagrama-classes.png` em `docs/uml/`
