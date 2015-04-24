require('../utils/Array');
var Utils = require('../utils/Utils');
var PTNVertex = require('./Vertex/PTNVertex');
var Transition = PTNVertex.Transition;
var Place = PTNVertex.Place;

function PTNGraph(name) {
    this.setName(Utils.getValue(name, 'Graph'))
        .setPlaces([])
        .setTransitions([]);
}

PTNGraph.prototype = {
    importGraph: function(places, transitions) {
        this.setPlaces(places).setTransitions(transitions);
        return this;
    },

    getName: function() {
        return this.name;
    },

    setName: function(name) {
        this.name = name;
        return this;
    },

    getPlaces: function() {
        return this.places;
    },

    setPlaces: function(places) {
        this.places = Utils.array(places);
        return this;
    },

    createPlace: function(label, markers, priority) {
        var place = new Place(label, markers, priority);
        this.places.push(place);

        return place;
    },

    getTransitions: function() {
        return this.transitions;
    },

    setTransitions: function(transitions) {
        this.transitions = Utils.array(transitions);
        return this;
    },

    createTransition: function(label, markers, priority) {
        var transition = new Transition(label, markers, priority);
        this.transitions.push(transition);

        return transition;
    },

    removeVertex: function(vertex) {
        vertex.clearNeighbours();

        if (vertex instanceof Place) {
            this.places.removeElement(vertex);
            return vertex;
        }

        this.transitions.removeElement(vertex);
        return vertex;
    },

    print: function() {
        var string = 'Graph: ' + this.name;

        string += "\nPlaces:\n\t";

        this.places.forEach(function(place) {
            string += place + '( ' + place.getNeighbours() + ' ), ';
        });

        string += "\nTransitions:\n\t";

        this.transitions.forEach(function(transition) {
            string += transition + '( ' + transition.getNeighbours() + ' ), ';
        });

        return string + "\n";
    },

    toString: function() {
        return this.getName();
    }
};

module.exports = PTNGraph;

