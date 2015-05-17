var IOOperations = require('../FileSystem/IOOperations');

var GraphExporter = function() {
    this.io = new IOOperations();

    this.exportGraph = function(graph) {
        return this.io.writeFile(graph.serialize(), 'public' + GraphExporter.TMP_FILE);
    };
};

GraphExporter.TMP_FILE = '/tmp/graph.tmp';

module.exports = GraphExporter;