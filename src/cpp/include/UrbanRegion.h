#pragma once
#include "Locality.h"

class UrbanRegion : public Locality {
public:
    UrbanRegion(const std::string &name);
    double calculateRisk() override;
    bool isUrban() override;
};
