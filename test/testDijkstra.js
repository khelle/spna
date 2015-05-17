/**
 * Created by Rael on 2015-05-16.
 */



var PTNGraph = require('../bin/modules/PTNGraph');  // load graph module
var CoverabilityGraph = require('../bin/modules/CoverabilityGraph');  // load graph module


var g = new PTNGraph('G1');     // create a new Graph


//* BASIC EX:
//var p1 = g.createPlace('p1',1);
//var p2 = g.createPlace('p2',0);
//
//var t1 = g.createTransition('t1');
//
//p1.connectTransition(t1,1);
//t1.connectPlace(p2,1);
//t1.connectPlace(p1,1);

//* COMPLEX EX1:
var p1 = g.createPlace('p1',1);
var p2 = g.createPlace('p2',0);




var p3 = g.createPlace('p3',1);
var p4 = g.createPlace('p4',0);

var t1 = g.createTransition('t1');

var t2 = g.createTransition('t2');


p1.connect(t1,1);
t1.connect(p2,1);
t1.connect(p1,1);


p3.connect(t2,1);
t2.connect(p3,1);
t2.connect(p4,1);




console.log( g.print() );

//console.log( g.findTransitionsToExecute() );
//g.executeTransition(t1);
//console.log( "+++++++++++++++++++++++++++++++++++++++" );
//console.log( g.findTransitionsToExecute() );



//console.log(g.findTransitionsToExecute());



var testing = new CoverabilityGraph(g);
testing.buildCoverabilityTree();
var treeVertices = testing.tree.GetVertices();
var treeVerticesCount = testing.tree.GetVerticesCount();
var startVertex = treeVertices[0];
var endVertex =  treeVertices[5];
console.log(treeVerticesCount);

console.log(startVertex, endVertex);

var test = testing.Dijkstra(startVertex, endVertex);

