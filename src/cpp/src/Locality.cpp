#include <string>
#include "../include/Locality.h"
#include "../include/MonthlyBulletin.h"

std::string Locality::getName() const{return m_name;}
void Locality::setName(const std::string &newName){m_name = newName;}
Locality::~Locality(){}

void Locality::addBulletin(MonthlyBulletin *bulletin) {
    bulletin->next = head;
    head = bulletin;
}