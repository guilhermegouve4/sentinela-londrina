CXX      = g++
CXXFLAGS = -std=c++17 -Wall -Wextra

SRC = src/cpp/src/main.cpp \
      src/cpp/src/LinkedList.cpp \
      src/cpp/src/Locality.cpp \
      src/cpp/src/UrbanRegion.cpp \
      src/cpp/src/RuralDistrict.cpp \
      src/cpp/src/MonthlyBulletin.cpp \
      src/cpp/src/Node.cpp \
      src/cpp/src/CSVReader.cpp \
      src/cpp/src/JSONWriter.cpp \
      src/cpp/src/SituationalAnalysis.cpp \
      src/cpp/src/Logger.cpp

TEST_LOGGER_SRC = src/cpp/test/test_logger.cpp \
                  src/cpp/src/Logger.cpp

TEST_MONTHLY_BULLETIN_SRC = src/cpp/test/test_monthly_bulletin.cpp \
                            src/cpp/src/MonthlyBulletin.cpp

TEST_LOCALITY_SRC = src/cpp/test/test_locality.cpp \
                    src/cpp/src/Locality.cpp \
                    src/cpp/src/UrbanRegion.cpp \
                    src/cpp/src/RuralDistrict.cpp \
                    src/cpp/src/MonthlyBulletin.cpp

TEST_LINKED_LIST_SRC = src/cpp/test/test_linked_list.cpp \
                       src/cpp/src/LinkedList.cpp \
                       src/cpp/src/Locality.cpp \
                       src/cpp/src/UrbanRegion.cpp \
                       src/cpp/src/RuralDistrict.cpp \
                       src/cpp/src/Node.cpp

TARGET = sentinela.exe
TEST_LOGGER_TARGET = test_logger.exe
TEST_MONTHLY_BULLETIN_TARGET = test_monthly_bulletin.exe
TEST_LOCALITY_TARGET = test_locality.exe
TEST_LINKED_LIST_TARGET = test_linked_list.exe

all: $(TARGET)

$(TARGET): $(SRC)
	$(CXX) $(CXXFLAGS) -o $(TARGET) $(SRC)

test_logger: $(TEST_LOGGER_SRC)
	$(CXX) $(CXXFLAGS) -o $(TEST_LOGGER_TARGET) $(TEST_LOGGER_SRC)
	./$(TEST_LOGGER_TARGET)

test_monthly_bulletin: $(TEST_MONTHLY_BULLETIN_SRC)
	$(CXX) $(CXXFLAGS) -o $(TEST_MONTHLY_BULLETIN_TARGET) $(TEST_MONTHLY_BULLETIN_SRC)
	./$(TEST_MONTHLY_BULLETIN_TARGET)

test_locality: $(TEST_LOCALITY_SRC)
	$(CXX) $(CXXFLAGS) -o $(TEST_LOCALITY_TARGET) $(TEST_LOCALITY_SRC)
	./$(TEST_LOCALITY_TARGET)

test_linked_list: $(TEST_LINKED_LIST_SRC)
	$(CXX) $(CXXFLAGS) -o $(TEST_LINKED_LIST_TARGET) $(TEST_LINKED_LIST_SRC)
	./$(TEST_LINKED_LIST_TARGET)

clean:
	rm -f $(TARGET) $(TEST_LOGGER_TARGET) $(TEST_MONTHLY_BULLETIN_TARGET) $(TEST_LOCALITY_TARGET) $(TEST_LINKED_LIST_TARGET) backend.log