var Graph = require('./Graph');
var Class = require('../utils/Class');

var DirectedGraph = function(VerticesStorage, EdgeStorage) {
    Graph.call(this, VerticesStorage, EdgeStorage);

    this.RemoveVertex = function(V) {
        this.RemoveIncomingEdges(V);
        this.RemoveIncidentEdges(V);
        return this.verticesStorage.RemoveVertex(V.id);
    };

    this.GetIncomingEdges = function(V) {
        return this.edgesStorage.GetIncomingEdges(V.id);
    };

    this.RemoveIncomingEdges = function(V) {
        return this.edgesStorage.RemoveIncomingEdges(V.id);
    };

    this.GetEdgeBetween = function(Vsource, Vtarget) {
        return this.edgesStorage.GetEdge(this.edgesStorage.GetEdgeBetween(Vsource.id, Vtarget.id));
    };

    return this;
};

Class.extend(Graph, DirectedGraph);

module.exports = DirectedGraph;