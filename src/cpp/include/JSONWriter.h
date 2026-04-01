#pragma once
#include <string>
#include "LinkedList.h"
#include "SituationalAnalysis.h"

class JSONWriter {
public:
    void write(LinkedList &list, const std::string &outputPath);
};
