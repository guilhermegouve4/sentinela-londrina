#include "../include/UrbanRegion.h"
#include "../include/MonthlyBulletin.h"

UrbanRegion::UrbanRegion(const std::string &name) : Locality(name) {}

bool UrbanRegion::isUrban() { return true; }

double UrbanRegion::calculateRisk() {
    if (head == nullptr || head->getNotified() == 0) return 0.0;
    return (double)head->getConfirmed() / head->getNotified() * 100.0;
}
