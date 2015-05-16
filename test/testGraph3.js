
var PTNGraph = require('../bin/modules/PTNGraph');  // load graph module
var PTNAnalysis = require('../bin/modules/PTNAnalysis');  // load graph module


var g = new PTNGraph('G1');     // create a new Graph

var p1 = g.createPlace('p1',1);
var p2 = g.createPlace('p2',0);

var t1 = g.createTransition('t1');


p1.connectTransition(t1,1);
t1.connectPlace(p2,1);


console.log( g.print() );

testing = new PTNAnalysis(g);
//console.log(testing);
testing.buildCoverabilityTree();

console.log( testing.printTree() );
