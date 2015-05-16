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
                    current.setLabel(State.OLD);
                    break;
                }
            }

            if(current.getLabel()==State.NEW) {

                this.ptnGraph.setState(current);
                var TMPtrans = this.ptnGraph.findTransitionsToExecute();

                if(!TMPtrans.length) {
                    current.setLabel(State.DEAD);
                }
                else {
                    TMPtrans.forEach(function(transition) {

                        this.ptnGraph.setState(current);
                        this.ptnGraph.executeTransition(transition);
                        newState = this.ptnGraph.getState();

                        innerparent = current;
                        while( innerparent = this.getParent(innerparent) ) {
                            newState.setInfinity(innerparent);

                            this.tree.AddVertex( newState );
                            this.tree.AddEdge(current.id,newState.id,{transition:transition});
                            list.push( newState );
                        }
                    }, this);
                }
            }

        }

    };



    // PRINTING:
    this.printNodes = function(node) {

        var string = 'Node:\n';
        var list = this.tree.GetNeighbours(node.id);

        var curr = null;
        while(!(list.length==0)) {

            curr = list.pop();
            string += curr.print();

            string += this.printNodes(curr);
        }

        return string;
    }

    this.printTree = function() {

        var string = 'Tree:\n';
        string += "\tRoot:\n";
        string += this.treeRoot.print();
        string += "===REST:===\n";

        string += this.printNodes(this.treeRoot);



        return string;
    }


    return this;
}

module.exports = PTNAnalysis;