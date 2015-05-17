var PTNGraph = require('../bin/modules/PTNGraph');  // load graph module

var g = new PTNGraph('G1');     // create a new Graph

var p1 = g.createPlace('p1',1);         // p1 [Markers: 1]
var p2 = g.createPlace('p2', 2);        // p2 [Markers: 2]
//var p3 = g.createPlace('p3', 3);        // p3 [Markers: 3]
//var p4 = g.createPlace('p4', 4);        // p4 [Markers: 4]
var t1 = g.createTransition('t1',1);    // t1 [Priority: 1]
//var t2 = g.createTransition('t2',2);    // t2 [Priority: 2]

p1.connect(t1,1);          // p1 -1-> t1
t1.connect(p2,2);          // p1 -1-> t1 -2-> p2
//p2.connect(t2,3);          // p1 -1-> t1 -2-> p2 -3-> t2
//t2.connect(p3,4);          // p1 -1-> t1 -2-> p2 -3-> t2 -4-> p3

//g.graph.MergeVertices(t1.id, t2.id);
//var i=1;

//var g2 = g.clone();
//
//console.log(g2);

t1.disconnect(p2); t1.connect(p1);    // p1 <-1-> t1
t1.disconnect(p1); t1.connect(p2,3);  // p1 -1-> t1 -3-> p2

var weight = p1.getCostTo(t1);      // Weight: 1
console.log("Weight [p1 -> t1]: " + weight);

var markers = p1.getMarkers();                  // Markers: 17
console.log("Markers [p1]: " + markers);

console.log(g.print());     // current state of graph << format: vertex( connections[weight] ) >>

g.removeVertex(t1);         // now graph has only 2 loose vertices: v1, v2 (they can't be connected together)

console.log(g.print());     // current state of graph
//
//console.log(g.graph.edgesStorage.inRefs);
//console.log(g.graph.edgesStorage.outRefs);
console.log(g.graph.edgesStorage.edges);
console.log(g.graph.verticesStorage.vertices);
//console.log(g.graph.verticesStorage.verticesIndex);
