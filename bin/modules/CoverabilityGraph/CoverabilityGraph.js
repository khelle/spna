var Graph = require('../Graph/MultiDirectedGraph');
var VertexStorage = require('../Graph/DefaultVertexStorage');
var State = require('../State');
var PriorityQueue = require('priorityqueuejs');

function CoverabilityGraph(ptnGraph) {
    //this.ptnGraph = Utils.clone(ptnGraph);
    //console.log(this.ptnGraph);
    this.ptnGraph = ptnGraph;
    this.graph = new Graph(new VertexStorage());

    //this.reachability = new Graph(new VertexStorage());
    this.reachability = null;

    this.rootState = ptnGraph.getState();

    /*
    New field, gets root-state when first building CoverabilityTree
    (used in building Reach-tree and Cover-graph)
     */
    this.rootState = this.ptnGraph.getState();

    /*
    ! Problem
    Taka konstrukcja budowanie grafu coverability podczas konstrukcji
    daje podwojone wyniki przy kolejnym odpalaniu budowania drzewa
    (nie wiem czy zmiana jest konieczna dla reachability...)
     */


    this.treeRoot = null;

    this.mergeQueue = {};
    this.mergeIndexes = {};

    this.IsConservative = true; // czy sieć jest zachowawcza



    this.getParent = function(vertex) {
        try {
            //return this.graph.GetReferencing(vertex)[0];\\
            var out = this.graph.GetReferencing(vertex.id)[0];
            return out;
        } catch(e) {
            return null;
        }
    };

    this.build = function() {
        this.buildCoverabilityTree();
        this.buildCoverabilityGraph();
    };



    //ReachabilityTree
    this.buildReachabilityTree = function() {

        console.log("buildReachabilityTree...");
        this.reachability = new Graph(new VertexStorage())

        var list = [];
        var MAXCOUNTER = 4;    // 30 or 50

        //var root = this.ptnGraph.getState();
        var root = this.rootState;
        this.reachability.AddVertex( root );

        this.ptnGraph.setState(root);

        var count = 0;
        list.push([root,count]);

        var current, newState;
        var currTuple;

        while(!(list.length==0)) {
            currTuple = list.pop();
            count = currTuple[1];
            count++;

            current = currTuple[0];

            var vertices = this.reachability.GetVertices();
            var GotOLD = false;
            var OLDWasCheckedAlready = false;

            for(var v in vertices) {

                if(vertices[v] === current) {
                    //continue;
                    //console.log("The same vertex");
                } else {
                    if(current.isEqual(vertices[v])) {

                        console.log("current set to OLD");
                        current.setLabel(State.OLD);

                        //IMPORTANT!
                        GotOLD = true;
                        if( this.graph.GetNeighbours(vertices[v].id).length > 0 ) {
                            OLDWasCheckedAlready = true;
                        }

                        //break;
                    }
                }
            }

            //IMPORTANT!
            if(GotOLD && !OLDWasCheckedAlready) {
                console.log("DAYUM! current set BACK to NEW");
                current.setLabel(State.NEW);
            }


            if((current.getLabel()==State.NEW) && (count < MAXCOUNTER)) {

                this.ptnGraph.setState(current);

                var TMPtrans;
                if(this.ptnGraph.priorities) {
                    TMPtrans = this.ptnGraph.findPrioritizedTransitionsToExecute();
                } else {
                    TMPtrans = this.ptnGraph.findTransitionsToExecute();
                }

                if(!TMPtrans.length) {

                    current.setDead(true);
                    console.log("current set to DEAD");
                }
                else {
                    console.log("current in checking executable transitions");

                    TMPtrans.forEach(function(transition) {

                        console.log("(one) + transition name: " + transition.getLabel());

                        this.ptnGraph.setState(current);
                        this.ptnGraph.executeTransition(transition);
                        newState = this.ptnGraph.getState();

                        this.reachability.AddVertex( newState );
                        this.reachability.AddEdge(current.id,newState.id,{transition:transition});
                        //list.push( [newState,currTuple[1]++] );
                        list.push( [newState,count] );
                        console.log("counter: " + count);


                    }, this);
                }
            }

        }

        console.log("build Reachability Tree finished!");

        // Go back to current state
        this.ptnGraph.setState( this.rootState );
    };
    //!Reach

    //BUILD
    this.buildCoverabilityTree = function() {

        ////("buildCoverabilityTree...");

        var list = [];

        var root = this.ptnGraph.getState();
        this.graph.AddVertex( root );
        list.push(root);

        this.treeRoot = root;

        var current, parent, innerparent;
        var newState;
        while(!(list.length==0)) {
            current = list.pop();

            parent = current;
            //var vertices = this.graph.GetVertices();
            //for (var v in vertices){
            //   if(v === current) continue;

            var vertices = this.graph.GetVertices();
            var GotOLD = false;
            var OLDWasCheckedAlready = false;

            for(var v in vertices) {

                if(vertices[v] === current) {
                    //continue;
                    //console.log("The same vertex");
                } else {
                    if(current.isEqual(vertices[v])) {

                        console.log("current set to OLD");
                        current.setLabel(State.OLD);

                        this.addToMergeQueue(vertices[v]);
                        this.addToMergeQueue(current);

                        //IMPORTANT!
                        GotOLD = true;
                        if( this.graph.GetNeighbours(vertices[v].id).length > 0 ) {
                            OLDWasCheckedAlready = true;
                        }

                        //break;
                    }
                }
            }

            //IMPORTANT!
            if(GotOLD && !OLDWasCheckedAlready) {
                console.log("DAYUM! current set BACK to NEW");
                current.setLabel(State.NEW);
            }



            /*
            while( parent = this.getParent(parent) ) {
                if(current.isEqual(parent)) {

                    console.log("current set to OLD");
                    current.setLabel(State.OLD);

                    this.addToMergeQueue(parent);
                    //this.addToMergeQueue(vertices[v]);
                    this.addToMergeQueue(current);

                    break;
                }
            }
            */

            if(current.getLabel()==State.NEW) {

                this.ptnGraph.setState(current);

                var TMPtrans;
                if(this.ptnGraph.priorities) {
                    TMPtrans = this.ptnGraph.findPrioritizedTransitionsToExecute();
                } else {
                    TMPtrans = this.ptnGraph.findTransitionsToExecute();
                }

                if(!TMPtrans.length) {
                    //current.setLabel(State.DEAD);\
                    current.setDead(true);
                    console.log("current set to DEAD");
                }
                else {
                    console.log("current in checking executable transitions");

                    var OneTimeAdd = false;
                    TMPtrans.forEach(function(transition) {

                        console.log("(one) + transition name: " + transition.getLabel());

                        this.ptnGraph.setState(current);
                        this.ptnGraph.executeTransition(transition);
                        newState = this.ptnGraph.getState();

                        this.graph.AddVertex( newState );
                        this.graph.AddEdge(current.id,newState.id,{transition:transition});
                        list.push( newState );

                        innerparent = current;


                        do {
                            /*
                            if(newState.isEqual(innerparent)) {
                                console.log("newState set to OLD");
                                newState.setLabel(State.OLD);

                                this.addToMergeQueue(innerparent);
                                this.addToMergeQueue(newState);

                                break;
                            }
                            */

                            if(newState.setInfinity(innerparent)) {
                                // TODO:
                                this.isConservative = false;
                                console.log("newState has Inf now");
                                console.log(newState.print());

                            }

                        } while( innerparent = this.getParent(innerparent) );

                        /*
                        do {
                            if(newState.isEqual(innerparent)) {
                                console.log("newState set to OLD");
                                newState.setLabel(State.OLD);

                                this.graph.AddVertex( newState );
                                this.graph.AddEdge(current.id,newState.id,{transition:transition});

                                this.addToMergeQueue(innerparent);
                                this.addToMergeQueue(newState);

                                break;
                            }

                            if(newState.setInfinity(innerparent)) {
                                // TODO:
                                this.isConservative = false;
                                console.log("newState has Inf now");
                                console.log(newState.print());

                            }

                            if(!OneTimeAdd) {
                                this.graph.AddVertex( newState );
                                this.graph.AddEdge(current.id,newState.id,{transition:transition});
                                list.push( newState );

                                OneTimeAdd = true;
                            }

                        } while( innerparent = this.getParent(innerparent) );
*/


                    }, this);
                }
            }


        }


        console.log("build Tree finished!");

        // Go back to current state
        this.ptnGraph.setState( this.rootState );
        //("build Tree finished!");
    };
    //!BUILD

    this.addToMergeQueue = function(state) {
        if (this.mergeIndexes[state.id] !== undefined) {
            return false;
        }

        var hash = state.getHash();

        if(this.mergeQueue[hash] === undefined){
            this.mergeQueue[hash]=[];
        }
        this.mergeQueue[hash].push(state);
        this.mergeIndexes[state.id] = true;

        return true;
    };

    //tree2graph
    this.buildCoverabilityGraph = function() {

        console.log("buildCoverabilityGraph...");

        for (var i in this.mergeQueue) {
            var tab = this.mergeQueue[i];

            var merger = tab.shift();
            //var merger = tab.pop();
            while(tab.length) {
                var popped = tab.pop();
                this.graph.MergeVertices(popped.id, merger.id);
            }

            var presentEdges = {};
            var edges = {};
            var edgesIds = this.graph.edgesStorage.GetEdgesBetween(merger.id, merger.id);

            for (var eid in edgesIds) {
                edges[edgesIds[eid]] = this.graph.GetEdge(edgesIds[eid]);
            }

            for (var e in edges) {
                var index = edges[e].data.transition.label;
                if (presentEdges[index] !== undefined) {
                    this.graph.RemoveEdge(e);
                } else {
                    presentEdges[index] = true;
                }
            }
        }

        //("build Graph finished!");
    };
    //!tree2graph

    this.Dijkstra = function(startVertex, endVertex) {
        //("startVertex.id = " + startVertex.id + ", endVertex.id = " + endVertex.id);
        /*
         Sprawdź przy pomocy algorytmu Dijkstry czy pomiędzy startVertex a endVertex istnieje ścieżka
         */

        // Stwórz tablicę d odległości od źródła
        // dla wszystkich wierzchołków grafu.
        // Na początku d[s]=0, zaś d[v]=\infty dla
        // wszystkich pozostałych wierzchołków.

        // var vertices = this.graph.getVertices();


        var vertices = this.graph.GetVertices();

        var d = {};
        //var Q = {};


        var Q = new PriorityQueue(function (a, b) { // zdefiniuj mi kolejkę, gdzie komparatorem jest różnica pomiędzy
            var comp = null;

            if (a.distance < b.distance) comp = 1;
            else if (a.distance > b.distance) comp = -1;
            else comp = 0;
            //console.log("a.dist = " + a.distance + ", b.distance =" + b.distance + ", comparison,  = " + comp);
            return comp;
        });


        for (var i in vertices) {

            var di = null;
            if (vertices[i].id == startVertex.id) {
                di = 0;
            }
            else {
                di = Infinity;

            }
            d[vertices[i].id] = di;
            //console.log("Distance = " + di);

            Q.enq({distance: di, vert: vertices[i]});
           // //(Q);
           // //("----------------------");
            ////("ID: " + vertices[i].id);
            ////("================");
            /*
             if(Q[d[vertices[i]]] === undefined) // nie miałem jeszcze takiej odleglości/priorytetu
             {
             Q[d[vertices[i]]] = [];
             Q[d[vertices[i]]].push(vertices[i].id); // dodaj wierzchołek z danym priorytetem
             }
             else
             {
             Q[d[vertices[u]]].push(vertices[i].id);
             }
             */

        }


        // Utwórz kolejkę priorytetową Q wszystkich wierzchołków grafu. Priorytetem kolejki jest aktualnie wyliczona odległość od wierzchołka źródłowego s.
        // Stwórz tablicę wierzchołków, sortuj ją stabilnie

        //TODO: Dodać jakąś wersję kolejki priorytetowej z internetu
        //TODO: Przetestować


        /*
         while(!Q.isEmpty())
         {
         var ttt = Q.deq();
         console.log(ttt.distance);
         }
         */
        //console.log("=!!!!!!!!!!!!!!!!!!!======");
        var u = null;

        while (!Q.isEmpty()) // Dopóki kolejka nie jest pusta:
        {


            u = Q.deq().vert;
            //console.log("u: " + u.id);

            var neighbours = this.graph.GetNeighbours(u.id);
            //if (neighbours === undefined) console.log("Empty neighbours")



            for (var v in neighbours) {
                var neighID = neighbours[v].id;
                //console.log("nighbors: " + neighbours[v].id);

                //w(u,w) - waga krawędzi pomiędzy u i w
                // sprawdź, czy v jest elementem Q

                if (d[neighID] === Infinity) {
                    d[neighID] = d[u.id] + 1;
                }
                else {
                    if (d[neighID] > d[u.id] + 1) {
                        d[neighID] = d[u.id] + 1;
                    }
                }
            }


        }
        console.log(d);
        if (d[endVertex.id] !== Infinity) return true; // istnieje ścieżka pomiędzy wierzchołkami
        else return false;
    }

    this.build();

    return this;
}

module.exports = CoverabilityGraph;