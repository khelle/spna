
var PTNGraph = require('../bin/modules/PTNGraph');  // load graph module
var CoverabilityGraph = require('../bin/modules/CoverabilityGraph');  // load graph module


var g = new PTNGraph('G_TEST');     // create a new Graph



 var p1 = g.createPlace('p1',1);
 var p2 = g.createPlace('p2',0);


 var t1 = g.createTransition('t1');
 var t2 = g.createTransition('t2');


 p1.connect(t1,1);
 t1.connect(p1,1);
 t1.connect(p2,1);

 p1.connect(t2,1);
 p2.connect(t2,1);



/*
 var p1 = g.createPlace('p1',4);
 var p2 = g.createPlace('p2',0);
 var p3 = g.createPlace('p3',0);

 var t1 = g.createTransition('t1');
 var t2 = g.createTransition('t2');
 var t3 = g.createTransition('t3');
 var t4 = g.createTransition('t4');



 p1.connect(t1,1);
 t1.connect(p2,1);

 p2.connect(t3,1);
 p2.connect(t4,4);//4

 t3.connect(p1,1);
 t4.connect(p3,1);

 p3.connect(t2,1);
 t2.connect(p2,4);//4
*/


/*
var p1 = g.createPlace('p1',1);
var p2 = g.createPlace('p2',0);
var p3 = g.createPlace('p3',1);
var p4 = g.createPlace('p4',0);
var p5 = g.createPlace('p5',0);

var t1 = g.createTransition('t1');
var t2 = g.createTransition('t2');
var t3 = g.createTransition('t3');
var t4 = g.createTransition('t4');


p1.connect(t1,1);
t1.connect(p2,1);

p2.connect(t2,1);
t2.connect(p5,2);
t2.connect(p1,1);

p5.connect(t3,3);
t3.connect(p4,1);

p4.connect(t4,1);
t4.connect(p3,1);
p3.connect(t3,1);

*/

/*
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
 //t3.connect(p1,1);
 */


console.log( g.print() );

var testing = new CoverabilityGraph(g);


