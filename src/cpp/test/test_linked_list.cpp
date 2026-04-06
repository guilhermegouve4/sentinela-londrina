#include "../include/LinkedList.h"
#include "../include/UrbanRegion.h"
#include "../include/RuralDistrict.h"
#include <cassert>
#include <iostream>

void testLinkedList() {
    std::cout << "Running LinkedList tests...\n";

    LinkedList list;
    assert(list.getHead() == nullptr);

    // Test insertOrdered
    Locality* urban1 = new UrbanRegion("Norte");
    Locality* urban2 = new UrbanRegion("Sul");
    Locality* rural = new RuralDistrict(); // Rural is always last

    list.insertOrdered(urban2);
    list.insertOrdered(urban1);
    list.insertOrdered(rural);

    // Check order: Norte, Sul, Rural
    assert(list.getHead()->data == urban1);
    assert(list.getHead()->next->data == urban2);
    assert(list.getHead()->next->next->data == rural);
    assert(list.getHead()->next->next->next == nullptr);

    // Test find
    assert(list.find("Norte") == urban1);
    assert(list.find("Sul") == urban2);
    assert(list.find("Rural") == rural);
    assert(list.find("Leste") == nullptr);

    // Test destructor (implicit when list goes out of scope or explicit delete)
    // For now, we'll rely on valgrind or similar for memory leaks.
    // Manual cleanup for test allocated Locality objects
    delete urban1;
    delete urban2;
    delete rural;

    std::cout << "LinkedList tests passed!\n";
}

int main() {
    testLinkedList();
    return 0;
}