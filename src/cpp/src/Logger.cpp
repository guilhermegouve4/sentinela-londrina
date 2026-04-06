#include "../include/Logger.h"

Logger& Logger::getInstance() {
    static Logger instance;
    return instance;
}

Logger::Logger() : m_logLevel(INFO) {
    m_logFile.open("backend.log", std::ios::app);
    if (!m_logFile.is_open()) {
        std::cerr << "ERRO: Não foi possível abrir o arquivo de log backend.log" << std::endl;
    }
}

Logger::~Logger() {
    if (m_logFile.is_open()) {
        m_logFile.close();
    }
}

void Logger::setLogLevel(LogLevel level) {
    m_logLevel = level;
}

std::string Logger::logLevelToString(LogLevel level) {
    switch (level) {
        case DEBUG: return "DEBUG";
        case INFO: return "INFO";
        case WARNING: return "WARNING";
        case ERROR: return "ERROR";
        default: return "UNKNOWN";
    }
}

void Logger::log(LogLevel level, const std::string& message) {
    if (level >= m_logLevel) {
        std::lock_guard<std::mutex> lock(m_mutex);
        auto now = std::chrono::system_clock::now();
        auto in_time_t = std::chrono::system_clock::to_time_t(now);

        std::stringstream ss;
        ss << std::put_time(std::localtime(&in_time_t), "%Y-%m-%d %H:%M:%S");

        if (m_logFile.is_open()) {
            m_logFile << ss.str() << " - " << logLevelToString(level) << " - " << message << std::endl;
        }
        std::cout << ss.str() << " - " << logLevelToString(level) << " - " << message << std::endl;
    }
}