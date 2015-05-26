var PTNGraph = require('../PTNGraph');
var GraphExporter = require('../GraphExporter');
var NetProperties = require('../NetAnalysis');

var Api = function() {
    this.exporter = new GraphExporter();
    this.netProperties = new NetProperties();
    this.ptnGraph = null;

    this.exportGraph = function() {
        if (this.exporter.exportGraph(this.ptnGraph)) {
            return GraphExporter.TMP_FILE;
        }

        return false;
    };

    this.analyzeGraph = function() {
        try {
            return this.netProperties.Analyze(this.ptnGraph);
        } catch (e) {
            return false;
        }
    };


    this.createGraph = function(data) {
        try {
            this.ptnGraph = new PTNGraph(data.name);
            return true;
        } catch (e) {
            return false;
        }
    };

    this.createPlace = function(data) {
        try {
            return this.ptnGraph.createPlace(data.label, data.markers, createPosition(data)).id;
        } catch (e) {
            return false;
        }
    };

    this.setPlaceMarkers = function(data) {
        try {
            this.ptnGraph.getVertex(data.id).setMarkers(parseInt(data.markers));
            return true;
        } catch (e) {
            return false;
        }
    };

    this.createTransition = function(data) {
        try {
            return this.ptnGraph.createTransition(data.label, 1, createPosition(data)).id;
        } catch (e) {
            return false;
        }
    };

    this.setVertexLabel = function(data) {
        try {
            this.ptnGraph.getVertex(data.id).setLabel(data.label);
            return true;
        } catch (e) {
            return false;
        }
    };

    this.setVertexPosition = function(data) {
        try {
            this.ptnGraph.getVertex(data.id).setPosition(createPosition(data));
            return true;
        } catch (e) {
            return false;
        }
    };

    this.removeVertex = function(data) {
        try {
            var vertex = this.ptnGraph.getVertex(data.id);
            return this.ptnGraph.removeVertex(vertex);
        } catch (e) {
            return false;
        }
    };

    this.connectVertex = function(data) {
        try {
            var source = this.ptnGraph.getVertex(data.source);
            var target = this.ptnGraph.getVertex(data.target);

            return source.connect(target, data.weight);
        } catch (e) {
            return false;
        }
    };

    this.disconnectVertex = function(data) {
        try {
            var source = this.ptnGraph.getVertex(data.source);
            var target = this.ptnGraph.getVertex(data.target);

            return source.disconnect(target);
        } catch (e) {
            return false;
        }
    };

    this.setEdgeWeight = function(data) {
        try {
            this.ptnGraph.getEdge(data.id).data.weight = data.weight;
            return true;
        } catch (e) {
            return false;
        }
    };
};

function createPosition(data) {
    return {
        x: data.posx,
        y: data.posy
    };
}

module.exports = new Api();
