#include "../include/JSONWriter.h"
#include "../include/LinkedList.h"
#include "../include/Node.h"
#include "../include/Locality.h"
#include "../include/MonthlyBulletin.h"
#include "../include/SituationalAnalysis.h"
#include "../include/Logger.h"

#include <fstream>
#include <iomanip>
#include <cmath>

void JSONWriter::write(LinkedList &list, const std::string &outputPath) {
    LOG_INFO("Iniciando escrita do JSON para " + outputPath);
    SituationalAnalysis sa;
    HighestRiskRegion hr = sa.highestRisk(list);

    std::ofstream file(outputPath);
    if (!file.is_open()) {
        LOG_ERROR("Não foi possível abrir o arquivo de saída JSON: " + outputPath);
        return;
    }

    file << "{\n";

    file << "  \"highest_risk\": {\n";
    file << "    \"name\": \"" << hr.name << "\",\n";
    file << "    \"risk\": " << std::fixed << std::setprecision(2) << hr.risk << "\n";
    file << "  },\n";
    LOG_INFO("Maior risco calculado: " + hr.name + " com " + std::to_string(hr.risk) + "%");

    file << "  \"regions\": [\n";

    Node *node = list.getHead();
    bool firstLocality = true;

    while (node != nullptr) {
        Locality *locality = node->data;

        double growthRate = sa.growthRate(list, locality->getName()).growthRate;

        if (!firstLocality) file << ",\n";
        firstLocality = false;

        file << "    {\n";
        file << "      \"name\": \""        << locality->getName() << "\",\n";
        file << "      \"type\": \""        << (locality->isUrban() ? "urban" : "rural") << "\",\n";
        file << "      \"risk\": "          << std::fixed << std::setprecision(2) << locality->calculateRisk() << ",\n";
        file << "      \"status\": \""       << sa.getStatus(locality->calculateRisk()) << "\",\n";
        
        if (std::isnan(growthRate)) {
            file << "      \"growth_rate\": null,\n";
            LOG_WARNING("Taxa de crescimento para " + locality->getName() + " é NaN. Exportando como null.");
        } else {
            file << "      \"growth_rate\": "   << std::fixed << std::setprecision(2) << growthRate << ",\n";
        }

        file << "      \"bulletins\": [\n";

        MonthlyBulletin *bulletin = locality->getHead();
        bool firstBulletin = true;

        while (bulletin != nullptr) {
            if (!firstBulletin) file << ",\n";
            firstBulletin = false;

            file << "        {\n";
            file << "          \"month\": \""           << bulletin->getMonth()            << "\",\n";
            file << "          \"notified\": "          << bulletin->getNotified()          << ",\n";
            file << "          \"confirmed\": "         << bulletin->getConfirmed()         << ",\n";
            file << "          \"discarded\": "         << bulletin->getDiscarded()         << ",\n";
            file << "          \"underAnalysis\": "     << bulletin->getUnderAnalysis()     << ",\n";
            file << "          \"dengueCases\": "       << bulletin->getDengueCases()       << ",\n";
            file << "          \"dengueAlarmCases\": "  << bulletin->getDengueAlarmCases()  << ",\n";
            file << "          \"dengueSevereCases\": " << bulletin->getDengueSevereCases() << ",\n";
            file << "          \"zikaCases\": "         << bulletin->getZikaCases()         << ",\n";
            file << "          \"chikungunyaCases\": "  << bulletin->getChikungunyaCases()  << ",\n";
            file << "          \"deaths\": "            << bulletin->getDeaths()            << "\n";
            file << "        }";

            bulletin = bulletin->next;
        }

        file << "\n      ]\n";
        file << "    }";

        node = node->next;
    }

    file << "\n  ]\n";
    file << "}\n";

    file.close();
    LOG_INFO("Escrita do JSON concluída com sucesso.");
}
