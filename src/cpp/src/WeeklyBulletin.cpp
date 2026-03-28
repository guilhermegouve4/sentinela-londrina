#include "../include/WeeklyBulletin.h"

std::string WeeklyBulletin::getWeek() const { return m_week; }
int WeeklyBulletin::getNotified() const { return m_notified; }
int WeeklyBulletin::getConfirmed() const { return m_confirmed; }
int WeeklyBulletin::getDiscarded() const { return m_discarded; }
int WeeklyBulletin::getUnderAnalysis() const { return m_underAnalysis; }
int WeeklyBulletin::getDengueCases() const { return m_dengueCases; }
int WeeklyBulletin::getDengueAlarmCases() const { return m_dengueAlarmCases; }
int WeeklyBulletin::getDengueSevereCases() const { return m_dengueSevereCases; }
int WeeklyBulletin::getZikaCases() const { return m_zikaCases; }
int WeeklyBulletin::getChikungunyaCases() const { return m_chikungunyaCases; }
int WeeklyBulletin::getDeaths() const { return m_deaths; }
