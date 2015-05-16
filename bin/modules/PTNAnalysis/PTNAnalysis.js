var Graph = require('../Graph/DirectedGraph');
var VertexStorage = require('../Graph/DefaultVertexStorage');
var EdgeStorage = require('../Graph/DenseDirectedEdgeStorage');
var Utils = require('../utils/Utils');
var State = require('../State');


function PTNAnalysis(ptnGraph) {
    //this.ptnGraph = Utils.clone(ptnGraph);
    //console.log(this.ptnGraph);
    this.ptnGraph = ptnGraph;
    this.tree = new Graph(new VertexStorage(), new EdgeStorage());

    this.treeRoot = null;


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

                                break;
                            }

                            if(newState.setInfinity(innerparent)) {
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


    //tree2graph
    this.buildCoverabilityGraph = function() {

        var root = this.treeRoot;




    }
    //!tree2graph


    return this;
}

module.exports = PTNAnalysis;