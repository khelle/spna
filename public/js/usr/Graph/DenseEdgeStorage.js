var DenseEdgeStorage = function() {
    this.edges      = {};
    this.edgesCount = 0;
    this.edgesRefs  = {};
    this.lastID     = 0;

    this.AddEdge = function(id1, id2, E) {
        if (this.edges[id1] !== undefined && this.edges[id2] !== undefined && (this.edges[id1][id2] !== undefined || this.edges[id2][id1] !== undefined)) {
            return false;
        }

        E.id = this.lastID;
        this.edges[this.lastID] = { obj: E, id1: id1, id2: id2 };

        if (this.edgesRefs[id1] === undefined) { this.edgesRefs[id1] = {}; }
        if (this.edgesRefs[id2] === undefined) { this.edgesRefs[id2] = {}; }

        this.edgesRefs[id1][id2] = this.lastID;
        this.edgesRefs[id2][id1] = this.lastID;

        this.lastID++;
        this.edgesCount++;
        return true;
    };

    this.GetEdge = function(id) {
        if (this.edges[id] === undefined) {
            return null;
        }
        return this.edges[id].obj;
    };

    this.GetEdgeBetween = function(source, target) {
        if (this.edgesRefs[source] === undefined || this.edgesRefs[source][target] === undefined) {
            return null;
        }

        return this.GetEdge(this.edgesRefs[source][target]);
    };

    this.RemoveEdge = function(id) {
        if (this.edges[id] === undefined) {
            return false;
        }
        edge = this.edges[id];

        delete this.edgesRefs[edge.id1][edge.id2];
        delete this.edgesRefs[edge.id2][edge.id1];
        delete this.edges[id];

        this.edgesCount--;
        return true;
    };

    this.GetEdgesCount = function() {
        return this.edgesCount;
    };

    this.GetEdges = function() {
        var key;
        var results = {};

        for (key in this.edges) {
            if (this.edges.hasOwnProperty(key)) {
                results[key] = this.edges[key].obj;
            }
        }

        return results;
    };

    this.GetVertexDegree = function(id) {
        if (this.edgesRefs[id] === undefined) {
            return 0;

        } else {
            cnt = 0;

            for (i in this.edgesRefs[id]) {
                cnt++;
            }

            return cnt;
        }
    };

    this.GetIncidentEdges = function(id) {
        if (this.edgesRefs[id] === undefined) {
            return [];
        }

        arr = [];
        for (i in this.edgesRefs[id]) {
            arr.push(this.edgesRefs[id][i]);
        }

        return arr;
    };

    this.RemoveIncidentEdges = function(id) {
        if (this.edgesRefs[id] === undefined) {
            return false;
        }

        for (i in this.edgesRefs[id]) {
            this.RemoveEdge(this.edgesRefs[id][i]);
        }
        return true;
    };

    this.GetEdgeSource = function(id) {
        if (this.edges[id] === undefined) {
            return false;
        }
        return this.edges[id].id1;
    };

    this.GetEdgeTarget = function(id) {
        if (this.edges[id] === undefined) {
            return false;
        }
        return this.edges[id].id2;
    };

    this.Reset = function() {
        this.edges      = {};
        this.edgesCount = 0;
        this.edgesRefs  = {};
        this.lastID     = 0;
    };

    return this;
};
