var PetriStorage = function(app) {
    this.app    = app;
    this.Remote = new RemotePetriStorage();
    this.Graph  = null;
    this.placeCurrentID      = 1;
    this.transitionCurrentID = 1;

    this.PLACE      = 'place';
    this.TRANSITION = 'transition';

    this.Init = function() {
        this.Graph = new Graph(new DefaultVertexStorage(), new DirectedDenseEdgeStorage());

        return this;
    };

    this.GetCurrentVertexID = function() {
        return this.GetPlaceCurrentID() + this.GetTransitionCurrentID() - 1;
    };

    this.GetPlaceCurrentID = function() {
        return this.placeCurrentID;
    };

    this.GetTransitionCurrentID = function() {
        return this.transitionCurrentID;
    };

    this.SetPlaceData = function(id, type, val) {
        var vertex;

        vertex = this.Graph.GetVertex(id).GetData();
        vertex[type] = val;
    };

    this.SetPlacePos = function(id, x, y) {
        var vertex;

        vertex = this.Graph.GetVertex(id).GetData();
        vertex.x = x;
        vertex.y = y;
    };

    this.SetConnectionData = function(id, type, val) {
        var conn;

        conn = this.Graph.GetEdge(id).GetData();
        conn[type] = val;
    };

    this.AddPlace = function(posx, posy, label, markers) {
        var id = this.GetCurrentVertexID();

        this.Graph.AddVertex(
            id,
            new GraphVertex(new PetriNode(id, posx, posy, this.PLACE, label, markers))
        );
        this.placeCurrentID++;

        return this;
    };

    this.AddTransition = function(posx, posy, label) {
        var id = this.GetCurrentVertexID();

        this.Graph.AddVertex(
            id,
            new GraphVertex(new PetriNode(id, posx, posy, this.TRANSITION, label, 0))
        );
        this.transitionCurrentID++;

        return this;
    };

    this.AddConnection = function(source, target, cost) {
        if (this.Graph.GetEdgeBetween(source, target) !== null) {
            return this;
        }

        if (this.Graph.GetVertex(source).GetData().type === this.Graph.GetVertex(target).GetData().type) {
            return this;
        }

        this.Graph.AddEdge(
            source,
            target,
            new GraphEdge(new PetriEdge(cost))
        );

        return this;
    };

    this.RemovePlace = function(id) {
        var key;
        var incidents = this.Graph.GetIncidentEdges(id);

        for (key in incidents) {
            if (incidents.hasOwnProperty(key) !== false) {
                this.Graph.RemoveEdge(key);
            }
        }

        this.Graph.RemoveVertex(id);
        return this;
    };

    this.RemoveTransition = function(id) {
        var key;
        var incidents = this.Graph.GetIncidentEdges(id);

        for (key in incidents) {
            if (incidents.hasOwnProperty(key) !== false) {
                this.Graph.RemoveEdge(key);
            }
        }

        this.Graph.RemoveVertex(id);
        return this;
    };

    this.RemoveConnection = function(source, target) {
        var E;

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
        return P1.label === P2.label && P1.markers === P2.markers;
    };

    this.CompareTransitions = function(T1, T2) {
        return T1.label === T2.label;
    };

    this.CompareConnections = function(C1, C2) {
        return C1.cost === C2.cost;
    };

    return this;
};
