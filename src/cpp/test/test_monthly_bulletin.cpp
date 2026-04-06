#include "../include/MonthlyBulletin.h"
#include <cassert>
#include <iostream>

void testMonthlyBulletin() {
    std::cout << "Running MonthlyBulletin tests...\n";

    // Test constructor and getters
    MonthlyBulletin mb("01/2025", 100, 50, 30, 20, 40, 5, 2, 3, 1, 0);
    assert(mb.getMonth() == "01/2025");
    assert(mb.getNotified() == 100);
    assert(mb.getConfirmed() == 50);
    assert(mb.getDiscarded() == 30);
    assert(mb.getUnderAnalysis() == 20);
    assert(mb.getDengueCases() == 40);
    assert(mb.getDengueAlarmCases() == 5);
    assert(mb.getDengueSevereCases() == 2);
    assert(mb.getZikaCases() == 3);
    assert(mb.getChikungunyaCases() == 1);
    assert(mb.getDeaths() == 0);

    // Test setters
    mb.setNotified(110);
    assert(mb.getNotified() == 110);

    std::cout << "MonthlyBulletin tests passed!\n";
}

int main() {
    testMonthlyBulletin();
    return 0;
}