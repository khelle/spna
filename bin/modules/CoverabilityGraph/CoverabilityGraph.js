var Graph = require('../Graph/DirectedGraph');
var VertexStorage = require('../Graph/DefaultVertexStorage');
var EdgeStorage = require('../Graph/DenseDirectedEdgeStorage');
var Utils = require('../utils/Utils');
var State = require('../State');
var PriorityQueue = require('priorityqueuejs');



function CoverabilityGraph(ptnGraph) {
    //this.ptnGraph = Utils.clone(ptnGraph);
    //console.log(this.ptnGraph);
    this.ptnGraph = ptnGraph;
    this.tree = new Graph(new VertexStorage(), new EdgeStorage());

    this.treeRoot = null;

    this.mergeQueue = {};
    this.mergeIndexes = {};
    
    this.IsConservative = true; // czy sieć jest zachowawcza

    this.getParent = function(vertex) {
        try {
            return this.tree.getReferencing(vertex)[0];
        } catch(e) {
            return null;
        }
    };

    //BUILD
    this.buildCoverabilityTree = function() {

        var list = [];

        var root = this.ptnGraph.getState();
        this.tree.AddVertex( root );
        list.push(root);

        this.treeRoot = root;

        var current, parent, innerparent;
        var newState;
        while(!(list.length==0)) {
            current = list.pop();

            parent = current;

            while( parent = this.getParent(parent) ) {
                if(current.isEqual(parent)) {

                    console.log("current set to OLD");
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
                    console.log("current set to DEAD");
                }
                else {
                    console.log("current in checking executable transitions");

                    TMPtrans.forEach(function(transition) {

                        console.log("(one) + transition name: " + transition.getLabel());

                        this.ptnGraph.setState(current);
                        this.ptnGraph.executeTransition(transition);
                        newState = this.ptnGraph.getState();

                        innerparent = current;

                        do {
                            if(newState.isEqual(innerparent)) {
                                console.log("newState set to OLD");
                                newState.setLabel(State.OLD);

                                this.tree.AddVertex( newState );
                                this.tree.AddEdge(current.id,newState.id,{transition:transition});

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

                            this.tree.AddVertex( newState );
                            this.tree.AddEdge(current.id,newState.id,{transition:transition});
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
                this.tree.MergeVertices(tab.pop().id, merger.id);
            }
        }

    };
    //!tree2graph

    this.Dijkstra = function(startVertex, endVertex)
    {
        /*
        Sprawdź przy pomocy algorytmu Dijkstry czy
         */
        //var s = this.startVertex;

        // Stwórz tablicę d odległości od źródła
        // dla wszystkich wierzchołków grafu.
        // Na początku d[s]=0, zaś d[v]=\infty dla
        // wszystkich pozostałych wierzchołków.
        // var vertices = this.graph.getVertices();
        var vertices = this.tree.GetVertices(); // TODO: Zmienić drzewo na graf
        var d = {};
        //var Q = {};



        var Q = new PriorityQueue(function(a, b) { // zdefiniuj mi kolejkę, gdzie komparatorem jest różnica pomiędzy
            return a.distance - b.distance;
            // if
        });



        // jak mam zapisać, żeby ściągało elementy o najmniejszym priorytecie?





            for (var i in vertices){

                var di = null;
                if(vertices[i].id == startVertex.id)
                {
                    di = 0;
                    d[startVertex.id] = di;
                }
                else
                {
                    di = Infinity;
                    d[vertices[i].id] = di;
                }

                Q.enq({vertex: vertices[i], distance: di});

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

        while(!Q.isEmpty()) // Dopóki kolejka nie jest pusta:
        {
            /* */
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

            //Dla każdego sąsiada v wierzchołka u dokonaj relaksacji poprzez u: jeśli d[u] + w(u, v) < d[v]
            //(poprzez u da się dojść do v szybciej niż dotychczasową ścieżką), to d[v] := d[u] + w(u, v).
            var uNeighbours = vertices[minIndex].getNeighbours();
            for(var v in uNeighbours)
            {
                //w(u,w) - waga krawędzi pomiędzy u i w
                if((w = u.getEdgeTo(v) == null))
                {
                    w = Infinity;
                }
                else w = 1;

                if(d[u] + w < d[v])
                {
                    d[v] = d[u] + w;
                }

            }


        }
        if(d[endVertex] != Infinity) return true;
        else return false;
    }

    return this;
}

module.exports = CoverabilityGraph;