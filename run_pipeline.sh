#!/bin/bash

# Script para orquestrar a execução do parser Python e do backend C++

# Sair imediatamente se um comando falhar
set -e

echo "Iniciando pipeline de processamento do Sentinela Londrina..."

# 1. Executar o parser Python
echo "\n--- Executando o parser Python (ai_scan.py) ---"
python3 src/parser/ai_scan.py

# 2. Compilar e executar o backend C++
echo "\n--- Compilando o backend C++ ---"
make -C src/cpp

echo "\n--- Executando o backend C++ (sentinela.exe) ---"
./sentinela.exe

echo "\nPipeline de processamento concluído com sucesso!"