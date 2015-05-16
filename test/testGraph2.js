
var PTNGraph = require('../bin/modules/PTNGraph');  // load graph module

var g = new PTNGraph('G1');     // create a new Graph

var p1 = g.createPlace('p1',1);        // p1 [Markers: 1]
var p2a = g.createPlace('p2a',0);       // p2a [Markers: 1]
var p2b = g.createPlace('p2b');       // p2a [Markers: 0]
var p3 = g.createPlace('p3',1);       // p3 [Markers: 0]

var t1 = g.createTransition('t1');    // t1 [Priority: def?]
var t2 = g.createTransition('t2');    // t2 [Priority: def?]
var t3 = g.createTransition('t3');    // t3 [Priority: def?]

p1.connectTransition(t1,1);       // p1 -1-> t1
p2a.connectTransition(t2);       // p2a -1-> t2
p2b.connectTransition(t2);       // p2b -1-> t2
p3.connectTransition(t3);       // p3 -1-> t3

t1.connectPlace(p2b,1);          // t1 -1-> p2b
t2.connectPlace(p3);          // t2 -1-> p3
t3.connectPlace(p2a);          // t3 -1-> p2a
t3.connectPlace(p1);          // t3 -1-> p1

//t1.disconnectPlace(p2).connectPlace(p1);    // p1 <-1-> t1
//t1.disconnectPlace(p1).connectPlace(p2,3);  // p1 -1-> t1 -3-> p2


console.log(g.print());     // current state of graph << format: vertex( connections[weight] ) >>
console.log('CanBeExecuted');
console.log(t1.canBeExecuted());

//console.log(g.findTransitionsToExecute());

//console.log(g.getPlaces());
console.log('=======================');
console.log(g.print());
//console.log(g.findTransitionsToExecute());
g.executeTransition(t1);
console.log('=======EXECUTED========');
console.log(g.print());
//console.log(g.findTransitionsToExecute());
console.log('=======================');
//console.log(g.getPlaces());

console.log(t1.canBeExecuted());
g.executeTransition(t1);
