#include "../include/Locality.h"
#include "../include/UrbanRegion.h"
#include "../include/RuralDistrict.h"
#include "../include/MonthlyBulletin.h"
#include <cassert>
#include <iostream>

void testLocality() {
    std::cout << "Running Locality tests...\n";

    // Test UrbanRegion
    UrbanRegion urbanRegion("Centro");
    assert(urbanRegion.getName() == "Centro");
    assert(urbanRegion.isUrban() == true);
    assert(urbanRegion.calculateRisk() == 0.0); // No bulletins yet

    MonthlyBulletin* mb1 = new MonthlyBulletin("01/2025", 100, 50, 30, 20, 40, 5, 2, 3, 1, 0);
    urbanRegion.addBulletin(mb1);
    assert(urbanRegion.getHead() == mb1);
    assert(urbanRegion.calculateRisk() == 50.0); // (50 confirmed / 100 notified) * 100

    MonthlyBulletin* mb2 = new MonthlyBulletin("02/2025", 200, 120, 50, 30, 100, 10, 5, 6, 2, 1);
    urbanRegion.addBulletin(mb2);
    assert(urbanRegion.getHead() == mb2);
    assert(urbanRegion.calculateRisk() == 60.0); // (120 confirmed / 200 notified) * 100

    // Test RuralDistrict
    RuralDistrict ruralDistrict;
    assert(ruralDistrict.getName() == "Rural");
    assert(ruralDistrict.isUrban() == false);
    assert(ruralDistrict.calculateRisk() == 0.0); // No bulletins yet

    MonthlyBulletin* mb3 = new MonthlyBulletin("01/2025", 50, 10, 20, 20, 8, 1, 0, 0, 0, 0);
    ruralDistrict.addBulletin(mb3);
    assert(ruralDistrict.getHead() == mb3);
    assert(ruralDistrict.calculateRisk() == 20.0); // (10 confirmed / 50 notified) * 100

    MonthlyBulletin* mb4 = new MonthlyBulletin("02/2025", 70, 15, 30, 25, 12, 2, 0, 0, 0, 0);
    ruralDistrict.addBulletin(mb4);
    assert(ruralDistrict.getHead() == mb4);
    assert(ruralDistrict.calculateRisk() == (15.0 / 70.0) * 100.0); // (15 confirmed / 70 notified) * 100

    // Clean up memory
    delete mb1;
    delete mb2;
    delete mb3;
    delete mb4;

    std::cout << "Locality tests passed!\n";
}

int main() {
    testLocality();
    return 0;
}