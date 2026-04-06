#include "../include/SituationalAnalysis.h"
#include "../include/LinkedList.h"
#include "../include/Locality.h"
#include "../include/MonthlyBulletin.h"
#include "../include/Logger.h"

#include <limits>
#include <cmath>

HighestRiskRegion SituationalAnalysis::highestRisk(LinkedList& list) {
    LOG_INFO("Calculando a região de maior risco.");
    HighestRiskRegion result = {"", -1.0};
    Node* current = list.getHead();

    while (current != nullptr) {
        Locality* locality = current->data;
        double currentRisk = locality->calculateRisk();

        if (currentRisk > result.risk) {
            result.name = locality->getName();
            result.risk = currentRisk;
        }
        current = current->next;
    }
    LOG_INFO("Região de maior risco encontrada: " + result.name + " com risco de " + std::to_string(result.risk) + "%");
    return result;
}

RegionGrowth SituationalAnalysis::growthRate(LinkedList& list, const std::string& regionName) {
    LOG_INFO("Calculando taxa de crescimento para a região: " + regionName);
    RegionGrowth result = {"", 0.0};
    Locality* locality = list.find(regionName);

    if (locality == nullptr) {
        LOG_WARNING("Região não encontrada para cálculo de taxa de crescimento: " + regionName);
        result.growthRate = std::numeric_limits<double>::quiet_NaN();
        return result;
    }

    result.name = regionName;
    MonthlyBulletin* latestBulletin = locality->getHead();

    if (latestBulletin == nullptr) {
        LOG_WARNING("Nenhum boletim encontrado para a região " + regionName + ". Taxa de crescimento indefinida.");
        result.growthRate = std::numeric_limits<double>::quiet_NaN();
        return result;
    }

    MonthlyBulletin* previousBulletin = latestBulletin->next;

    if (previousBulletin == nullptr) {
        LOG_INFO("Apenas um boletim encontrado para " + regionName + ". Taxa de crescimento não aplicável.");
        result.growthRate = std::numeric_limits<double>::quiet_NaN();
        return result;
    }

    int latestConfirmed = latestBulletin->getConfirmed();
    int previousConfirmed = previousBulletin->getConfirmed();

    if (previousConfirmed == 0) {
        if (latestConfirmed > 0) {
            LOG_WARNING("Casos confirmados anteriores são zero e atuais são positivos para " + regionName + ". Taxa de crescimento indefinida (NaN).");
            result.growthRate = std::numeric_limits<double>::quiet_NaN();
        } else {
            LOG_INFO("Casos confirmados anteriores e atuais são zero para " + regionName + ". Taxa de crescimento 0%.");
            result.growthRate = 0.0;
        }
    } else {
        result.growthRate = ((double)(latestConfirmed - previousConfirmed) / previousConfirmed) * 100.0;
        LOG_INFO("Taxa de crescimento para " + regionName + ": " + std::to_string(result.growthRate) + "%");
    }

    return result;
}

std::string SituationalAnalysis::getStatus(double risk) {
    if (risk >= 20.0) {
        return "critical";
    } else if (risk >= 10.0) {
        return "alert";
    } else {
        return "normal";
    }
}
