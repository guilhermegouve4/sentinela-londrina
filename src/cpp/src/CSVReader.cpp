#include <filesystem>
#include <fstream>
#include <sstream>
#include <string>
#include <vector>
#include <algorithm>
#include "../include/CSVReader.h"
#include "../include/LinkedList.h"
#include "../include/MonthlyBulletin.h"

static const std::string DATA_PATH = "data/processed/";

void CSVReader::read(LinkedList &list) {
    std::vector<std::filesystem::path> files;
    for (auto &entry : std::filesystem::directory_iterator(DATA_PATH)) {
        if (entry.path().extension() == ".csv") {
            files.push_back(entry.path());
        }
    }

    std::sort(files.begin(), files.end());
    
    for (auto &path : files) {
        std::ifstream file(path);
        std::string line;
        std::getline(file, line);
        std::string stem = path.stem().string();
        std::string month = stem.substr(5, 2) + "/" + stem.substr(0, 4);

        while (std::getline(file, line)) {
            if (line.empty()) continue;
            std::stringstream ss(line);
            std::string region, type, week;
            int notified, confirmed, discarded, underAnalysis;
            int dengueCases, dengueAlarmCases, dengueSevereCases;
            int zikaCases, chikungunyaCases, deaths;
            char comma;

            std::getline(ss, region, ',');
            std::getline(ss, type, ',');
            std::getline(ss, week, ',');
            ss >> notified >> comma >> confirmed >> comma >> discarded >> comma
               >> underAnalysis >> comma >> dengueCases >> comma
               >> dengueAlarmCases >> comma >> dengueSevereCases >> comma
               >> zikaCases >> comma >> chikungunyaCases >> comma >> deaths;

            Locality *locality = list.find(region);
            if (locality == nullptr) continue;

            MonthlyBulletin *bulletin = new MonthlyBulletin(
                month,
                notified, confirmed, discarded, underAnalysis,
                dengueCases, dengueAlarmCases, dengueSevereCases,
                zikaCases, chikungunyaCases, deaths
            );

            locality->addBulletin(bulletin);
        }
    }
}
