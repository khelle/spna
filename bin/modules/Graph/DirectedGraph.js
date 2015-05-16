var Graph = require('./Graph');
var Class = require('../utils/Class');

var DirectedGraph = function(VerticesStorage, EdgeStorage) {
    Graph.call(this, VerticesStorage, EdgeStorage);

    this.RemoveVertex = function(id) {
        this.RemoveIncomingEdges(id);
        this.RemoveIncidentEdges(id);
        return this.verticesStorage.RemoveVertex(id);
    };

    this.GetIncomingEdges = function(id) {
        return this.edgesStorage.GetIncomingEdges(id);
    };

    this.RemoveIncomingEdges = function(id) {
        return this.edgesStorage.RemoveIncomingEdges(id);
    };

    this.GetEdgeBetween = function(source, target) {
        return this.edgesStorage.GetEdge(this.edgesStorage.GetEdgeBetween(source, target));
    };

    return this;
};

Class.extend(Graph, DirectedGraph);

module.exports = DirectedGraph;