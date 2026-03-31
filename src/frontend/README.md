# Sentinela Londrina - Frontend

## 📊 Visão Geral

Este é o módulo frontend do projeto **Sentinela Londrina**, um sistema completo de monitoramento de arboviroses (Dengue, Zika, Chikungunya) que utiliza dados abertos da prefeitura de Londrina. O frontend fornece um dashboard moderno e interativo para visualização de dados epidemiológicos, com filtros avançados, gráficos em tempo real e geração de relatórios PDF.

## ✨ Funcionalidades Implementadas

### 🎯 **Dashboard Completo**
- **Página Inicial**: Visão geral com métricas principais e cards de resumo
- **Filtros Avançados**: Busca em tempo real por região, nível de risco e período
- **Evolução Temporal**: Gráficos interativos mostrando tendência mensal de casos
- **Relatórios**: Documentos oficiais com exportação PDF profissional
- **Hierarquia**: Visualização da estrutura administrativa municipal

### 📈 **Visualizações de Dados**
- **Gráficos Chart.js**: Linha para evolução temporal, barras para distribuição regional
- **Cards de Resumo**: Métricas principais com indicadores visuais
- **Tabelas Interativas**: Dados tabulares com filtros e ordenação
- **Indicadores de Status**: Cores dinâmicas (verde/normal, amarelo/alerta, vermelho/crítico)

### 🛠️ **Recursos Técnicos**
- **Type Safety**: TypeScript completo, sem uso de `any`
- **Componentes Reutilizáveis**: LoadingSpinner, ErrorMessage, SummaryCard
- **Data Layer**: Cache inteligente com validação de dados
- **Responsividade**: Interface adaptável para desktop e mobile
- **Performance**: Otimização com useMemo e lazy loading

## 🚀 Tecnologias Utilizadas

- **Next.js 16.1.7**: Framework React com App Router e Turbopack
- **TypeScript**: Tipagem estática completa
- **Tailwind CSS**: Estilização utilitária e responsiva
- **Chart.js + react-chartjs-2**: Gráficos interativos
- **jsPDF + html2canvas**: Geração de PDFs
- **Lucide React**: Ícones consistentes
- **ESLint**: Linting e formatação de código

## 📁 Estrutura do Projeto

```
src/frontend/
├── app/                    # Páginas Next.js (App Router)
│   ├── page.tsx           # Dashboard principal
│   ├── filters/           # Filtros avançados
│   ├── evolution/         # Gráficos de evolução
│   ├── report/            # Relatórios PDF
│   └── ...
├── components/            # Componentes React reutilizáveis
│   ├── LoadingSpinner.tsx
│   ├── ErrorMessage.tsx
│   └── SummaryCard.tsx
├── lib/                   # Utilitários e lógica de negócio
│   └── data.ts           # Data layer com cache
├── types/                 # Definições TypeScript
│   └── result.ts         # Interfaces dos dados
└── public/               # Assets estáticos
    └── result.json       # Dados mock (substituído pelo backend)
```

## 🏃‍♂️ Como Rodar o Projeto

### 📋 Pré-requisitos
- **Node.js**: Versão 18.0 ou superior
- **npm/yarn/pnpm**: Gerenciador de pacotes

### 🚀 Instalação e Execução

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/guilhermegouve4/sentinela-londrina.git
   cd sentinela-londrina
   ```

2. **Navegue para o diretório do frontend:**
   ```bash
   cd src/frontend
   ```

3. **Instale as dependências:**
   ```bash
   npm install
   # ou
   yarn install
   # ou
   pnpm install
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   # ou
   yarn dev
   # ou
   pnpm dev
   ```

5. **Acesse a aplicação:**
   - Abra [http://localhost:3000](http://localhost:3000) no navegador
   - O servidor terá hot-reload automático

### 🏗️ Build para Produção

```bash
# Build otimizado para produção
npm run build

# Iniciar servidor de produção
npm start
```

### 🧪 Desenvolvimento

```bash
# Verificar linting
npm run lint

# Build de desenvolvimento
npm run build
```

## 🔧 Configuração de Desenvolvimento

### 📊 Dados Mock
Atualmente o frontend utiliza dados mock do arquivo `public/result.json`. Quando o backend C++ estiver pronto, este arquivo será substituído automaticamente pelos dados reais gerados pelo parser.

### 🎨 Personalização
- **Cores**: Tema vermelho para alertas epidemiológicos
- **Tipografia**: Sistema nativo para melhor performance
- **Ícones**: Lucide React para consistência visual

## 📈 Status do Desenvolvimento

### ✅ **Implementado**
- [x] Dashboard responsivo com Next.js 16
- [x] Filtros funcionais em tempo real
- [x] Gráficos Chart.js (linha e barras)
- [x] Exportação PDF profissional
- [x] Type safety completo
- [x] Componentes reutilizáveis
- [x] Data layer com cache
- [x] Interface responsiva

### 🔄 **Integração Pendente**
- [ ] Conexão com backend C++ (Issue #16)
- [ ] Deploy em produção
- [ ] Testes automatizados

## 👥 Equipe de Desenvolvimento

- **Gabriel Castro (gcastrodev)**: Desenvolvimento frontend, parser Python e integração de sistemas
- **Guilherme Gouvea**: Desenvolvimento backend C++ e arquitetura do sistema
- **Alan**: Desenvolvimento frontend e interface do usuário

## 📚 Links Úteis

- [Documentação Next.js](https://nextjs.org/docs)
- [Chart.js Documentation](https://www.chartjs.org/docs/latest/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Repositório GitHub](https://github.com/guilhermegouve4/sentinela-londrina)
- [Documentação do Projeto](../../docs/)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](../../LICENSE) para mais detalhes.
