var Utils = require('../utils/Utils');
var Graph = require('../Graph/DirectedGraph');
var VertexStorage = require('../Graph/TypedVertexStorage');
var EdgeStorage = require('../Graph/DenseDirectedEdgeStorage');
var State = require('../State/State');
var PTNVertex = require('./Vertex/PTNVertex');
var Transition = PTNVertex.Transition;
var Place = PTNVertex.Place;

function PTNGraph(name) {
    this.graph = new Graph(new VertexStorage(['Place', 'Transition']), new EdgeStorage());
    this.setName(Utils.getValue(name, 'Graph'));
}

PTNGraph.prototype = {
    getName: function () {
        return this.name;
    },

    setName: function (name) {
        this.name = name;
        return this;
    },

    getPlaces: function() {
        return this.graph.GetVertices()['Place'];
    },

    createPlace: function(label, markers) {
        return this.graph.AddVertex(new Place(this.graph, label, markers));
    },

    getTransitions: function() {
        return this.graph.GetVertices()['Transition'];
    },

    createTransition: function(label, priority) {
        return this.graph.AddVertex(new Transition(this.graph, label, priority));
    },

    removeVertex: function(vertex) {
        this.graph.RemoveVertex(vertex.id);
        return this;
    },

    /*
     Finds and returns array of all transitions that can be executed at this stance of network
     */
    findTransitionsToExecute: function () {
        var ExecutableTransitions = [];
        var transitions = this.getTransitions();

        for (var i in transitions) {
            if(transitions[i].canBeExecuted()) {
                ExecutableTransitions.push(transitions[i]);
            }
        }

        return ExecutableTransitions;
    },

    /*
     Executes target transition
     */
    executeTransition: function (transition) {

        if (!transition.canBeExecuted()) {
            throw new Error('This transition (' + transition.getLabel() + ') cannot be executed at this time.');
        }
        else {
            var TakingMarkers = transition.getReferencing();
            for (var i in TakingMarkers) {
                TakingMarkers[i].removeMarkers(TakingMarkers[i].getCostTo(transition));
            }

            var AddingMarkers = transition.getNeighbours();
            for (var i in AddingMarkers) {
                var mark = AddingMarkers[i];
                mark.addMarkers(transition.getCostTo(mark));
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
    setState: function(state) {
        var allPlaces = this.getPlaces();
        for (var i in allPlaces) {
            allPlaces[i].setMarkers( state.getState()[i] );
        }

        //console.log( "!!!!=======================");
        //console.log( state.print() );
        //console.log( "=SPLIT!!!================");
        //console.log( allPlaces );
        //console.log( "!!!!=======================");

        return true;
    },


    print: function() {
        var string = 'Graph: ' + this.name;

        string += "\nPlaces:\n\t";

        var places = this.getPlaces();
        for (var i in places) {
            string += places[i] + '( ' + places[i].getNeighbours() + '| ' + places[i].getMarkers() + ' ), ';
        }

        string += "\nTransitions:\n\t";

        var transitions = this.getTransitions();
        for (var i in transitions) {
            string += transitions[i] + '( ' + transitions[i].getNeighbours() + ' ), ';
        }

        return string + "\n";
    },

    serialize: function() {
        var vertices = this.graph.GetVertices();
        var v = [];

        for (var type in vertices) {
            for (var id in vertices[type]) {
                v.push(vertices[type][id].export());
            }
        }

        return JSON.stringify(v);
    },

    deserialize: function(json) {
        var vertices = JSON.parse(json);

        for (var i in vertices) {
            var vertex = vertices[i];

            if (vertex.type === 'Place') {
                this.createPlace(vertex.label, vertex.markers);
            } else if (vertex.type === 'Transition') {
                this.createTransition(vertex.label, vertex.priority)
            }

            for (var n in vertex.neighbours) {
                var neighbour = vertex.neighbours[n];
                this.graph.AddEdge(vertex.id, neighbour.id, {weight: neighbour.weight});
            }
        }

        return this;
    },

    clone: function() {
        return new PTNGraph().deserialize(this.serialize());
    },

    toString: function() {
        return this.getName();
    }
};

module.exports = PTNGraph;

