#!/bin/bash

# Script para orquestrar a execução do parser Python e do backend C++
# Sair imediatamente se um comando falhar (exceto verificações controladas)
set -e

echo "Iniciando pipeline de processamento do Sentinela Londrina..."

# 1. Executar o parser Python
echo -e "\n--- Executando o parser Python (ai_scan.py) ---"
# Verificamos se existem PDFs antes de rodar, para evitar erro no GitHub Actions
if ls data/raw/*.pdf 1> /dev/null 2>&1; then
    python3 src/parser/ai_scan.py
else
    echo "Aviso: Nenhum PDF encontrado em data/raw/. Pulando extração."
fi

# 2. Compilar o backend C++
echo -e "\n--- Compilando o backend C++ ---"
# O Makefile está na raiz, então rodamos o make direto
make clean
make

# 3. Executar o backend C++
echo -e "\n--- Executando o backend C++ (sentinela.exe) ---"
# Verificamos se existem CSVs processados antes de rodar o backend
if ls data/processed/*.csv 1> /dev/null 2>&1; then
    ./sentinela.exe
else
    echo "Aviso: Nenhum CSV encontrado em data/processed/. O backend não gerará novo JSON."
fi

echo -e "\nPipeline de processamento concluído!"
