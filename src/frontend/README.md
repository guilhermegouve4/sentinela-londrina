# Sentinela Londrina - Frontend

## Visão Geral

Este é o módulo frontend do projeto **Sentinela Londrina**, um sistema de monitoramento de arboviroses (Dengue, Zika, Chikungunya) que utiliza dados abertos da prefeitura de Londrina. O objetivo principal do frontend é fornecer um dashboard visual e interativo para apresentar os dados minerados e analisados pelo backend, permitindo filtros por localidade e visualização de relatórios situacionais.

## Tecnologias Utilizadas

O frontend do Sentinela Londrina é construído com as seguintes tecnologias:

*   **Next.js**: Framework React para construção de aplicações web modernas, com foco em performance e experiência do desenvolvedor.
*   **TypeScript**: Superset do JavaScript que adiciona tipagem estática, melhorando a robustez e manutenibilidade do código.
*   **Tailwind CSS**: Framework CSS utilitário para estilização rápida e responsiva.

## Estrutura do Projeto

A estrutura de pastas do frontend (`src/frontend`) segue a convenção de projetos Next.js:

```
sentinela-londrina/
└── src/
    └── frontend/       # Next.js app
        ├── app/            # Rotas e páginas da aplicação
        ├── components/     # Componentes React reutilizáveis
        ├── lib/            # Funções utilitárias e lógica de negócio do frontend
        ├── public/         # Ativos estáticos (imagens, fontes)
        └── types/          # Definições de tipos TypeScript
        ├── .gitignore
        ├── eslint.config.mjs
        ├── next.config.ts
        ├── package-lock.json
        ├── package.json
        ├── postcss.config.mjs
        └── tsconfig.json
```

## Como Rodar o Projeto (Frontend)

Para configurar e executar o ambiente de desenvolvimento do frontend, siga os passos abaixo:

1.  **Navegue até a pasta do frontend:**
    ```bash
    cd src/frontend
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    # ou
    yarn install
    # ou
    pnpm install
    ```

3.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    # ou
    yarn dev
    # ou
    pnpm dev
    ```

4.  Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.

## Status do Desenvolvimento (Frontend)

O desenvolvimento do frontend está **em andamento**, com foco na implementação do dashboard visual. As principais tarefas e o status atual são:

*   **Wireframes do dashboard:** ✅ Feito
*   **Implementação do dashboard Next.js:** 🔄 Em andamento (Issue #19)
*   **Integração frontend ↔ backend:** ⏳ Pendente (Issue #16)

## Equipe de Desenvolvimento (Frontend)

Os seguintes membros da equipe são responsáveis pelo desenvolvimento do frontend:

*   **Gabriel Castro (gcastrodev)**: Responsável pelo Parser Python e Frontend Next.js.
*   **Alan**: Responsável pelo Frontend Next.js.

## Links Úteis

*   [Documentação do Next.js](https://nextjs.org/docs)
*   [Learn Next.js](https://nextjs.org/learn)
*   [Repositório GitHub do Projeto](https://github.com/guilhermegouve4/sentinela-londrina)
