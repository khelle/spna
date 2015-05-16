var Graph = function(VerticesStorage, EdgeStorage) {
    this.verticesStorage = VerticesStorage;
    this.edgesStorage    = EdgeStorage;

    this.AddVertex = function(V) {
        return this.verticesStorage.AddVertex(V);
    };

    this.GetVertex = function(id) {
        return this.verticesStorage.GetVertex(id);
    };

    this.GetNeighbours = function(V) {
        var neighbours = [];
        this.GetIncidentEdges(V).forEach(function(edge) {
            neighbours.push(this.GetVertex(edge.target));
        }, this);

        return neighbours;
    };

    this.GetReferencing = function(V) {
        var neighbours = [];
        this.GetIncomingEdges(V).forEach(function(edge) {
            neighbours.push(this.GetVertex(edge.source));
        }, this);

        return neighbours;
    };

    this.RemoveVertex = function(V) {
        this.RemoveIncidentEdges(V.id);
        return this.verticesStorage.RemoveVertex(V.id);
    };

    this.GetVertices = function() {
        return this.verticesStorage.GetVertices();
    };

    this.GetVerticesCount = function() {
        return this.verticesStorage.GetVerticesCount();
    };

    this.GetVertexDegree = function(V) {
        return this.edgesStorage.GetVertexDegree(V.id);
    };

    this.AddEdge = function(Vsource, Vtarget, E) {
        return this.edgesStorage.AddEdge(Vsource.id, Vtarget.id, E);
    };

    this.GetEdge = function(id) {
        return this.edgesStorage.GetEdge(id);
    };

    this.GetIncidentEdges = function(V) {
        return this.edgesStorage.GetIncidentEdges(V.id);
    };

    this.RemoveEdge = function(Edge) {
        var id = this.edgesStorage.GetEdgeBetween(Edge.source, Edge.target);
        return this.edgesStorage.RemoveEdge(id);
    };

    this.RemoveIncidentEdges = function(V) {
        return this.edgesStorage.RemoveIncidentEdges(V.id);
    };

    this.GetEdgesCount = function() {
        return this.edgesStorage.GetEdgesCount();
    };

    this.GetEdges = function() {
        return this.edgesStorage.GetEdges();
    };

    return this;
};

module.exports = Graph;