var Vertex = require('./Vertex');
var Class = require('../../utils/Class');
var Utils = require('../../utils/Utils');

/** Place class*/
function Place(ptnGraph, graph, label, position, markers, id, weight) {
    Vertex.call(this, ptnGraph, graph, Utils.getValue(label, 'Place'), position, id);
    this.setMarkers(Utils.getValue(markers, 0));
    this.setWeight(Utils.getValue(weight, 1));
}

Place.prototype = {
    getWeight: function() {
        return this.weight;
    },

    setWeight: function(weight) {
        this.weight = weight;
        return this;
    },

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
        obj.weight = this.getWeight();

        return obj;
    }
};

Class.extend(Vertex, Place);

/** Transition class */
function Transition(ptnGraph, graph, label, position, priority, id) {
    Vertex.call(this, ptnGraph, graph, Utils.getValue(label, 'Transition'), position, id);
    this.setPriority(Utils.getValue(priority, 0));
}

Transition.prototype = {
    getPriority: function() {
        if (this.ptnGraph.hasPriorities()) {
            return this.priority;
        }

        return 1;
    },

    setPriority: function(priority) {
        this.priority = Utils.number(parseInt(priority));
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

        if(tmpPlaces.length == 0) {
            return false;
        }

        for (var i in tmpPlaces) {
            if(tmpPlaces[i].getMarkers() < tmpPlaces[i].getCostTo(this))
                return false;
        }
        return true;
    },

    execute: function() {
        if (!this.canBeExecuted()) {
            throw new Error('This transition (' + this.getLabel() + ') cannot be executed at this time.');
        }
        else {
            var TakingMarkers = this.getReferencing();

            console.log("!!!! TAKING MARKERS" +  TakingMarkers);

            for (var i in TakingMarkers) {
                TakingMarkers[i].removeMarkers(parseInt(TakingMarkers[i].getCostTo(this)));
                console.log("Cost to " + TakingMarkers[i] + " = " + TakingMarkers[i].getCostTo(this));
            }

            var AddingMarkers = this.getNeighbours();
            for (var i in AddingMarkers) {
                var mark = AddingMarkers[i];
                mark.addMarkers(parseInt(this.getCostTo(mark)));
            }
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
