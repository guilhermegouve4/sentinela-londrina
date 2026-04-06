#include "../include/CSVReader.h"
#include "../include/MonthlyBulletin.h"
#include "../include/Locality.h"
#include "../include/LinkedList.h"
#include "../include/Logger.h"

#include <fstream>
#include <sstream>
#include <vector>
#include <algorithm>
#include <filesystem>

namespace fs = std::filesystem;

void CSVReader::read(LinkedList& list) {
    LOG_INFO("Iniciando leitura dos arquivos CSV.");
    std::string processed_data_path = "data/processed/";

    std::vector<fs::path> csv_files;
    if (!fs::exists(processed_data_path)) {
        LOG_WARNING("Diretório de dados processados não encontrado: " + processed_data_path);
        return;
    }

    for (const auto& entry : fs::directory_iterator(processed_data_path)) {
        if (entry.is_regular_file() && entry.path().extension() == ".csv") {
            csv_files.push_back(entry.path());
        }
    }
    std::sort(csv_files.begin(), csv_files.end());

    if (csv_files.empty()) {
        LOG_WARNING("Nenhum arquivo CSV encontrado em " + processed_data_path);
        return;
    }

    for (const auto& file_path : csv_files) {
        LOG_INFO("Lendo arquivo: " + file_path.string());
        std::ifstream file(file_path);
        if (!file.is_open()) {
            LOG_ERROR("Não foi possível abrir o arquivo CSV: " + file_path.string());
            continue;
        }

        std::string line;
        std::getline(file, line); // Skip header

        while (std::getline(file, line)) {
            if (line.empty()){
                continue;
            }
            std::stringstream ss(line);
            std::string segment;
            std::vector<std::string> tokens;

            // Parse line by comma - CORREÇÃO: usar ',' (char) em vez de "," (string)
            while (std::getline(ss, segment, ',')) {
                tokens.push_back(segment);
            }

            if (tokens.size() < 13) {
                LOG_WARNING("Linha CSV incompleta no arquivo " + file_path.string() + ": " + line + ". Esperado 13 campos, encontrado " + std::to_string(tokens.size()));
                continue;
            }

            std::string region_name = tokens[0];
            
            // Extração do mês do nome do arquivo (YYYY-MM.csv)
            std::string stem = file_path.stem().string();
            std::string month = "00/0000";
            if (stem.length() >= 7) {
                month = stem.substr(5, 2) + "/" + stem.substr(0, 4);
            }

            Locality* locality = list.find(region_name);
            if (locality == nullptr) {
                LOG_WARNING("Região não encontrada na lista: " + region_name + ". Pulando linha do arquivo " + file_path.string());
                continue;
            }

            try {
                MonthlyBulletin* bulletin = new MonthlyBulletin(
                    month,
                    std::stoi(tokens[3]), // notified
                    std::stoi(tokens[4]), // confirmed
                    std::stoi(tokens[5]), // discarded
                    std::stoi(tokens[6]), // under_analysis
                    std::stoi(tokens[7]), // dengue_cases
                    std::stoi(tokens[8]), // dengue_alarm_cases
                    std::stoi(tokens[9]), // dengue_severe_cases
                    std::stoi(tokens[10]), // zika_cases
                    std::stoi(tokens[11]), // chikungunya_cases
                    std::stoi(tokens[12])  // deaths
                );
                locality->addBulletin(bulletin);
                LOG_DEBUG("Boletim adicionado para " + region_name + " em " + month + " do arquivo " + file_path.string());
            } catch (const std::exception& e) {
                LOG_ERROR("Erro ao processar linha no arquivo " + file_path.string() + ", linha: \"" + line + "\". Erro: " + e.what());
            }
        }
        file.close();
    }
    LOG_INFO("Leitura de arquivos CSV concluída.");
}
