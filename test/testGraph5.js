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
var p4 = g.createPlace('p4',1);
var p5 = g.createPlace('p5',1);
var p6 = g.createPlace('p6',1);

//var p4 = g.createPlace('p4',0);

var t1 = g.createTransition('t1',4);

var t2 = g.createTransition('t2',3);

var t3 = g.createTransition('t3',1);

var t4 = g.createTransition('t4',2);

var t5 = g.createTransition('t5',10);


p1.connect(t1,1);

p2.connect(t1,1);
p2.connect(t2,1);

p3.connect(t2,1);
p3.connect(t3,1);

p4.connect(t3,1);
p4.connect(t4,1);

p5.connect(t4,1);

p6.connect(t5,1);




g.findPrioritizedTransitionsToExecute(g.findTransitionsToExecute());
//console.log(g.findPrioritizedTransitionsToExecute(g.findTransitionsToExecute()));

console.log( g.print() );
