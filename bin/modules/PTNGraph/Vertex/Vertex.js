var ArrayUtils = require('../../utils/Array');
var Edge = require('../Edge/Edge');
var Utils = require('../../utils/Utils');

function Vertex(label) {
    this.id   = -1;
    this.setLabel(Utils.getValue(label, 'Vertex')).initialize();
}

Vertex.prototype = {
    initialize: function() {
        this.neighbours = [];
        this.referencedBy = [];
    },

    setId: function(id) {
        this.id = id;
    },

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

        this.neighbours.push(new Edge(vertex, weight));
        vertex.addReferencedBy(this);
        return this;
    },

    removeNeighbour: function(vertex) {
        validateVertex(vertex);

        var edge = this.getEdgeTo(vertex);

        if (edge) {
            ArrayUtils.removeElement(this.neighbours, edge);
            vertex.removeReferencedBy(this);
        }

        return this;
    },

    clearNeighbours: function() {
        this.neighbours.forEach(function(edge) {
            this.removeNeighbour(edge.getVertex());
        }, this);

        this.referencedBy.forEach(function(vertex) {
            vertex.removeNeighbour(this);
        }, this);

        return this;
    },

    getNeighbours: function() {
        return this.neighbours;
    },

    addReferencedBy: function(vertex) {
        validateVertex(vertex);

        this.referencedBy.push(vertex);
        return this;
    },

    removeReferencedBy: function(vertex) {
        validateVertex(vertex);

        ArrayUtils.removeElement(this.referencedBy, vertex);
        return this;
    },

    getReferencedBy: function() {
        return this.referencedBy;
    },

    getEdgeTo: function(vertex) {
        for (var i in this.neighbours) {
            if (this.neighbours[i].hasVertex(vertex)) {
                return this.neighbours[i];
            }
        }

        return null;
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