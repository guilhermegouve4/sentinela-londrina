# Contrato de Campos do arquivo CSV

Este contrato tem como objetivo definir e documentar o formato CSV que serve de interface entre o parser Python e o backend C++.

## Colunas definidas:
```
region,type,week,notified,confirmed,discarded,under_analysis,dengue_cases,dengue_alarm_cases,dengue_severe_cases,zika_cases,chikungunya_cases,deaths
```

**Descrição dos campos:**
- region (string): nome da região — "Norte", "Sul", "Leste", "Oeste", "Central", "Rural"
- type (string): "urban" ou "rural"
- week (string): semana epidemiológica — ex: "01/2026"
- notified (int)
- confirmed (int)
- discarded (int)
- under_analysis (int)
- dengue_cases (int)
- dengue_alarm_cases (int)
- dengue_severe_cases (int)
- zika_cases (int)
- chikungunya_cases (int)
- deaths (int)

## Exemplo:
```
Norte,urban,01/2026,120,85,30,5,70,10,2,3,1,0
```