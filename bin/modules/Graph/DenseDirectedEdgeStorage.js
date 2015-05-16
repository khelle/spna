var DenseDirectedEdgeStorage = function() {
    this.edges      = {};
    this.edgesCount = 0;
    this.outRefs  = {};
    this.inRefs = {};
    this.lastID     = 0;

    this.AddEdge = function(source, target, data) {
        if (this.edges[source] !== undefined && this.edges[target] !== undefined && (this.edges[source][target] !== undefined || this.edges[target][source] !== undefined)) {
            return false;
        }

        this.edges[this.lastID] = { data: data, source: source, target: target };

        if (this.outRefs[source] === undefined) { this.outRefs[source] = {}; }
        if (this.inRefs[target] === undefined) { this.inRefs[target] = {}; }

        this.outRefs[source][target] = this.lastID;
        this.inRefs[target][source] = this.lastID;

        this.lastID++;
        this.edgesCount++;

        return true;
    };

    this.GetEdge = function(id) {
        if (this.edges[id] === undefined) {
            return false;
        }
        return this.edges[id];
    };

    this.GetEdgeBetween = function(source, target) {
        try {
            return this.outRefs[source][target];
        } catch (e) {
            return null;
        }
    };

    this.RemoveEdge = function(id) {
        if (this.edges[id] === undefined) {
            return false;
        }

        var edge = this.edges[id];

        delete this.outRefs[edge.source][edge.target];
        delete this.inRefs[edge.target][edge.source];
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
        return this.GetIncidentEdges(id).length + this.GetIncomingEdges(id).length;
    };

    this.GetIncidentEdges = function(id) {
        if (this.outRefs[id] === undefined) {
            return [];
        }

        var arr = [];
        for (var i in this.outRefs[id]) {
            arr.push(this.GetEdge(this.outRefs[id][i]));
        }

        return arr;
    };

    this.RemoveIncidentEdges = function(id) {
        this.GetIncidentEdges(id).forEach(function(edge) {
            this.RemoveEdge(this.GetEdgeBetween(edge.source, edge.target));
        }, this);

        return true;
    };

    this.GetIncomingEdges = function(id) {
        if (this.inRefs[id] === undefined) {
            return [];
        }

        var arr = [];
        for (var i in this.inRefs[id]) {
            arr.push(this.GetEdge(this.inRefs[id][i]));
        }

        return arr;
    };

    this.RemoveIncomingEdges = function(id) {
        this.GetIncomingEdges(id).forEach(function(edge) {
            this.RemoveEdge(this.GetEdgeBetween(edge.source, edge.target));
        }, this);

        return true;
    };

    return this;
};

module.exports = DenseDirectedEdgeStorage;