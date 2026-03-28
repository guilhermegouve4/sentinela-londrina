#include <string>
#include "../include/Locality.h"

std::string Locality::getName() const{return m_name;}
void Locality::setName(std::string newName){m_name = newName;}
Locality::~Locality(){}