#pragma once
#include <string>
#include "LinkedList.h"

// risk < 10.0  → "normal"
// risk 10-20   → "alert"
// risk > 20.0  → "critical"

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
    HighestRiskRegion highestRisk(LinkedList &list);
    RegionGrowth      growthRate(LinkedList &list, const std::string &regionName);
    std::string       getStatus(double risk);
};
