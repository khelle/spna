/**
 * Created by Rael on 2015-05-16.
 */







//console.log(tmp);

var PTNGraph = require('../bin/modules/PTNGraph');  // load graph module
var CoverabilityGraph = require('../bin/modules/CoverabilityGraph');  // load graph module

var NetProperties = require('../bin/modules/NetAnalysis');

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
/*
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
*/

// Przykłąd z książki Szypyrki, strona 25 - badanie ograniczoności i zachowawczości
var p1 = g.createPlace('p1',1);
var p2 = g.createPlace('p2',0);
var p3 = g.createPlace('p3',4);

var t1 = g.createTransition('t1');
var t2 = g.createTransition('t2');
var t3 = g.createTransition('t3');
var t4 = g.createTransition('t4');

p1.connect(t2,1);
p2.connect(t1,1);
p3.connect(t3,1);
p3.connect(t4,1);

t1.connect(p1,1);
t2.connect(p3,1);
t3.connect(p2,1);
t4.connect(p1,1); //sieć przestanie być zachowawacza, gdy zwiększymy wagę tego przejścia
console.log( g.print() );

for(var i in g.getPlaces()) {
    console.log("Place  : " + g.getPlaces()[i]);
}

//console.log( g.findTransitionsToExecute() );
//g.executeTransition(t1);
//console.log( "+++++++++++++++++++++++++++++++++++++++" );
//console.log( g.findTransitionsToExecute() );



//console.log(g.findTransitionsToExecute());



var testing = new NetProperties();
console.log(testing.Analyze(g));

//TODO: jak przekażemy analizie grafu wektor wag względem którego badamy zachowawczość sieci
var graphVertices = testing.graph.GetVertices();
//console.log(graphVertices);

var graphVerticesCount = testing.graph.GetVerticesCount();
console.log("Size of coverability graph: " + graphVerticesCount);

// Badanie odwracalności sieci: graf z książki Szpyrki, strona 28
var g = new PTNGraph('G2');
var p1 = g.createPlace('p1',1);
var p2 = g.createPlace('p2',0);
var p3 = g.createPlace('p3',0);

var t0 = g.createTransition('t0');
var t1 = g.createTransition('t1');
var t2 = g.createTransition('t2');
var t3 = g.createTransition('t3');

p1.connect(t0,1);
p1.connect(t1,1);
p1.connect(t3,1);
p2.connect(t2,1);
p3.connect(t0,1);
p3.connect(t2,1);

t1.connect(p3,1);
t2.connect(p3,1);
t3.connect(p1,1);
t3.connect(p2,1);

var testing = new NetProperties();
console.log(testing.Analyze(g));

//TODO: jak przekażemy analizie grafu wektor wag względem którego badamy zachowawczość sieci
var graphVertices = testing.graph.GetVertices();
//console.log(graphVertices);

var graphVerticesCount = testing.graph.GetVerticesCount();
console.log("Size of coverability graph: " + graphVerticesCount);

console.log(testing.getTransitionsVitality());