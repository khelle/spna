
var PTNGraph = require('../bin/modules/PTNGraph');  // load graph module
var CoverabilityGraph = require('../bin/modules/CoverabilityGraph');  // load graph module


var g = new PTNGraph('G_TEST');     // create a new Graph


/*
var p1 = g.createPlace('p1',1);
var p2 = g.createPlace('p2',0);


var t1 = g.createTransition('t1');
var t2 = g.createTransition('t2');


p1.connect(t1,1);
t1.connect(p1,1);
t1.connect(p2,1);

p1.connect(t2,1);
p2.connect(t2,1);
*/


/*
var p1 = g.createPlace('p1',6);
var p2 = g.createPlace('p2',0);
var p3 = g.createPlace('p3',2);

var t1 = g.createTransition('t1');
var t2 = g.createTransition('t2');
var t3 = g.createTransition('t3');
var t4 = g.createTransition('t4');



p1.connect(t1,1);
t1.connect(p2,1);

p2.connect(t3,1);
p2.connect(t4,1);//4

t3.connect(p1,1);
t4.connect(p3,1);

p3.connect(t2,1);
t2.connect(p2,1);//4
*/


/*
var p1 = g.createPlace('p1',2);
var p2 = g.createPlace('p2',0);

var t1 = g.createTransition('t1');
var t2 = g.createTransition('t2');

p1.connect(t1,2);
t1.connect(p2,1);

p2.connect(t2,1);
t2.connect(p1,2);
*/

var p1 = g.createPlace('p1',1);
var p2 = g.createPlace('p2',0);
var p3 = g.createPlace('p3',0);

var t1 = g.createTransition('t1');
var t2 = g.createTransition('t2');
var t3 = g.createTransition('t3');

p1.connect(t1,1);
t1.connect(p2,1);

p2.connect(t2,1);
t2.connect(p3,1);

p3.connect(t3,1);
t3.connect(p1,1);


console.log( g.print() );

var testing = new CoverabilityGraph(g);


