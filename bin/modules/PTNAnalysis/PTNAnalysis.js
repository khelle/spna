var Graph= require('../Graph');
var VertexStorage = require('../Graph/DefaultVertexStorage');
var EdgeStorage = require('../Graph/DenseEdgeStorage');
var Utils = require('../utils/Utils');


function PTNAnalysis(ptnGraph) {
    this.ptnGraph = Utils.clone(ptnGraph);
    this.graph = new Graph(new VertexStorage(), new EdgeStorage());


    this.buildCoverabilityTree = function() {

        var list = [];

        var root = this.ptnGraph.getState();
        this.graph.AddVertex( root );
        list.push(root);

        var current;
        var newState;
        while(!(list.length==0)) {

            current = list.pop();
            while();


            this.graph.modifyMarkersByState(current);
            var TMPtrans = this.graph.findTransitionsToExecute();

            if(TMPtrans.length==0) {
                current.setLabel("dead");
            }
            else {
                TMPtrans.forEach(function(transition) {

                    this.graph.executeTransition(transition);
                    newState = this.graph.getState();


                });
            }


        }

    }

    return this;
}