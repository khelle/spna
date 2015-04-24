require('../../utils/Array');
var Edge = require('../Edge/Edge');
var Utils = require('../../utils/Utils');

function Vertex(label, markers, priority) {
    this.setLabel(Utils.getValue(label, 'Vertex'))
        .setMarkers(Utils.getValue(markers, 0))
        .setPriority(Utils.getValue(priority, 0))
        .setNeighbours([]);
}

Vertex.prototype = {
    getPriority: function() {
        return this.priority;
    },

    setPriority: function(priority) {
        this.priority = priority;
        return this;
    },

    getLabel: function() {
        return this.label;
    },

    setLabel: function(label) {
        this.label = label;
        return this;
    },

    getMarkers: function() {
        return this.markers;
    },

    setMarkers: function(markers) {
        this.markers = Utils.number(markers);
        return this;
    },

    addMarker: function() {
        this.markers += 1;
        return this;
    },

    addMarkers: function(markers) {
        this.markers += Utils.number(markers);
        return this;
    },

    removeMarker: function() {
        if (this.markers == 0) {
            this.markers = 0;
            return this;
        }

        this.markers -= 1;
        return this;
    },

    removeMarkers: function(markers) {
        if (markers > this.markers) {
            this.markers = 0;
            return this;
        }

        this.markers -= Utils.number(markers);
        return this;
    },

    addNeighbour: function(vertex, weight) {
        validateVertex(vertex);

        this.neighbours.push(new Edge(vertex, weight));
        return this;
    },

    removeNeighbour: function(vertex) {
        validateVertex(vertex);

        var edge = this.getEdge(vertex);

        if (edge) {
            this.neighbours.removeElement(edge);
        }

        return this;
    },

    getNeighbours: function() {
        return this.neighbours;
    },

    /** This function requires an array of Edges */
    setNeighbours: function(neighbours) {
        this.neighbours = neighbours;
    },

    getEdge: function(vertex) {
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