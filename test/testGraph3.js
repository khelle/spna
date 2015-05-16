
var PTNGraph = require('../bin/modules/PTNGraph');  // load graph module
var PTNAnalysis = require('../bin/modules/PTNAnalysis');  // load graph module


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


p1.connectTransition(t1,1);
t1.connectPlace(p2,1);
t1.connectPlace(p1,1);


p3.connectTransition(t2,1);
t2.connectPlace(p3,1);
t2.connectPlace(p4,1);




console.log( g.print() );

//console.log( g.findTransitionsToExecute() );
//g.executeTransition(t1);
//console.log( "+++++++++++++++++++++++++++++++++++++++" );
//console.log( g.findTransitionsToExecute() );



//console.log(g.findTransitionsToExecute());



var testing = new PTNAnalysis(g);
testing.buildCoverabilityTree();

//console.log( testing.printTree() );

