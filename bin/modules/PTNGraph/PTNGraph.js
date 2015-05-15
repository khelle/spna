var ArrayUtils = require('../utils/Array');
var Utils = require('../utils/Utils');
var State = require('../State/State');
//var Graph = require('../Graph');
//var VertexStorage = require('../Graph/DefaultVertexStorage');
//var EdgeStorage = require('../Graph/DenseEdgeStorage');
var PTNVertex = require('./Vertex/PTNVertex');
var Transition = PTNVertex.Transition;
var Place = PTNVertex.Place;

function PTNGraph(name) {
    //this.graph = new Graph(VertexStorage, EdgeStorage);
    this.setName(Utils.getValue(name, 'Graph'))
        .setPlaces([])
        .setTransitions([]);
}

PTNGraph.prototype = {
    importGraph: function (places, transitions) {
        this.setPlaces(places).setTransitions(transitions);
        return this;
    },

    getName: function () {
        return this.name;
    },

    setName: function (name) {
        this.name = name;
        return this;
    },

    getPlaces: function () {
        return this.places;
    },

    setPlaces: function (places) {
        this.places = Utils.array(places);
        return this;
    },

    createPlace: function (label, markers, priority) {
        var place = new Place(label, markers, priority);
        //this.graph.AddVertex(place);
        this.places.push(place);

        return place;
    },

    getTransitions: function () {
        return this.transitions;
    },

    setTransitions: function (transitions) {
        this.transitions = Utils.array(transitions);
        return this;
    },

    createTransition: function (label, markers, priority) {
        var transition = new Transition(label, markers, priority);
        this.transitions.push(transition);

        return transition;
    },

    removeVertex: function (vertex) {
        vertex.clearNeighbours();

        if (vertex instanceof Place) {
            return ArrayUtils.removeElement(this.places, vertex);
        }

        return ArrayUtils.removeElement(this.transitions, vertex);
    },


    /*
     Finds and returns array of all transitions that can be executed at this stance of network
     */
    findTransitionsToExecute: function () {

        var ExecutableTransitions = [];
        this.transitions.forEach(function (transition) {
            if (transition.canBeExecuted())
                ExecutableTransitions.push(transition);
        });
        return ExecutableTransitions;
    },

    /*
     Executes target transition
     */
    executeTransition: function (transition) {

        if (!transition.canBeExecuted()) {
            throw new Error('This trainsition (' + transition.label + ') cannot be executed at this time.');
        }
        else {
            var TakingMarkers = transition.getReferencedBy();
            for (var i in TakingMarkers) {
                TakingMarkers[i].removeMarkers(TakingMarkers[i].getEdgeTo(transition).getWeight());
            }

            var AddingMarkers = transition.getNeighbours();
            for (var i in AddingMarkers) {
                var mark = AddingMarkers[i].getVertex();
                //AddingMarkers[i].addMarkers( transition.getEdgeTo(AddingMarkers[i]).getWeight() );
                mark.addMarkers(AddingMarkers[i].getWeight());
            }
        }
    },

    /*
     Return structure State for current state of network
     */
    getState: function() {
        return new State(this.getPlaces());
    },

    /*
     Changes all marks according to given state
     */
    modifyMarkersByState: function(state) {

        var allPlaces = this.getPlaces();
        for (var i in allPlaces) {
            allPlaces[i].setMarkers( state.getState()[i] );
        }

        return true;
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

