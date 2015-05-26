var Vertex = require('./Vertex');
var Class = require('../../utils/Class');
var Utils = require('../../utils/Utils');

/** Place class*/
function Place(graph, label, position, markers) {
    Vertex.call(this, graph, Utils.getValue(label, 'Place'), position);
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

    incrementMarker: function() {
        return this.addMarkers(1);
    },

    decrementMarker: function() {
        return this.removeMarkers(1);
    },

    addMarkers: function(markers) {
        this.markers += Utils.number(markers);
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

    connect: function(transition, weight) {
        validateTransition(transition);

        return this.addNeighbour(transition, weight);
    },

    disconnect: function(transition) {
        validateTransition(transition);

        return this.removeNeighbour(transition);
    },

    export: function() {
        var obj = Vertex.prototype.export.apply(this);

        obj.type = 'Place';
        obj.markers = this.getMarkers();

        return obj;
    }
};

Class.extend(Vertex, Place);

/** Transition class */
function Transition(graph, label, position, priority) {
    Vertex.call(this, graph, Utils.getValue(label, 'Transition'), position);
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

    connect: function(place, weight) {
        validatePlace(place);

        return this.addNeighbour(place, weight);
    },

    disconnect: function(place) {
        validatePlace(place);

        return this.removeNeighbour(place);
    },

    /*
    Return true if this transition can be executed at this network stance
     */
    canBeExecuted: function() {
        var tmpPlaces = this.getReferencing();

        for (var i in tmpPlaces) {
            if(tmpPlaces[i].getMarkers() < tmpPlaces[i].getCostTo(this))
                return false;
        }
        return true;
    },

    export: function() {
        var obj = Vertex.prototype.export.apply(this);

        obj.type = 'Transition';
        obj.priority = this.getPriority();

        return obj;
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
