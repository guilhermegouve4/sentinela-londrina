# Frontend — Sentinela Londrina

Dashboard em Next.js para visualização de dados epidemiológicos de arboviroses em Londrina.

## Tecnologias

- Next.js 16 + TypeScript
- Tailwind CSS
- Chart.js — gráficos de evolução temporal e distribuição regional
- jsPDF + html2canvas — exportação de relatórios PDF
- Lucide React — ícones

## Como rodar

```bash
cd src/frontend
npm install
npm run dev
```

Acesse `http://localhost:3000`.

## Páginas

| Rota | Descrição |
|------|-----------|
| `/` | Dashboard principal com resumo geral |
| `/filters` | Filtros por região e nível de risco |
| `/evolution` | Gráficos de evolução mensal |
| `/report` | Geração de relatório PDF |
| `/hierarchy` | Hierarquia UBS → Bairro |
| `/history` | Histórico de status por região |
| `/alerts` | Alertas ativos |
| `/bulletins` | Boletins |
| `/ingestion` | Ingestão de dados |

## Dados

O frontend lê `public/result.json`, gerado pelo backend C++.
