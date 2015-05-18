#!/bin/bash

echo 'Create new graph:'
curl -X POST -H "Content-Type: application/json" localhost:3000/api/graph/create -d '{"name": "graph"}'
echo

echo 'Create new places:'
curl -X POST -H "Content-Type: application/json" localhost:3000/api/place/create -d '{"label": "p1", "markers": "1", "posx":2, "posy": 4}'  # id: 0
echo
curl -X POST -H "Content-Type: application/json" localhost:3000/api/place/create -d '{"label": "p2", "markers": "2"}'                       # id: 1
echo

echo 'Create new transitions:'
curl -X POST -H "Content-Type: application/json" localhost:3000/api/transition/create -d '{"label": "t1"}'                                  # id:2
echo

echo 'Connect nodes:'
curl -X POST -H "Content-Type: application/json" localhost:3000/api/vertex/connect -d '{"source": 0, "target": 2}'
echo

echo 'Disconnect nodes:'
curl -X POST -H "Content-Type: application/json" localhost:3000/api/vertex/disconnect -d '{"source": 0, "target": 2}'
echo

echo 'Connect nodes again:'
curl -X POST -H "Content-Type: application/json" localhost:3000/api/vertex/connect -d '{"source": 0, "target": 2}'
echo

echo 'Remove nodes:'
curl -X POST -H "Content-Type: application/json" localhost:3000/api/vertex/remove -d '{"id": 1}'
echo

echo 'Set place markers:'
curl -X POST -H "Content-Type: application/json" localhost:3000/api/place/markers -d '{"id": 0, "markers": 5}'
echo

echo 'Set place label:'
curl -X POST -H "Content-Type: application/json" localhost:3000/api/vertex/label -d '{"id": 0, "label": "new label"}'
echo

echo 'Set place position:'
curl -X POST -H "Content-Type: application/json" localhost:3000/api/vertex/position -d '{"id": 0, "posx": 3, "posy": 8}'
echo

echo 'Set edge weight:'
curl -X POST -H "Content-Type: application/json" localhost:3000/api/edge/weight -d '{"id": 1, "weight": 8}'
echo
