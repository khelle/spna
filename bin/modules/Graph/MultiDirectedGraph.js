var DirectedGraph = require('./DirectedGraph');
var EdgesStorage = require('./DenseMultiDirectedEdgeStorage');
var Class = require('../utils/Class');

var MultiDirectedGraph = function(VerticesStorage) {
    DirectedGraph.call(this, VerticesStorage, new EdgesStorage());

    this.GetEdgesBetween = function(source, target) {
        var edgesIds = this.edgesStorage.GetEdgesBetween(source, target);
        var edges = [];

        for (var i in edgesIds) {
            edges.push(this.edgesStorage.GetEdge(edgesIds[i]));
        }

        return edges;
    };

    return this;
};

Class.extend(DirectedGraph, MultiDirectedGraph);

module.exports = MultiDirectedGraph;