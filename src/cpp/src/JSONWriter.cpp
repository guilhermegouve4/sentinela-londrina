#include <fstream>
#include <cmath>
#include "../include/JSONWriter.h"
#include "../include/LinkedList.h"
#include "../include/Node.h"
#include "../include/Locality.h"
#include "../include/MonthlyBulletin.h"
#include "../include/SituationalAnalysis.h"

void JSONWriter::write(LinkedList &list, const std::string &outputPath) {
    SituationalAnalysis sa;
    HighestRiskRegion highest = sa.highestRisk(list);

    std::ofstream file(outputPath);

    file << "{\n";

    file << "  \"highest_risk\": {\n";
    file << "    \"region\": \"" << highest.name << "\",\n";
    file << "    \"risk\": "     << highest.risk  << "\n";
    file << "  },\n";

    file << "  \"regions\": [\n";

    Node *node = list.getHead();
    bool firstLocality = true;

    while (node != nullptr) {
        Locality *locality = node->data;

        RegionGrowth growth = sa.growthRate(list, locality->getName());

        if (!firstLocality) file << ",\n";
        firstLocality = false;

        file << "    {\n";
        file << "      \"name\": \""        << locality->getName() << "\",\n";
        file << "      \"type\": \""        << (locality->isUrban() ? "urban" : "rural") << "\",\n";
        file << "      \"risk\": "          << locality->calculateRisk() << ",\n";
        file << "      \"status\": \""      << sa.getStatus(locality->calculateRisk()) << "\",\n";

        if (std::isnan(growth.growthRate)) {
            file << "      \"growth_rate\": null,\n";
        } else {
            file << "      \"growth_rate\": " << growth.growthRate << ",\n";
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
}
