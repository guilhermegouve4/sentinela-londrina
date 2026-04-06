#ifndef LOGGER_H
#define LOGGER_H

#include <string>
#include <iostream>
#include <fstream>
#include <chrono>
#include <iomanip>
#include <mutex>

enum LogLevel {
    DEBUG,
    INFO,
    WARNING,
    ERROR
};

class Logger {
public:
    static Logger& getInstance();
    void setLogLevel(LogLevel level);
    void log(LogLevel level, const std::string& message);

private:
    Logger();
    ~Logger();
    Logger(const Logger&) = delete;
    Logger& operator=(const Logger&) = delete;

    LogLevel m_logLevel;
    std::ofstream m_logFile;
    std::mutex m_mutex;

    std::string logLevelToString(LogLevel level);
};

#define LOG_DEBUG(message) Logger::getInstance().log(DEBUG, message)
#define LOG_INFO(message) Logger::getInstance().log(INFO, message)
#define LOG_WARNING(message) Logger::getInstance().log(WARNING, message)
#define LOG_ERROR(message) Logger::getInstance().log(ERROR, message)

#endif // LOGGER_H