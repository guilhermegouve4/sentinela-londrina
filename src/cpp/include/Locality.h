#pragma once
#include <string>

class WeeklyBulletin;

class Locality{
    private:
        std::string m_name;
        WeeklyBulletin *head;


    public:
        Locality(std::string name) : m_name(name){}
        virtual double calculateRisk() = 0;
        std::string getName();
        void setName(std::string name);
        virtual ~Locality();
};