#include "../include/MonthlyBulletin.h"

std::string MonthlyBulletin::getMonth() const { return m_month; }
int MonthlyBulletin::getNotified() const { return m_notified; }
int MonthlyBulletin::getConfirmed() const { return m_confirmed; }
int MonthlyBulletin::getDiscarded() const { return m_discarded; }
int MonthlyBulletin::getUnderAnalysis() const { return m_underAnalysis; }
int MonthlyBulletin::getDengueCases() const { return m_dengueCases; }
int MonthlyBulletin::getDengueAlarmCases() const { return m_dengueAlarmCases; }
int MonthlyBulletin::getDengueSevereCases() const { return m_dengueSevereCases; }
int MonthlyBulletin::getZikaCases() const { return m_zikaCases; }
int MonthlyBulletin::getChikungunyaCases() const { return m_chikungunyaCases; }
int MonthlyBulletin::getDeaths() const { return m_deaths; }

void MonthlyBulletin::setNotified(int notified) { m_notified = notified; }
