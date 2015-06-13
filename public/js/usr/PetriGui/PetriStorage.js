var PetriStorage = function(app, ajax) {
    this.app    = app;
    this.Remote = new RemotePetriStorage(ajax);
    this.Graph  = null;
    this.placeNumo      = 1;
    this.transitionNumo = 1;

    this.PLACE      = 'place';
    this.TRANSITION = 'transition';

    this.Init = function() {
        this.Graph = new Graph(new DefaultVertexStorage(), new DirectedDenseEdgeStorage());
        this.UseGraph("petri");

        return this;
    };

    this.UseGraph = function(name) {
        this.Remote.UseGraph(name);
    };

    this.Build = function(graph) {
        var i, j;
        var vertex;
        var edges;
        var neighbour;
        var edge;
        var gEdge;

        this.Reset();

        edges = [];
        for (i in graph.vertices) {
            if (graph.vertices.hasOwnProperty(i) !== false) {
                vertex = graph.vertices[i];

                if (vertex.type === 'Place') {
                    this.Graph.AddVertex(
                        vertex.id,
                        new GraphVertex(new PetriNode(vertex.id, vertex.position.x, vertex.position.y, this.PLACE, vertex.label, vertex.markers, 1, vertex.weight))
                    );

                    this.placeNumo++;
                }
                else if (vertex.type === 'Transition') {
                    this.Graph.AddVertex(
                        vertex.id,
                        new GraphVertex(new PetriNode(vertex.id, vertex.position.x, vertex.position.y, this.TRANSITION, vertex.label, 0, vertex.priority))
                    );

                    this.transitionNumo++;
                }

                for (j in vertex.neighbours) {
                    if (vertex.neighbours.hasOwnProperty(j) !== false) {
                        neighbour = vertex.neighbours[j];

                        edges.push([ neighbour.edge_id, vertex.id, neighbour.id, neighbour.weight ]);
                    }
                }
            }
        }

        for (i in edges) {
            if (edges.hasOwnProperty(i) !== false) {
                edge = edges[i];

                gEdge = new GraphEdge(new PetriEdge(edge[3]));
                gEdge.id = edge[0];

                this.Graph.AddEdge(
                    edge[1],
                    edge[2],
                    gEdge
                )
            }
        }
    };

    this.GetVertexCurrentNumo = function() {
        return this.GetPlaceCurrentNumo() + this.GetTransitionCurrentNumo() - 1;
    };

    this.GetPlaceCurrentNumo = function() {
        return this.placeNumo;
    };

    this.GetTransitionCurrentNumo = function() {
        return this.transitionNumo;
    };

    this.SetPlaceData = function(id, type, val) {
        switch (type) {
            case 'label': return this.SetPlaceLabel(id, val);
            case 'markers': return this.SetPlaceMarkers(id, val);
            case 'priority': return this.SetPlacePriority(id, val);
            case 'weight': return this.SetPlaceWeight(id, val);
            default: return;
        }
    };

    this.SetPlaceLabel = function(id, label) {
        var vertex;
        var response;

        response = this.Remote.SetVertexLabel(id, label);
        if (!response.status) {
            return;
        }

        vertex = this.Graph.GetVertex(id).GetData();
        vertex.label = label;
    };

    this.SetPlaceMarkers = function(id, markers) {
        var vertex;
        var response;

        response = this.Remote.SetVertexMarkers(id, markers);
        if (!response.status) {
            return;
        }

        vertex = this.Graph.GetVertex(id).GetData();
        vertex.markers = markers;
    };

    this.SetPlacePriority = function(id, priority) {
        var vertex;
        var response;

        response = this.Remote.SetVertexPriority(id, priority);
        if (!response.status) {
            return;
        }

        vertex = this.Graph.GetVertex(id).GetData();
        vertex.priority = priority;
    };

    this.SetPlaceWeight = function(id, weight) {
        var vertex;
        var response;

        response = this.Remote.SetVertexWeight(id, weight);
        if (!response.status) {
            return;
        }

        vertex = this.Graph.GetVertex(id).GetData();
        vertex.weight = weight;
    };


    this.SetPlacePos = function(id, x, y) {
        var vertex;
        var response;

        vertex = this.Graph.GetVertex(id).GetData();
        if (~~vertex.x === ~~x && ~~vertex.y === ~~y) {
            return;
        }

        response = this.Remote.SetVertexPosition(id, x, y);
        if (!response.status) {
            return;
        }

        vertex = this.Graph.GetVertex(id).GetData();
        vertex.x = x;
        vertex.y = y;
    };

    this.SetConnectionData = function(id, type, val) {
        switch (type) {
            case 'cost': return this.SetConnectionCost(id, val);
            default: return;
        }
    };

    this.SetConnectionCost = function(id, cost) {
        var conn;
        var response;

        response = this.Remote.SetConnectionCost(id, cost);
        if (!response.status) {
            return;
        }

        conn = this.Graph.GetEdge(id).GetData();
        conn.cost = cost;
    };

    this.AddPlace = function(posx, posy, label, markers) {
        var id;
        var response;

        //var id = this.GetCurrentVertexID();

        response = this.Remote.CreatePlace(label, markers, posx, posy);
        if (!response.status) {
            return this;
        }
        id = response.data.id;

        this.Graph.AddVertex(
            id,
            new GraphVertex(new PetriNode(id, posx, posy, this.PLACE, label, markers, 1, 1))
        );
        this.placeNumo++;

        return this;
    };

    this.AddTransition = function(posx, posy, label, priority) {
        var id;
        var response;

        //var id = this.GetCurrentVertexID();

        response = this.Remote.CreateTransition(label, posx, posy);
        if (!response.status) {
            return this;
        }
        id = response.data.id;

        this.Graph.AddVertex(
            id,
            new GraphVertex(new PetriNode(id, posx, posy, this.TRANSITION, label, 0, priority))
        );
        this.transitionNumo++;

        return this;
    };

    this.AddConnection = function(source, target, cost) {
        var response;
        var id;
        var gEdge;

        if (this.Graph.GetEdgeBetween(source, target) !== null) {
            return this;
        }

        if (this.Graph.GetVertex(source).GetData().type === this.Graph.GetVertex(target).GetData().type) {
            return this;
        }

        response = this.Remote.CreateConnection(source, target, cost);
        if (!response.status) {
            return this;
        }

        id = response.data.id;
        gEdge = new GraphEdge(new PetriEdge(cost));
        gEdge.id = id;

        this.Graph.AddEdge(
            source,
            target,
            gEdge
        );

        return this;
    };

    this.RemovePlace = function(id) {
        var key;
        var response;
        var incidents;
        var eid;

        response = this.Remote.RemoveVertex(id);
        if (!response.status) {
            return this;
        }

        incidents = this.Graph.GetIncidentEdges(id);
        for (key in incidents) {
            if (incidents.hasOwnProperty(key) !== false) {
                eid = incidents[key];
                this.Graph.RemoveEdge(eid);
            }
        }

        this.Graph.RemoveVertex(id);
        return this;
    };

    this.RemoveTransition = function(id) {
        var key;
        var incidents;
        var response;
        var eid;

        response = this.Remote.RemoveVertex(id);
        if (!response.status) {
            return this;
        }

        incidents = this.Graph.GetIncidentEdges(id);

        for (key in incidents) {
            if (incidents.hasOwnProperty(key) !== false) {
                eid = incidents[key];
                this.Graph.RemoveEdge(eid);
            }
        }

        this.Graph.RemoveVertex(id);
        return this;
    };

    this.RemoveConnection = function(source, target) {
        var E;
        var response;

        response = this.Remote.RemoveConnection(source, target);
        if (!response.status) {
            return this;
        }

        if ((E = this.Graph.GetEdgeBetween(source, target)) === null) {
            return this;
        }

        this.Graph.RemoveEdge(E.GetID());
        return this;
    };

    this.GetPlace = function(id) {
        return this.Graph.GetVertex(id).GetData();
    };

    this.GetTransition = function(id) {
        return this.Graph.GetVertex(id).GetData();
    };

    this.GetConnection = function(source, target) {
        var edge = this.Graph.GetEdgeBetween(source, target);

        return (edge !== null) ? edge.GetData() : edge;
    };

    this.GetIncidentConnections = function(id) {
        var edges = this.Graph.GetIncidentEdges(id);
        var r = [];
        var i;

        for (i in edges) {
            if (edges.hasOwnProperty(i) !== false) {
                r.push(this.Graph.GetEdge(edges[i]).GetData());
            }
        }

        return r;
    };

    this.GetAll = function() {
        var record;
        var vertices = this.Graph.GetVertices();
        var nodes = [ [], [] ];
        var vkey;

        for (vkey in vertices) {
            if (vertices.hasOwnProperty(vkey) !== false) {
                record = vertices[vkey].GetData();

                if (record.type === this.PLACE) {
                    nodes[0].push(record);
                }
                else if (record.type === this.TRANSITION) {
                    nodes[1].push(record);
                }
            }
        }

        return nodes;
    };

    this.GetConnections = function() {
        var record;
        var edges = this.Graph.GetEdges();
        var records = [];
        var key;

        for (key in edges) {
            if (edges.hasOwnProperty(key) !== false) {
                record = edges[key].GetData();
                record.id     = edges[key].GetID();
                record.source = this.Graph.GetEdgeSource(record.id);
                record.target = this.Graph.GetEdgeTarget(record.id);

                records.push(record);
            }
        }

        return records;
    };

    this.ComparePlaces = function(P1, P2) {
        return P1.label === P2.label && P1.markers === P2.markers && P1.weight === P2.weight;
    };

    this.CompareTransitions = function(T1, T2) {
        return T1.label === T2.label && T1.priority === T2.priority;
    };

    this.CompareConnections = function(C1, C2) {
        return C1.cost === C2.cost;
    };

    this.Reset = function() {
        this.Graph.Reset();
        this.placeNumo      = 1;
        this.transitionNumo = 1;

        return this;
    };

    return this;
};
