var Graph = require('../Graph/MultiDirectedGraph');
var VertexStorage = require('../Graph/DefaultVertexStorage');
var State = require('../State');
var PriorityQueue = require('priorityqueuejs');

function CoverabilityGraph(ptnGraph) {
    //this.ptnGraph = Utils.clone(ptnGraph);
    //console.log(this.ptnGraph);
    this.ptnGraph = ptnGraph;
    this.graph = new Graph(new VertexStorage());

    this.treeRoot = null;

    this.mergeQueue = {};
    this.mergeIndexes = {};

    this.IsConservative = true; // czy sieć jest zachowawcza

    this.getParent = function(vertex) {
        try {
            return this.graph.getReferencing(vertex)[0];
        } catch(e) {
            return null;
        }
    };

    this.build = function() {
        this.buildCoverabilityTree();
        this.buildCoverabilityGraph();
    };

    //BUILD
    this.buildCoverabilityTree = function() {

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

            while( parent = this.getParent(parent) ) {
                if(current.isEqual(parent)) {

                    //console.log("current set to OLD");
                    current.setLabel(State.OLD);

                    this.addToMergeQueue(parent);
                    this.addToMergeQueue(current);

                    break;
                }
            }

            if(current.getLabel()==State.NEW) {

                this.ptnGraph.setState(current);
                var TMPtrans = this.ptnGraph.findTransitionsToExecute();

                if(!TMPtrans.length) {
                    current.setLabel(State.DEAD);
                    //console.log("current set to DEAD");
                }
                else {
                    //console.log("current in checking executable transitions");

                    TMPtrans.forEach(function(transition) {

                        //console.log("(one) + transition name: " + transition.getLabel());

                        this.ptnGraph.setState(current);
                        this.ptnGraph.executeTransition(transition);
                        newState = this.ptnGraph.getState();

                        innerparent = current;

                        do {
                            if(newState.isEqual(innerparent)) {
                                //console.log("newState set to OLD");
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
                                //console.log("newState has Inf now");
                                //console.log(newState.print());

                            }

                            this.graph.AddVertex( newState );
                            this.graph.AddEdge(current.id,newState.id,{transition:transition});
                            list.push( newState );

                        } while( innerparent = this.getParent(innerparent) );

                    }, this);
                }
            }


        }

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
        for (var i in this.mergeQueue) {
            var tab = this.mergeQueue[i];

            var merger = tab.pop();
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
    };
    //!tree2graph

    this.Dijkstra = function(startVertex, endVertex)
    {
        /*
        Sprawdź przy pomocy algorytmu Dijkstry czy pomiędzy startVertex a endVertex istnieje ścieżka
         */

        // Stwórz tablicę d odległości od źródła
        // dla wszystkich wierzchołków grafu.
        // Na początku d[s]=0, zaś d[v]=\infty dla
        // wszystkich pozostałych wierzchołków.

        // var vertices = this.graph.getVertices();



        var vertices = this.graph.GetVertices(); // TODO: Zmienić drzewo na graf

        var d = {};
        //var Q = {};



        var Q = new PriorityQueue(function(a, b) { // zdefiniuj mi kolejkę, gdzie komparatorem jest różnica pomiędzy
            var comp = null;
            if( (a.distance == Infinity) && (b.distance !== Infinity))
            {
                comp =  -1;
            }
            else if ((b.distance == Infinity) && (a.distance !== Infinity))
            {
                comp = 1;
            }
            else if((a.distance == Infinity) && (b.distance == Infinity))
            {
                comp =  0
            }
            else
            {
                comp =  b.distance- a.distance;
            }
            //console.log("a.dist = " + a.distance + ", b.distance =" + b.distance + ", comparison,  = " + comp);
            return comp;
            //TODO: jak poradzić sobie z nieskończonością?
            // działa chyba dobrze

        });



        for (var i in vertices){

            var di = null;
            if(vertices[i].id == startVertex.id)
            {
                di = 0;
            }
            else
            {
                di = Infinity;

            }
            d[vertices[i].id] = di;
            //console.log("Distance = " + di);
            if(i == 7)
            {
                Q.enq({distance: Infinity, vert: vertices[i]});
            }
            else Q.enq({distance: i, vert: vertices[i]});

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

        var u = null;
        while(!Q.isEmpty()) // Dopóki kolejka nie jest pusta:
        {
            /*
            //Usuń z kolejki wierzchołek u o najniższym priorytecie (wierzchołek najbliższy źródła, który nie został jeszcze rozważony)

            var uIndex = 0;
            var u = Q[minIndex];

            // Znajdź wierzchołek o najmniejszym priorytecie
            for( var i in Q)
            {
                if(i==0) continue;

                if( (u > Q[i]) && (!u.isEmpty) && (!Q[i].isEmpty) )
                {
                    u = Q[i];
                    uIndex = i;
                }
            }
            u = Q[minIndex].pop();
             */
            Q.forEach(function (v)
            {
                var ver = v.vert.id;
                var prior = v.distance;

                console.log("\nVertex : " + ver + ", its distance: " + prior);
            })

            u = Q.deq(); // dlaczego nie zwraca elementu o

            Q.forEach(function (v)
            {
                var ver = v.vert.id;
                var prior = v.distance;
                console.log("\nVertex : " + ver + ", its distance: " + prior);
            })

            var uID = u.vert.id;
            var pr = u.distance;
            //console.log("d vertex id: " + uID + ", its distance: " + pr);

            //Dla każdego sąsiada v wierzchołka u dokonaj relaksacji poprzez u: jeśli d[u] + w(u, v) < d[v]
            //(poprzez u da się dojść do v szybciej niż dotychczasową ścieżką), to d[v] := d[u] + w(u, v).

            //console.log(u.vertex + );
            //var uNeighbours = vertices[uID];
            // czy to nie działa bo nie działam na grafie??
            //console.log(u);
            var uv = vertices[u.vert.id];
            var tmp = this.graph.GetNeighbours(vertices[u.vert.id]);

            // Nie działają funkcje zwracające sąsiadów
        var uNeighbours = null;
        for(var v in uNeighbours)
        {
            //w(u,w) - waga krawędzi pomiędzy u i w

            // sprawdź, czy v jest elementem Q
            var w = Infinity;
            var isElement = false;
            Q.forEach(function(i) {
                console.log(i);
                if(i.id == v.id) isElement = true;
            });

             if((w = u.getEdgeTo(v) != null))
             {
                 w = 1;
             }


            if(isElement == true) {
                if (d[v.id] > d[u.id] + w) {
                    d[v.id] = d[u.id] + w;
                }
            }
        }


    }
    /*
        if(d[endVertex.id] != Infinity) return true; // istnieje ścieżka pomiędzy wierzchołkami
    else return false;
    */
    }

    this.build();

    return this;
}

module.exports = CoverabilityGraph;