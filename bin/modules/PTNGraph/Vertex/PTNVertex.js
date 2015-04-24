var Vertex = require('./Vertex');
var Class = require('../../utils/Class');
var Utils = require('../../utils/Utils');

/** Place class*/
function Place(label, markers, priority) {
    Vertex.call(this, Utils.getValue(label, 'Place'), markers, priority);
}

Place.prototype = {
    connectTransition: function(transition, weight) {
        validateTransition(transition);

        this.addNeighbour(transition, weight);
        return this;
    },

    disconnectTransition: function(transition) {
        validateTransition(transition);

        this.removeNeighbour(transition);
        return this;
    },

    connectToTransition: function(transition, weight) {
        validateTransition(transition);

        transition.addNeighbour(this, weight);
        return this;
    },

    disconnectFromTransition: function(transition) {
        validateTransition(transition);

        transition.removeNeighbour(this);
        return this;
    }
};

Class.extend(Vertex, Place);

/** Transition class */
function Transition(label, markers, priority) {
    Vertex.call(this, Utils.getValue(label, 'Transition'), markers, priority);
}

Transition.prototype = {
    connectPlace: function(place, weight) {
        validatePlace(place);

        this.addNeighbour(place, weight);
        return this;
    },

    disconnectPlace: function(place) {
        validatePlace(place);

        this.removeNeighbour(place);
        return this;
    },

    connectToPlace: function(place, weight) {
        validatePlace(place);

        place.addNeighbour(this, weight);
        return this;
    },

    disconnectFromPlace: function(place) {
        validatePlace(place);

        place.removeNeighbour(this);
        return this;
    }
};

Class.extend(Vertex, Transition);

/** Argument validators */
function validatePlace(argument) {
    if (!(argument instanceof Place)) {
        throw new Error('Argument must be an instance of Place');
    }
}

function validateTransition(argument) {
    if (!(argument instanceof Transition)) {
        throw new Error('Argument must be an instance of Transition');
    }
}

/** Export */
exports.Place = Place;
exports.Transition = Transition;
