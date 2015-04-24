var Utils = require('../../utils/Utils');

function Edge(vertex, weight) {
    this.setVertex(vertex).setWeight(Utils.getValue(weight, 1));
}

Edge.prototype = {
    getVertex: function() {
        return this.vertex;
    },

    setVertex: function(vertex) {
        this.vertex = vertex;
        return this;
    },

    hasVertex: function(vertex) {
        return this.vertex == vertex;
    },

    getWeight: function() {
        return this.weight;
    },

    setWeight: function(weight) {
        this.weight = Utils.number(weight);
        return this;
    },

    toString: function() {
        return this.getVertex() + '[' + this.getWeight() + ']';
    }
};

module.exports = Edge;