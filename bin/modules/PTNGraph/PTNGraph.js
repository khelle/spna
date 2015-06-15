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

    createPlace: function(label, markers, position, id, weight) {
        var place = new Place(this, this.graph, label, position, markers, id, weight);

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

    findActiveTransitions: function() {
        var allActive = this.findTransitionsToExecute();

        if (this.priorities) {
            return this.findPrioritizedTransitionsToExecute(allActive);
        }

        return allActive;
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

        //Reversing:
        AllTransitions = AllTransitions.reverse();

        //console.log(AllTransitions);
        var string = "";
        string = "Alltransitions:\n";
        for (var kkk in AllTransitions) {
            string += "   ";
            string += AllTransitions[kkk].label;
        }
        console.log( string );


        var toDelete = [];


        //console.log("=========================\nBEFORE LOOP:");
        //console.log(AllTransitions);

        for (var i in AllTransitions) {
            //for (var j in AllTransitions){
            for (var j=i;j<AllTransitions.length;j++) {

                if (AllTransitions[i] !== AllTransitions[j]){

                    iPrecedecesors = AllTransitions[i].getReferencing();
                    jPrecedecesors = AllTransitions[j].getReferencing();
                    var intersection = Array.intersect(iPrecedecesors,jPrecedecesors);
                    //console.log(intersection);

                    if ((intersection.length > 0) && (AllTransitions[j].priority < AllTransitions[i].priority)) {

                        //var idx = AllTransitions.indexOf(AllTransitions[j]);
                        //AllTransitions.splice(idx, 1);
                        toDelete.push(i);
                        break;
                    }

                }
            }

        }

        //console.log("=========================\nBefore to delete loop:");
        //console.log(AllTransitions);
        //console.log("=========================\n=========================");

        var cnt = 0;
        for (var i in toDelete) {
            AllTransitions.splice((toDelete[i]-cnt),1);
            cnt++;
        }

        console.log("=========================\nOUTCOME:");
        string = "";
        string = "Alltransitions:\n";
        for (var kkk in AllTransitions) {
            string += "   ";
            string += AllTransitions[kkk].label;
        }
        console.log( string );

        //console.log("=========================\nOUTCOME:");
        //console.log(AllTransitions);
        //console.log("=========================\n=========================");

        return AllTransitions;
    },





    /*
     Executes target transition
     */
    executeTransition: function (transition) {
        return transition.execute();
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

    getMatrixRepresentation : function() {
        /*
        Zwróć reprezentację macierzową grafu w postaci macierzy wejścia, wyjścia i incydencji
        , z których każda jest postaci [id_miejsca : [id przejscia1 : waga1], [id przejscia2: waga2]]
                [id_miejsca2 : [id przejscia1 : waga1], [id przejscia2: waga2]]

         Przykładowa macierz:
         { '3': { '0': 0, '1': 0, '2': 0 },
         '4': { '0': 1, '1': 1, '2': 1 } }

         Funkcja zwraca wszystkie macierze poprzez tablicę [Nplus, Nminus, Ninc]
         */

    var Nplus = {};
    var Nminus = {};
    var Ninc = {};

    var places = this.getPlaces();
    var transitions = this.getTransitions();
    for (var p in places)
    {
        // console.log("p = " + p);
        Nplus[p] = {};
        Nminus[p] = {};
        Ninc[p] = {};
        for (var t in transitions)
        {
            //console.log("t = " + t);
            Nplus[p][t] = {
                "placeLabel" : places[p].getLabel(),
                "transID" : transitions[t].getLabel(),
                "val" : 0
            };
            Nminus[p][t] = {
                "placeLabel" : places[p].getLabel(),
                "transID" : transitions[t].getLabel(),
                "val" : 0
            };
            Ninc[p][t] ={
                "placeLabel" : places[p].getLabel(),
                "transID" : transitions[t].getLabel(),
                "val" : 0
            };

        }

    }

    //console.log(Nplus);


    for (var t in transitions)
    {
        //console.log("TRANSITION : " + t);
        var currentTransition = transitions[t];
        var currentTransitionID = t.id;

        for (var p in places)
        {
            var currentPlace = places[p];
            var currentPlaceID = currentPlace.id;

            var placesToAddMarkers = currentTransition.getNeighbours();
            var placesToGetMarkers = currentTransition.getReferencing();

            for( var x in placesToAddMarkers)
            {
                var currentNeighbour = placesToAddMarkers[x];
                var currentNeighbourID = currentNeighbour.id;
                if(currentPlaceID ==  currentNeighbourID)
                {
                    //console.log("COST = " + currentTransition.getCostTo(currentPlace));
                    Nplus[p][t] =  {
                        "placeLabel" : places[p].getLabel(),
                        "transID" : transitions[t].getLabel(),
                        "val" : currentTransition.getCostTo(currentPlace)};
                }
            }

            for( var y in placesToGetMarkers)
            {
                var currentNeighbour = placesToGetMarkers[y];
                var currentNeighbourID = currentNeighbour.id;
                if(currentPlaceID ==  currentNeighbourID)
                {
                    //console.log("COST = " + currentPlace.getCostTo(currentTransition));


                    Nminus[p][t] = {
                        "placeLabel" : places[p].getLabel(),
                        "transID" : transitions[t].getLabel(),
                        "val" :currentPlace.getCostTo(currentTransition)
                    };
                }
            }
            //console.log("AFTER : N[" + p + "][" + t + "] = " + Nplus[p][t]);
        }
    }
    //console.log(Nplus);
    console.log(Nminus);

    for (var p in places)
    {
        for (var t in transitions)
        {

            Ninc[p][t] =  {
                "placeLabel" : places[p].getLabel(),
                "transLabel" : transitions[t].getLabel(),
                "val" : Nplus[p][t].val - Nminus[p][t].val};
        }
    }
    console.log(Ninc);

    return [Nplus, Nminus, Ninc];
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
        serializedGraph['vertices_count'] = this.graph.GetVerticesCount();
        serializedGraph['edges_count'] = this.graph.GetEdgesCount();

        return asString ? JSON.stringify(serializedGraph) : serializedGraph;
    },

    deserialize: function(json) {
        var serializedGraph = JSON.parse(json);

        this.setPriorities(serializedGraph['priorities']);

        for (var i in serializedGraph['vertices']) {
            var vertex = serializedGraph['vertices'][i];

            if (vertex.type === 'Place') {
                this.createPlace(vertex.label, vertex.markers, vertex.position, vertex.id, vertex.weight);
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

