var PTNGraph = require('../bin/modules/PTNGraph');

var g = new PTNGraph('G1');

var p1 = g.createPlace('p1', 1);
var p2 = g.createPlace('p2');
var t1 = g.createTransition('t1');

p1.connectTransition(t1,1);
p2.connectToTransition(t1,2);

console.log(g.print());

g.removeVertex(t1);

console.log(g.print());