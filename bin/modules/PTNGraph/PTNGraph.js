var ArrayUtils = require('../utils/Array');
var Utils = require('../utils/Utils');
var Graph = require('../Graph/DirectedGraph');
var VertexStorage = require('../Graph/TypedVertexStorage');
var EdgeStorage = require('../Graph/DenseDirectedEdgeStorage');
var PTNVertex = require('./Vertex/PTNVertex');
var Transition = PTNVertex.Transition;
var Place = PTNVertex.Place;

function PTNGraph(name) {
    this.graph = new Graph(new VertexStorage(['Place', 'Transition']), new EdgeStorage());
    this.setName(Utils.getValue(name, 'Graph'));
}

PTNGraph.prototype = {
    getName: function() {
        return this.name;
    },

    setName: function(name) {
        this.name = name;
        return this;
    },

    getPlaces: function() {
        return this.graph.GetVertices()['Place'];
    },

    createPlace: function(label, markers, priority) {
        return this.graph.AddVertex(new Place(this.graph, label, markers, priority));
    },

    getTransitions: function() {
        return this.graph.GetVertices()['Transition'];
    },

    createTransition: function(label, markers, priority) {
        return this.graph.AddVertex(new Transition(this.graph, label, markers, priority));
    },

    removeVertex: function(vertex) {
        this.graph.RemoveVertex(vertex);

        return this;
    },

    /*
    Finds and returns array of all transitions that can be executed at this stance of network
     */
    findTransitionsToExecute: function() {

        var ExecutableTransitions = [];
        this.getTransitions().forEach(function(transition) {
            if(transition.canBeExecuted())
                ExecutableTransitions.push(transition);
        });
        return ExecutableTransitions;
    },

    /*
    Executes target transition (swaps their
     */
    executeTransition: function(transition) {

        if(!transition.canBeExecuted()) {
            throw new Error('This trainsition (' + transition.label + ') cannot be executed at this time.' );
        }
        else {
            var TakingMarkers = transition.getReferencedBy();
            for (var i in TakingMarkers) {
                TakingMarkers[i].removeMarkers( TakingMarkers[i].getEdgeTo(transition).getWeight() );
            }

            var AddingMarkers = transition.getNeighbours();
            for (var i in AddingMarkers) {
                var mark = AddingMarkers[i].getVertex();
                //AddingMarkers[i].addMarkers( transition.getEdgeTo(AddingMarkers[i]).getWeight() );
                mark.addMarkers( AddingMarkers[i].getWeight() );
            }
        }
    },


    print: function() {
        var string = 'Graph: ' + this.name;

        string += "\nPlaces:\n\t";

        var places = this.getPlaces();
        for (var i in places) {
            string += places[i] + '( ' + places[i].getNeighbours() + ' ), ';
        }

        string += "\nTransitions:\n\t";

        var transitions = this.getTransitions();
        for (var i in transitions) {
            string += transitions[i] + '( ' + transitions[i].getNeighbours() + ' ), ';
        }

        return string + "\n";
    },

    toString: function() {
        return this.getName();
    }
};

module.exports = PTNGraph;

