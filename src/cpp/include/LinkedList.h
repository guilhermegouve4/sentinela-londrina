#pragma once
#include <string>
#include "Node.h"
#include "Locality.h"

class LinkedList {
private:
    Node *head;

public:
    LinkedList() : head(nullptr) {}
    ~LinkedList();

    void insertOrdered(Locality *locality);
    Locality* find(const std::string &name);
    void remove(const std::string &name);
};
