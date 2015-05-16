var PTNGraph = require('../bin/modules/PTNGraph');  // load graph module

var g = new PTNGraph('G1');     // create a new Graph

var p1 = g.createPlace('p1',17);        // p1 [Markers: 17]
var p2 = g.createPlace('p2');           // p2 [Markers: 1]
var t1 = g.createTransition('t1',2);    // t1 [Priority: 2]

p1.connectTransition(t1,3);       // p1 -1-> t1
t1.connectPlace(p2,4);          // p1 -1-> t1 -4-> p2

t1.disconnectPlace(p2).connectPlace(p1);    // p1 <-1-> t1
t1.disconnectPlace(p1).connectPlace(p2,3);  // p1 -1-> t1 -3-> p2

var weight = p1.getCostTo(t1);      // Weight: 1
console.log("Weight [p1 -> t1]: " + weight);

var markers = p1.getMarkers();                  // Markers: 17
console.log("Markers [p1]: " + markers);

console.log(g.print());     // current state of graph << format: vertex( connections[weight] ) >>

g.removeVertex(t1);         // now graph has only 2 loose vertices: v1, v2 (they can't be connected together)

console.log(g.print());     // current state of graph

console.log(g.graph.edgesStorage.inRefs);
console.log(g.graph.edgesStorage.outRefs);
console.log(g.graph.edgesStorage.edges);
console.log(g.graph.verticesStorage.vertices);
console.log(g.graph.verticesStorage.verticesIndex);
