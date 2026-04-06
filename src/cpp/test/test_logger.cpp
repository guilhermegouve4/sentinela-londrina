#include "../include/Logger.h"
#include <cassert>
#include <iostream>
#include <fstream>
#include <string>
#include <vector>

// Função auxiliar para ler o conteúdo do arquivo de log
std::string readLogFile(const std::string& filename) {
    std::ifstream file(filename);
    std::string content((std::istreambuf_iterator<char>(file)), std::istreambuf_iterator<char>());
    return content;
}

void testLogger() {
    std::cout << "Running Logger tests...\n";

    // Limpar o arquivo de log antes de cada teste
    std::ofstream ofs("backend.log", std::ios::trunc);
    ofs.close();

    Logger& logger = Logger::getInstance();
    logger.setLogLevel(DEBUG); // Definir nível de log para DEBUG para capturar tudo

    LOG_DEBUG("This is a debug message.");
    LOG_INFO("This is an info message.");
    LOG_WARNING("This is a warning message.");
    LOG_ERROR("This is an error message.");

    std::string logContent = readLogFile("backend.log");

    assert(logContent.find("DEBUG - This is a debug message.") != std::string::npos && "DEBUG message not found");
    assert(logContent.find("INFO - This is an info message.") != std::string::npos && "INFO message not found");
    assert(logContent.find("WARNING - This is a warning message.") != std::string::npos && "WARNING message not found");
    assert(logContent.find("ERROR - This is an error message.") != std::string::npos && "ERROR message not found");

    // Testar nível de log
    std::ofstream ofs2("backend.log", std::ios::trunc);
    ofs2.close();
    logger.setLogLevel(INFO);
    LOG_DEBUG("This debug message should not appear.");
    LOG_INFO("This info message should appear.");

    logContent = readLogFile("backend.log");
    assert(logContent.find("DEBUG - This debug message should not appear.") == std::string::npos && "DEBUG message found when it shouldn't");
    assert(logContent.find("INFO - This info message should appear.") != std::string::npos && "INFO message not found");

    std::cout << "Logger tests passed!\n";
}

int main() {
    testLogger();
    return 0;
}