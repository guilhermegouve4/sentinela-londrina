#!/bin/bash
# Roda na raiz do repo clonado: bash setup-estrutura.sh

# Pastas de código
mkdir -p src/cpp
mkdir -p src/parser
mkdir -p src/frontend

# Pastas de dados
mkdir -p data/raw
mkdir -p data/mock
mkdir -p data/processed

# Pastas de documentação
mkdir -p docs/documento-abnt

# .gitkeep para o Git rastrear pastas vazias
touch src/cpp/.gitkeep
touch src/parser/.gitkeep
touch src/frontend/.gitkeep
touch data/raw/.gitkeep
touch data/mock/.gitkeep
touch data/processed/.gitkeep
touch docs/documento-abnt/.gitkeep

echo "Estrutura criada com sucesso!"