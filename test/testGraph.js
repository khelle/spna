var PTNGraph = require('../bin/modules/PTNGraph');  // load graph module

var g = new PTNGraph('G1');     // create a new Graph

var p1 = g.createPlace('p1',1);         // p1 [Markers: 1]
var p2 = g.createPlace('p2', 2);        // p2 [Markers: 2]
var t1 = g.createTransition('t1',1);    // t1 [Priority: 1]

p1.connect(t1,1);          // p1 -1-> t1
t1.connect(p2,2);          // p1 -1-> t1 -2-> p2

t1.disconnect(p2); t1.connect(p1);    // p1 <-1-> t1
t1.disconnect(p1); t1.connect(p2,3);  // p1 -1-> t1 -3-> p2

var weight = p1.getCostTo(t1);      // Weight: 1
console.log("Weight [p1 -> t1]: " + weight);

var markers = p1.getMarkers();                  // Markers: 17
console.log("Markers [p1]: " + markers);

console.log(g.print());     // current state of graph << format: vertex( connections[weight] ) >>

g.removeVertex(t1);         // now graph has only 2 loose vertices: v1, v2 (they can't be connected together)

console.log(g.print());     // current state of graph

console.log(g.clone().print());