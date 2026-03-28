#include "../include/LinkedList.h"

LinkedList::~LinkedList() {
    Node *current = head;
    while (current != nullptr) {
        Node *next = current->next;
        delete current;
        current = next;
    }
}

void LinkedList::insertOrdered(Locality *locality) {
    Node *newNode = new Node(locality);

    if (head == nullptr || locality->getName() < head->data->getName()) {
        newNode->next = head;
        head = newNode;
        return;
    }

    Node *current = head;
    while (current->next != nullptr && current->next->data->getName() < locality->getName()) {
        current = current->next;
    }

    newNode->next = current->next;
    current->next = newNode;
}

Locality* LinkedList::find(const std::string &name) {
    Node *current = head;
    while (current != nullptr) {
        if (current->data->getName() == name) return current->data;
        current = current->next;
    }
    return nullptr;
}

void LinkedList::remove(const std::string &name) {
    if (head == nullptr) return;

    if (head->data->getName() == name) {
        Node *toDelete = head;
        head = head->next;
        delete toDelete;
        return;
    }

    Node *current = head;
    while (current->next != nullptr) {
        if (current->next->data->getName() == name) {
            Node *toDelete = current->next;
            current->next = toDelete->next;
            delete toDelete;
            return;
        }
        current = current->next;
    }
}
