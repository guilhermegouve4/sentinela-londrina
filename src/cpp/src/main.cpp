#include "../include/LinkedList.h"
#include "../include/UrbanRegion.h"
#include "../include/RuralDistrict.h"
#include "../include/CSVReader.h"
#include "../include/JSONWriter.h"

static const std::string OUTPUT_PATH = "src/frontend/public/result.json";

int main() {
    LinkedList list;

    list.insertOrdered(new UrbanRegion("Norte"));
    list.insertOrdered(new UrbanRegion("Sul"));
    list.insertOrdered(new UrbanRegion("Leste"));
    list.insertOrdered(new UrbanRegion("Oeste"));
    list.insertOrdered(new UrbanRegion("Central"));
    list.insertOrdered(new RuralDistrict());

    CSVReader reader;
    reader.read(list);

    JSONWriter writer;
    writer.write(list, OUTPUT_PATH);

    return 0;
}
