#pragma once
#include <string>
#include "LinkedList.h"

struct HighestRiskRegion {
    std::string name;
    double risk;
};

struct RegionGrowth {
    std::string name;
    double growthRate;
};

class SituationalAnalysis {
public:
    HighestRiskRegion      highestRisk(LinkedList &list);
    RegionGrowth    growthRate(LinkedList &list, const std::string &regionName);
};
