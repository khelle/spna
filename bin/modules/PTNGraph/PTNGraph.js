var PTNVertex = require('./Vertex/PTNVertex');
var Transition = PTNVertex.Transition;
var Place = PTNVertex.Place;
var Utils = require('../utils/Utils.js');

function PTNGraph(name, places, transitions) {
    this.setName(Utils.getValue(name, 'Graph'))
        .setPlaces(Utils.getValue(places, []))
        .setTransitions(Utils.getValue(transitions, []));
}

PTNGraph.prototype = {
    getName: function() {
        return this.name;
    },

    setName: function(name) {
        this.name = name;
    },

    getPlaces: function() {
        return this.places;
    },

    setPlaces: function(places) {
        this.places = Utils.array(places);
    },

    getTransitions: function() {
        return this.transitions;
    },

    setTransitions: function(transitions) {
        this.transitions = Utils.array(transitions);
    },

    toString: function() {
        return this.getName();
    }
};

module.exports = PTNGraph;

