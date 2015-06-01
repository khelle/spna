var IOOperations = require('../FileSystem/IOOperations');
var PTNGraph = require('../PTNGraph');

var GraphIO = function() {
    this.io = new IOOperations();

    this.exportGraph = function(graph) {
        return this.io.writeFile(graph.serialize(), 'public' + GraphIO.TMP_FILE);
    };

    this.importGraph = function(filePath) {
        var json = this.io.readFile(filePath);
        var graph = new PTNGraph();
        return graph.deserialize(json);
    };
};

GraphIO.TMP_FILE = '/tmp/graph.tmp';

module.exports = GraphIO;