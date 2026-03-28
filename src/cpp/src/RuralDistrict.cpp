#include "../include/RuralDistrict.h"
#include "../include/WeeklyBulletin.h"

RuralDistrict::RuralDistrict() : Locality("Rural") {}

bool RuralDistrict::isUrban() { return false; }

double RuralDistrict::calculateRisk() {
    if (head == nullptr || head->getNotified() == 0) return 0.0;
    return (double)head->getConfirmed() / head->getNotified() * 100.0 * 1.5;
}

