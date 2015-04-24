var Vertex = require('./Vertex');
var Class = require('../../utils/Class');
var Utils = require('../../utils/Utils');

/** Place class*/
function Place(label, markers) {
    Vertex.call(this, Utils.getValue(label, 'Place'));
    this.setMarkers(Utils.getValue(markers, 0));
}

Place.prototype = {
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
function Transition(label, priority) {
    Vertex.call(this, Utils.getValue(label, 'Transition'));
    this.setPriority(Utils.getValue(priority, 0));
}

Transition.prototype = {
    getPriority: function() {
        return this.priority;
    },

    setPriority: function(priority) {
        this.priority = priority;
        return this;
    },

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
