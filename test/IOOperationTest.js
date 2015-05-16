/**
 * Created by Rael on 2015-05-16.
 */


var IOOperations = require('../bin/modules/FileSystem/IOOperations'); // import klasy jako IOOperations
var IO = new IOOperations; // instancja klasy

var Str = "1234567890 Zażółć jaźlą gęśń";

console.log(Str);

var Path = "C:\\test.txt";

IO.saveGraph(Str, Path);

var Test = IO.loadGraph(Path);

console.log(Test);

if(Str !== Test) console.log("Readen text is different form the saved one!");

var Path = "C:\\test2.txt";

var Test = IO.loadGraph(Path);

console.log(Test);