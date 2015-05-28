/**
 * Created by Rael on 2015-05-28.
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
var p2 = g.createPlace('p2',1);
var p3 = g.createPlace('p3',1);

//var p4 = g.createPlace('p4',0);

var t1 = g.createTransition('t1');

var t2 = g.createTransition('t2');


p1.connect(t1,1);
p2.connect(t1,1);
p2.connect(t2,1);
p3.connect(t2,1);





console.log(g.findPrioritizedTransitionsToExecute(g.findTransitionsToExecute()));

console.log( g.print() );
