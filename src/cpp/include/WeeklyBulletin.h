#pragma once
#include <string>

class WeeklyBulletin {
    private:
        std::string m_week;
        int m_notified;
        int m_confirmed;
        int m_discarded;
        int m_underAnalysis;
        int m_dengueCases;
        int m_dengueAlarmCases;
        int m_dengueSevereCases;
        int m_zikaCases;
        int m_chikungunyaCases;
        int m_deaths;

    public:
        WeeklyBulletin *next;
        WeeklyBulletin(
            const std::string &week,
            int notified,
            int confirmed,
            int discarded,
            int underAnalysis,
            int dengueCases,
            int dengueAlarmCases,
            int dengueSevereCases,
            int zikaCases,
            int chikungunyaCases,
            int deaths
        ) :
            m_week(week),
            m_notified(notified),
            m_confirmed(confirmed),
            m_discarded(discarded),
            m_underAnalysis(underAnalysis),
            m_dengueCases(dengueCases),
            m_dengueAlarmCases(dengueAlarmCases),
            m_dengueSevereCases(dengueSevereCases),
            m_zikaCases(zikaCases),
            m_chikungunyaCases(chikungunyaCases),
            m_deaths(deaths),
            next(nullptr) {}

        std::string getWeek() const;
        int getNotified() const;
        int getConfirmed() const;
        int getDiscarded() const;
        int getUnderAnalysis() const;
        int getDengueCases() const;
        int getDengueAlarmCases() const;
        int getDengueSevereCases() const;
        int getZikaCases() const;
        int getChikungunyaCases() const;
        int getDeaths() const;
};