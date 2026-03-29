#include <string>
#include "../include/Locality.h"

std::string Locality::getName() const{return m_name;}
void Locality::setName(const std::string &newName){m_name = newName;}
Locality::~Locality(){}