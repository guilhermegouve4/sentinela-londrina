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
      src/cpp/src/SituationalAnalysis.cpp

TARGET = sentinela.exe

all: $(TARGET)

$(TARGET): $(SRC)
	$(CXX) $(CXXFLAGS) -o $(TARGET) $(SRC)

clean:
	rm -f $(TARGET) backend.log
