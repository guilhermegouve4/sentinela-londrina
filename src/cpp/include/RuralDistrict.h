#pragma once
#include "Locality.h"

class RuralDistrict : public Locality{
    public: 
        RuralDistrict();
        double calculateRisk() override;
        bool isUrban () override;
};