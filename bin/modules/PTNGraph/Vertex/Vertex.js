var ArrayUtils = require('../../utils/Array');
var Edge = require('../Edge/Edge');
var Utils = require('../../utils/Utils');

function Vertex(graph, label, position) {
    this.id   = -1;
    this.graph = graph;
    this.position = Utils.position(position);
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

    getPosition: function() {
        return this.position;
    },

    setPosition: function(position) {
        this.position = position;
        return this;
    },

    addNeighbour: function(vertex, weight) {
        validateVertex(vertex);

        return this.graph.AddEdge(this.id, vertex.id, {weight: Utils.getValue(weight, 1)});
    },

    removeNeighbour: function(vertex) {
        validateVertex(vertex);

        return this.graph.RemoveEdgeBetween(this.id, vertex.id);
    },

    clearNeighbours: function() {
        this.graph.RemoveIncidentEdges(this.id);
        return this;
    },

    getNeighbours: function() {
        return this.graph.GetNeighbours(this.id);
    },

    getReferencing: function() {
        return this.graph.GetReferencing(this.id);
    },

    getEdgeTo: function(vertex) {
        return this.graph.GetEdgeBetween(this.id, vertex.id);
    },

    getCostTo: function(vertex) {
        try {
            return this.getEdgeTo(vertex).data.weight;
        } catch (e) {
            return null;
        }
    },

    export: function() {
        var obj = {type: 'Vertex', id: this.id, label: this.label, position: this.position, neighbours: []};

        var neighbours = this.getNeighbours();
        for (var i in neighbours) {
            obj.neighbours.push({id: neighbours[i].id, weight: this.getCostTo(neighbours[i])});
        }

        return obj;
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