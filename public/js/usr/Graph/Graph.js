Graph = function(VerticesStorage, EdgeStorage) {
    this.verticesStorage = VerticesStorage;
    this.edgesStorage    = EdgeStorage;

    this.Build = function(graph) {
        var vertex;
        var i;

        for (i in graph.vertices) {
            if (graph.vertices.hasOwnProperty(i) !== false) {
                vertex = graph.vertices[i];

                if (vertex.type === 'Place') {

                }
                else if (vertex.type === 'Transition') {

                }
            }
        }
    };

    this.AddVertex = function(id, V) {
        return this.verticesStorage.AddVertex(id, V);
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

    this.GetEdgeBetween = function(source, target) {
        return this.edgesStorage.GetEdgeBetween(source, target);
    };

    this.GetEdgeSource = function(id) {
        return this.edgesStorage.GetEdgeSource(id);
    };

    this.GetEdgeTarget = function(id) {
        return this.edgesStorage.GetEdgeTarget(id);
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

    this.Reset = function() {
        this.edgesStorage.Reset();
        this.verticesStorage.Reset();

        return this;
    };

    return this;
};
