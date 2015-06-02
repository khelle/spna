var DirectedDenseEdgeStorage = function() {
    this.edges      = {};
    this.edgesCount = 0;
    this.edgesIn    = {};
    this.edgesOut   = {};
    this.lastID     = 0;

    this.AddEdge = function(id1, id2, E) {
        if (this.edges[id1] !== undefined && this.edges[id1][id2] !== undefined) {
            return false;
        }

        if (E.id === -1) {
            E.id = this.lastID;
        }

        this.edges[this.lastID] = { obj: E, id1: id1, id2: id2 };

        if (this.edgesIn[id1] === undefined) { this.edgesIn[id1] = {}; }
        if (this.edgesOut[id2] === undefined) { this.edgesOut[id2] = {}; }

        this.edgesIn[id1][id2] = this.lastID;
        this.edgesOut[id2][id1] = this.lastID;

        if (E.id >= this.lastID) {
            this.lastID = E.id + 1;
        }
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
        if (this.edgesIn[source] === undefined || this.edgesIn[source][target] === undefined) {
            return null;
        }

        return this.GetEdge(this.edgesIn[source][target]);
    };

    this.RemoveEdge = function(id) {
        if (this.edges[id] === undefined) {
            return false;
        }
        edge = this.edges[id];

        delete this.edgesIn[edge.id1][edge.id2];
        delete this.edgesOut[edge.id2][edge.id1];
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
        var i;

        if (this.edgesIn[id] === undefined) {
            return 0;

        } else {
            cnt = 0;

            for (i in this.edgesIn[id]) {
                cnt++;
            }

            return cnt;
        }
    };

    this.GetIncidentEdges = function(id) {
        var i;
        var arr;

        arr = [];

        if (this.edgesIn[id] !== undefined) {
            for (i in this.edgesIn[id]) {
                arr.push(this.edgesIn[id][i]);
            }
        }

        if (this.edgesOut[id] !== undefined) {
            for (i in this.edgesOut[id]) {
                arr.push(this.edgesOut[id][i]);
            }
        }

        return arr;
    };

    this.RemoveIncidentEdges = function(id) {
        var i;

        if (this.edgesIn[id] === undefined) {
            return false;
        }

        for (i in this.edgesIn[id]) {
            this.RemoveEdge(this.edgesIn[id][i]);
        }

        for (i in this.edgesOut[id]) {
            this.RemoveEdge(this.edgesOut[id][i]);
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
        this.edgesIn    = {};
        this.edgesOut   = {};
        this.lastID     = 0;

        return this;
    };

    return this;
};
