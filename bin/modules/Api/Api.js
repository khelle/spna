var PTNGraph = require('../PTNGraph');
var GraphIO = require('../GraphIO');
var NetProperties = require('../NetAnalysis');

var Api = function() {
    this.graphIO = new GraphIO();
    this.netProperties = new NetProperties();
    this.ptnGraph = null;

    this.serializeGraph = function() {
        return this.ptnGraph.serialize(false);
    };

    this.importGraph = function(files) {
        try {
            this.ptnGraph = this.graphIO.importGraph(files.graph.path);
            return this.ptnGraph.serialize(false);
        } catch (e) {
            return false;
        }
    };

    this.exportGraph = function() {
        if (this.graphIO.exportGraph(this.ptnGraph)) {
            return GraphIO.TMP_FILE;
        }

        return false;
    };

    this.analyzeGraph = function() {
        try {
            return this.netProperties.Analyze(this.ptnGraph.clone());
        } catch (e) {
            return false;
        }
    };

    this.getCoverabilityGraph = function() {
        try {
            if (null === this.netProperties.CoverabilityGraph) {
                this.netProperties.Analyze(this.ptnGraph.clone());
            }

            return this.netProperties.CoverabilityGraph.serialize();
        } catch (e) {
            return false;
        }
    };

    this.setGraphPriorities = function (data) {
        try {
            this.ptnGraph.setPriorities(data.priorities);
            return true;
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

    this.getActiveTransitions = function() {
        try {
            var active = this.ptnGraph.findActiveTransitions();
            var ids = [];

            for (var i in active) {
                ids.push({id: active[i].id});
            }

            return ids;
        } catch (e) {
            return false;
        }
    };

    this.executeTransition = function(data) {
        try {
            if (this.ptnGraph.getVertex(data.id).execute()) {
                var graph = this.ptnGraph.serialize(false);
                graph['active_transitions'] = this.getActiveTransitions();

                return graph;
            }

            return false;
        } catch (e) {
            return false;
        }
    };

    this.setTransitionPriority = function(data) {
        try {
            this.ptnGraph.getVertex(data.id).setPriority(parseInt(data.priority));
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
