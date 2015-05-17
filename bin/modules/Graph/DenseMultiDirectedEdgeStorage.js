var DenseMultiDirectedEdgeStorage = function() {
    this.edges      = {};
    this.edgesCount = 0;
    this.outRefs  = {};
    this.inRefs = {};
    this.lastID     = 0;

    this.AddEdge = function(source, target, data) {
        if (this.edges[source] !== undefined && this.edges[target] !== undefined && (this.edges[source][target] !== undefined || this.edges[target][source] !== undefined)) {
            return false;
        }

        var id = this.lastID;
        this.edges[this.lastID] = { data: data, source: source, target: target };

        if (this.outRefs[source] === undefined) { this.outRefs[source] = {}; }
        if (this.inRefs[target] === undefined) { this.inRefs[target] = {}; }
        if (this.outRefs[source][target] === undefined) { this.outRefs[source][target] = []; }
        if (this.inRefs[target][source] === undefined) { this.inRefs[target][source] = []; }

        this.outRefs[source][target].push(this.lastID);
        this.inRefs[target][source].push(this.lastID);

        this.lastID++;
        this.edgesCount++;

        return id;
    };

    this.GetEdge = function(id) {
        if (this.edges[id] === undefined) {
            return null;
        }
        return this.edges[id];
    };

    this.GetEdgeBetween = function(source, target) {
        try {
            return this.outRefs[source][target][0];
        } catch (e) {
            return null;
        }
    };

    this.GetEdgesBetween = function(source, target) {
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

        var inRefs = this.outRefs[edge.source][edge.target];
        var outRefs = this.inRefs[edge.target][edge.source];

        inRefs.splice(inRefs.indexOf(id),1);
        outRefs.splice(outRefs.indexOf(id),1);
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
            if (this.outRefs[id][i] === undefined) {
                continue;
            }

            for (var e in this.outRefs[id][i]) {
                arr.push(this.GetEdge(this.outRefs[id][i][e]));
            }
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
            if (this.inRefs[id][i] === undefined) {
                continue;
            }

            for (var e in this.inRefs[id][i]) {
                arr.push(this.GetEdge(this.inRefs[id][i][e]));
            }
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

module.exports = DenseMultiDirectedEdgeStorage;