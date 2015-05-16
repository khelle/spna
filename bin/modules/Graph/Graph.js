var Graph = function(VerticesStorage, EdgeStorage) {
    this.verticesStorage = VerticesStorage;
    this.edgesStorage    = EdgeStorage;

    this.AddVertex = function(id) {
        return this.verticesStorage.AddVertex(id);
    };

    this.GetVertex = function(id) {
        return this.verticesStorage.GetVertex(id);
    };

    this.GetNeighbours = function(id) {
        var neighbours = [];
        this.GetIncidentEdges(id).forEach(function(edge) {
            neighbours.push(this.GetVertex(edge.target));
        }, this);

        return neighbours;
    };

    this.GetReferencing = function(id) {
        var neighbours = [];
        this.GetIncomingEdges(id).forEach(function(edge) {
            neighbours.push(this.GetVertex(edge.source));
        }, this);

        return neighbours;
    };

    this.RemoveVertex = function(id) {
        this.RemoveIncidentEdges(id);
        return this.verticesStorage.RemoveVertex(id);
    };

    this.GetVertices = function() {
        return this.verticesStorage.GetVertices();
    };

    this.GetVerticesCount = function() {
        return this.verticesStorage.GetVerticesCount();
    };

    this.GetVertexDegree = function(id) {
        return this.edgesStorage.GetVertexDegree(id);
    };

    this.AddEdge = function(source, target, E) {
        return this.edgesStorage.AddEdge(source, target, E);
    };

    this.GetEdge = function(id) {
        return this.edgesStorage.GetEdge(id);
    };

    this.GetIncidentEdges = function(id) {
        return this.edgesStorage.GetIncidentEdges(id);
    };

    this.RemoveEdge = function(id) {
        return this.edgesStorage.RemoveEdge(id);
    };

    this.RemoveEdgeBetween = function(source, target) {
        var id = this.edgesStorage.GetEdgeBetween(source, target);
        return this.RemoveEdge(id);
    };

    this.RemoveIncidentEdges = function(id) {
        return this.edgesStorage.RemoveIncidentEdges(id);
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