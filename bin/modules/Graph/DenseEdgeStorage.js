var DenseEdgeStorage = function() {
    this.edges      = {};
    this.edgesCount = 0;
    this.edgesRefs  = {};
    this.lastID     = 0;

    this.AddEdge = function(source, target, data) {
        if (this.edges[source] !== undefined && this.edges[target] !== undefined && (this.edges[source][target] !== undefined || this.edges[target][source] !== undefined)) {
            return false;
        }
        this.edges[this.lastID] = { data: data, source: source, target: target };

        if (this.edgesRefs[source] === undefined) { this.edgesRefs[source] = {}; }
        if (this.edgesRefs[target] === undefined) { this.edgesRefs[target] = {}; }

        this.edgesRefs[source][target] = this.lastID;
        this.edgesRefs[target][source] = this.lastID;

        this.lastID++;
        this.edgesCount++;
        return true;
    };

    this.GetEdge = function(id) {
        if (this.edges[id] === undefined) {
            return null;
        }
        return this.edges[id];
    };

    this.RemoveEdge = function(id) {
        if (this.edges[id] === undefined) {
            return false;
        }
        edge = this.edges[id];

        delete this.edgesRefs[edge.source][edge.target];
        delete this.edgesRefs[edge.target][edge.source];
        delete this.edges[id];

        this.edgesCount--;
        return true;
    };

    this.GetEdgesCount = function() {
        return this.edgesCount;
    };

    this.GetEdges = function() {
        return this.edges;
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

    return this;
};

module.exports = DenseEdgeStorage;