var PTNGraph = require('../bin/modules/PTNGraph');
var PTNVertex = require('../bin/modules/PTNGraph/Vertex/PTNVertex');

var Transition = PTNVertex.Transition;
var Place = PTNVertex.Place;

var p = new Place;
var t = new Transition;

p.connectToTransition(t,5);
console.log('p neighbours: ' + p.getNeighbours());
console.log('t neighbours: ' + t.getNeighbours());

console.log('------------------------');

t.disconnectPlace(p);
console.log('p neighbours: ' + p.getNeighbours());
console.log('t neighbours: ' + t.getNeighbours());