#include "../include/LinkedList.h"
#include "../include/UrbanRegion.h"
#include "../include/RuralDistrict.h"
#include "../include/CSVReader.h"
#include "../include/JSONWriter.h"
#include "../include/Logger.h"

static const std::string OUTPUT_PATH = "src/frontend/public/result.json";

int main() {
    Logger::getInstance().setLogLevel(INFO);
    LOG_INFO("Iniciando o processamento do backend Sentinela Londrina.");

    LinkedList list;

    list.insertOrdered(new UrbanRegion("Norte"));
    list.insertOrdered(new UrbanRegion("Sul"));
    list.insertOrdered(new UrbanRegion("Leste"));
    list.insertOrdered(new UrbanRegion("Oeste"));
    list.insertOrdered(new UrbanRegion("Central"));
    list.insertOrdered(new RuralDistrict());
    LOG_INFO("Regiões inicializadas na lista encadeada.");

    CSVReader reader;
    reader.read(list);

    JSONWriter writer;
    writer.write(list, OUTPUT_PATH);
    LOG_INFO("Dados processados e JSON gravado em " + OUTPUT_PATH);

    LOG_INFO("Processamento do backend concluído com sucesso.");
    return 0;
}