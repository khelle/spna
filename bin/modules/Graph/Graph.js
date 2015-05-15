Graph = function(VerticesStorage, EdgeStorage) {
    this.verticesStorage = new VerticesStorage();
    this.edgesStorage    = new EdgeStorage();

    this.AddVertex = function(V) {
        return this.verticesStorage.AddVertex(V);
    };

    this.SetVertex = function(id, V) {
        return this.verticesStorage.AddVertex(V);
    };

    this.GetVertex = function(id) {
        return this.verticesStorage.GetVertex(id);
    };

    this.RemoveVertex = function(id) {
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

    this.AddEdge = function(id1, id2, E) {
        E.id = this.GetEdgesCount() + 1;
        return this.edgesStorage.AddEdge(id1, id2, E);
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