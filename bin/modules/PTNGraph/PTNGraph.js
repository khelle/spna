var Utils = require('../utils/Utils');
var Array = require('../utils/Array');
var Graph = require('../Graph/DirectedGraph');
var VertexStorage = require('../Graph/TypedVertexStorage');
var EdgeStorage = require('../Graph/DenseDirectedEdgeStorage');
var State = require('../State/State');
var PTNVertex = require('./Vertex/PTNVertex');
var Transition = PTNVertex.Transition;
var Place = PTNVertex.Place;

function PTNGraph(name, priorities) {
    this.graph = new Graph(new VertexStorage(['Place', 'Transition']), new EdgeStorage());
    this.setName(Utils.getValue(name, 'Graph'));
    this.setPriorities(Utils.getValue(priorities, true));
}

PTNGraph.prototype = {
    getName: function () {
        return this.name;
    },

    setName: function (name) {
        this.name = name;
        return this;
    },

    setPriorities: function(priorities) {
        this.priorities = priorities;
        return this;
    },

    hasPriorities: function() {
        return this.priorities;
    },

    getPlaces: function() {
        return this.graph.GetVertices()['Place'];
    },

    createPlace: function(label, markers, position, id) {
        var place = new Place(this, this.graph, label, position, markers, id);

        return this.graph.AddVertex(place);
    },

    getTransitions: function() {
        return this.graph.GetVertices()['Transition'];
    },

    createTransition: function(label, priority, position, id) {
        var transition = new Transition(this, this.graph, label, position, priority, id);

        return this.graph.AddVertex(transition);
    },

    getVertex: function(id) {
        return this.graph.GetVertex(id);
    },

    removeVertex: function(vertex) {
        return this.graph.RemoveVertex(vertex.id);
    },

    getEdge: function(id) {
        return this.graph.GetEdge(id);
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
     Gets executable transitions and returns only the ones that really can be executed
     according to transitions's priorities
     */
    findPrioritizedTransitionsToExecute: function(AllTransitions) {
        //var AllTransitions = this.findTransitoionsToExecute();

        AllTransitions = AllTransitions.sort(function(a, b) { return a.priority - b.priority; });

        console.log("=========================\nBEFORE LOOP:");
        console.log(AllTransitions);

        for (var i in AllTransitions) {
            for (var j in AllTransitions){

                if (AllTransitions[i] !== AllTransitions[j]){
                    iPrecedecesors = AllTransitions[i].getReferencing();
                    jPrecedecesors = AllTransitions[j].getReferencing();
                    var intersection = Array.intersect(iPrecedecesors,jPrecedecesors);
                    if ((intersection.length > 0) && (AllTransitions[i].priority < AllTransitions[j].priority)) {

                        var idx = AllTransitions.indexOf(AllTransitions[j]);
                        AllTransitions.splice(idx, 1);
                    }
                    //console.log(intersection);
                }
            }

        }
        console.log("=========================\nOUTCOME:");
        console.log(AllTransitions);
        console.log("=========================\n=========================");

        return AllTransitions;
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
        var string = 'Graph: ' + this.name + ', Priorities: ' + this.priorities;

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

    serialize: function(asString) {
        if (typeof asString === 'undefined') {
            asString = true;
        }

        var serializedGraph = {
            priorities: this.priorities
        };

        var vertices = this.graph.GetVertices();
        var v = [];

        for (var type in vertices) {
            for (var id in vertices[type]) {
                v.push(vertices[type][id].export());
            }
        }

        serializedGraph['vertices'] = v;

        return asString ? JSON.stringify(serializedGraph) : serializedGraph;
    },

    deserialize: function(json) {
        var serializedGraph = JSON.parse(json);

        this.setPriorities(serializedGraph['priorities']);

        for (var i in serializedGraph['vertices']) {
            var vertex = serializedGraph['vertices'][i];

            if (vertex.type === 'Place') {
                this.createPlace(vertex.label, vertex.markers, vertex.position, vertex.id);
            } else if (vertex.type === 'Transition') {
                this.createTransition(vertex.label, vertex.priority, vertex.position, vertex.id)
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

