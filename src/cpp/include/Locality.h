#pragma once
#include <string>

class WeeklyBulletin;

class Locality{
    private:
        std::string m_name;

    public:
        Locality(std::string name) : m_name(name){}
        virtual double calculateRisk() = 0;
        std::string getName() const;
        void setName(std::string name);
        virtual ~Locality();
        virtual bool isUrban() = 0;
        
    protected:
        WeeklyBulletin *head;

};