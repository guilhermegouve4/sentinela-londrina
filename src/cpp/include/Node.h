#pragma once

class Locality;

class Node{
    public:
        Locality *data;
        Node *next;
        Node(Locality *data) : data(data), next(nullptr){}
        
};