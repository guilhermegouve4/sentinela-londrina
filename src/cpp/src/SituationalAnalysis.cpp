#include <limits>
#include "../include/SituationalAnalysis.h"
#include "../include/Locality.h"
#include "../include/MonthlyBulletin.h"
#include "../include/Node.h"

HighestRiskRegion SituationalAnalysis::highestRisk(LinkedList &list) {
    HighestRiskRegion result;
    result.name = "";
    result.risk = 0.0;

    Node *node = list.getHead();

    while (node != nullptr) {
        Locality *locality = node->data;

        double currentRisk = locality->calculateRisk();

        if (currentRisk > result.risk) {
            result.risk = currentRisk;
            result.name = locality->getName();
        }

        node = node->next;
    }

    return result;
}

RegionGrowth SituationalAnalysis::growthRate(LinkedList &list, const std::string &regionName) {
    RegionGrowth result;
    result.name = regionName;
    result.growthRate = 0.0;

    Locality *locality = list.find(regionName);
    if (locality == nullptr) return result;

    MonthlyBulletin *latest = locality->getHead();
    if (latest == nullptr) return result;

    MonthlyBulletin *previous = latest->next;
    if (previous == nullptr) return result;

    int confirmedLatest   = latest->getConfirmed();
    int confirmedPrevious = previous->getConfirmed();

    if (confirmedPrevious == 0 && confirmedLatest == 0) {
        result.growthRate = 0.0;
    } else if (confirmedPrevious == 0 && confirmedLatest > 0) {
        result.growthRate = std::numeric_limits<double>::quiet_NaN();
    } else {
        result.growthRate = (double)(confirmedLatest - confirmedPrevious)
                            / confirmedPrevious * 100.0;
    }

    return result;
}
