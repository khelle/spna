var ArrayUtils = require('../../utils/Array');
var Edge = require('../Edge/Edge');
var Utils = require('../../utils/Utils');

function Vertex(graph, label) {
    this.id   = -1;
    this.graph = graph;
    this.setLabel(Utils.getValue(label, 'Vertex'));
}

Vertex.prototype = {
    getId: function() {
        return this.id;
    },

    getLabel: function() {
        return this.label;
    },

    setLabel: function(label) {
        this.label = label;
        return this;
    },

    addNeighbour: function(vertex, weight) {
        validateVertex(vertex);

        this.graph.AddEdge(this, vertex, {weight: Utils.getValue(weight, 1)});
        return this;
    },

    removeNeighbour: function(vertex) {
        validateVertex(vertex);

        this.graph.RemoveEdge(this.getEdgeTo(vertex));
        return this;
    },

    clearNeighbours: function() {
        this.graph.RemoveIncidentEdges(this);
        return this;
    },

    getNeighbours: function() {
        return this.graph.GetNeighbours(this);
    },

    getReferencing: function() {
        return this.graph.GetReferencing(this);
    },

    getEdgeTo: function(vertex) {
        return this.graph.GetEdgeBetween(this, vertex);
    },

    getCostTo: function(vertex) {
        try {
            return this.getEdgeTo(vertex).data.weight;
        } catch (e) {
            return null;
        }
    },

    toString: function() {
        return this.getLabel();
    }
};

function validateVertex(argument) {
    if (!(argument instanceof Vertex)) {
        throw new Error('Argument must be an instance of Vertex');
    }
}

module.exports = Vertex;