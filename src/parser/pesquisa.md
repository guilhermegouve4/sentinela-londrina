# Pesquisa: Fonte de Dados e Biblioteca de Extração PDF
**Projeto:** Sentinela Londrina
**Autor:** Gabriel Castro (Responsável pela Task [python])
**Data:** 19 de março de 2026

## 1. Fonte dos Dados

A pesquisa identificou que os boletins epidemiológicos da Prefeitura de Londrina e do Estado do Paraná estão disponíveis publicamente, mas apresentam desafios quanto à padronização e extração automatizada.

### 1.1. Onde ficam os boletins epidemiológicos da prefeitura de Londrina?
Os boletins são publicados em diferentes canais oficiais:
- **Portal da Saúde de Londrina:** A Secretaria Municipal de Saúde (SMS) publica os "Informes Epidemiológicos" em seu portal oficial. Estes documentos contêm dados detalhados sobre Dengue, Zika, Chikungunya e outras doenças [1].
- **Blog da Prefeitura de Londrina:** Notícias e resumos dos boletins são frequentemente publicados no blog oficial, na categoria "Aedes aegypti" ou "Saúde". No entanto, estas publicações geralmente contêm apenas o texto resumido e não o PDF completo [2].
- **Secretaria de Estado da Saúde do Paraná (SESA):** O governo estadual mantém um portal dedicado à Dengue (dengue.pr.gov.br) onde publica boletins semanais que incluem dados de todos os municípios, incluindo Londrina [3].

### 1.2. Os PDFs são públicos e acessíveis via download direto?
Sim, os PDFs são públicos. No entanto, a acessibilidade via download direto automatizado (via script) apresenta obstáculos:
- Os links no portal da SESA utilizam um sistema gerenciador de documentos (`documentador.pr.gov.br`) que gera URLs dinâmicas com tokens (ex: `uuid=@gtf-escriba-sesa@...`).
- Tentativas de download automatizado via `curl` ou bibliotecas Python (como `requests`) podem falhar devido a bloqueios de segurança (erros de SSL/TLS) ou expiração de sessão.
- Os boletins do portal da Saúde de Londrina possuem URLs mais diretas (ex: `https://saude.londrina.pr.gov.br/images/Epidemiologia/DEPIS/Informe_Epidemiológico/2025/Informe_epidemiologico_122005.pdf`), facilitando o download via script.

### 1.3. Qual a URL ou portal?
As principais URLs para monitoramento e extração são:
- **Informes Epidemiológicos (Londrina):** `https://saude.londrina.pr.gov.br/index.php/informes-epidemiologicos.html`
- **Boletins da Dengue (SESA Paraná):** `https://www.dengue.pr.gov.br/Pagina/Boletins-da-Dengue`
- **Notícias e Resumos (Blog Londrina):** `https://blog.londrina.pr.gov.br/?tag=aedes-aegypti`

---

## 2. Biblioteca de Extração

Para avaliar a melhor ferramenta para o parser em Python, foram testadas três das principais bibliotecas de extração de PDF utilizando um boletim real (Informe Epidemiológico Nº 12/2025 de Londrina).

### 2.1. Metodologia de Teste
O teste consistiu em processar um PDF de 10 páginas contendo texto corrido, gráficos de imagem e tabelas estruturadas. Avaliamos o tempo de execução e a capacidade de extrair texto e tabelas.

| Biblioteca | Tempo de Execução (s) | Capacidade de Extração de Texto | Capacidade de Extração de Tabelas |
| :--- | :--- | :--- | :--- |
| **PyMuPDF (fitz)** | 0.02 | Excelente. Muito rápido e preciso para texto corrido. | Baixa. Não possui funções nativas robustas para estruturar tabelas. |
| **pdfminer.six** | 0.26 | Boa. Extrai o texto de forma confiável, mas é mais lento. | Baixa. Retorna apenas texto, exigindo parsing manual complexo. |
| **pdfplumber** | 0.48 | Boa. Extrai texto com precisão. | Excelente. Possui métodos nativos (`extract_tables()`) muito eficientes. |

### 2.2. Análise da Estrutura do Boletim
A análise visual e programática do boletim revelou desafios significativos para a extração de dados sobre arboviroses:
1. **Dados em Formato de Imagem:** O "Panorama da Dengue" (Página 4) apresenta os dados cruciais (Notificados, Confirmados, Descartados) em formato de *dashboard* inserido como uma única imagem no PDF. Nenhuma biblioteca de extração de texto consegue ler esses dados diretamente. Será necessário o uso de OCR (Optical Character Recognition), como o Tesseract, ou a busca por uma fonte de dados em formato CSV/XLSX.
2. **Tabelas Estruturadas:** Dados sobre outras síndromes (ex: Síndrome Gripal) estão em tabelas bem formatadas (Página 6). O `pdfplumber` conseguiu identificar e extrair essas tabelas utilizando a configuração de estratégia de texto (`vertical_strategy="text"`, `horizontal_strategy="text"`).

### 2.3. Conclusão e Recomendação
Para o desenvolvimento do parser do projeto Sentinela Londrina, recomenda-se a seguinte abordagem:

1. **Biblioteca Principal:** Utilizar o **`pdfplumber`** devido à sua capacidade superior de lidar com tabelas estruturadas, o que será essencial caso os boletins futuros apresentem os dados de Dengue em formato tabular.
2. **Desafio do OCR:** Como os dados atuais de Dengue estão em formato de imagem dentro do PDF, a equipe precisará integrar uma solução de OCR (ex: `pytesseract`) ou, preferencialmente, buscar a base de dados bruta (ex: SINAN/DATASUS) que gera esses boletins, pois a extração via OCR é propensa a erros e difícil de manter.
3. **Alternativa de Fonte:** Recomenda-se investigar se a Prefeitura de Londrina disponibiliza esses dados no Portal de Dados Abertos em formato CSV, o que eliminaria a necessidade de um parser de PDF complexo.

---

## Referências

[1] Prefeitura de Londrina. "Informes Epidemiológicos". Secretaria Municipal de Saúde. Disponível em: https://saude.londrina.pr.gov.br/index.php/informes-epidemiologicos.html
[2] Blog Londrina. "Arquivos Aedes aegypti". Prefeitura de Londrina. Disponível em: https://blog.londrina.pr.gov.br/?tag=aedes-aegypti
[3] Governo do Estado do Paraná. "Boletins da Dengue". Secretaria da Saúde. Disponível em: https://www.dengue.pr.gov.br/Pagina/Boletins-da-Dengue
