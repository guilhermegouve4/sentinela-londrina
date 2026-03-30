#pragma once
#include <string>
#include "LinkedList.h"

class JSONWriter {
public:
    void write(LinkedList &list, const std::string &outputPath);
};
