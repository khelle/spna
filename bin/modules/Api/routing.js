var express = require('express');
var router = express.Router();
var api = require('./Api');

router.get('/graph/export', function(request, response) {
    var path = api.exportGraph();

    if (path === false) {
        response.json(createResponse(false, {}));
        return;
    }

    response.json(createResponse(true, {path: path}));
});

router.get('/graph/analyze', function(request, response) {
    var analysis = api.analyzeGraph();

    if (analysis === false) {
        response.json(createResponse(false, {}));
        return;
    }

    response.json(createResponse(true, {analysis: analysis}));
});

router.post('/graph/priorities', function(request, response) {
    var data = request.body;
    var status = api.setGraphPriorities(data);

    response.json(createResponse(status, {}));
});

router.post('/graph/create', function(request, response) {
    var data = request.body;
    var status = api.createGraph(data);

    response.json(createResponse(status, {}));
});

router.post('/place/create', function(request, response) {
    var data = request.body;
    var id = api.createPlace(data);

    if (id === false) {
        response.json(createResponse(false, {}));
        return;
    }

    response.json(createResponse(true, {id: id}));
});

router.post('/place/markers', function(request, response) {
    var data = request.body;
    var status = api.setPlaceMarkers(data);

    response.json(createResponse(status, {}));
});

router.post('/transition/create', function(request, response) {
    var data = request.body;
    var id = api.createTransition(data);

    if (id === false) {
        response.json(createResponse(false, {}));
        return;
    }

    response.json(createResponse(true, {id: id}));
});

router.post('/vertex/label', function(request, response) {
    var data = request.body;
    var status = api.setVertexLabel(data);

    response.json(createResponse(status, {}));
});

router.post('/vertex/position', function(request, response) {
    var data = request.body;
    var status = api.setVertexPosition(data);

    response.json(createResponse(status, {}));
});

router.post('/vertex/remove', function(request, response) {
    var data = request.body;
    var status = api.removeVertex(data);

    response.json(createResponse(status, {}));
});

router.post('/vertex/connect', function(request, response) {
    var data = request.body;
    var id = api.connectVertex(data);

    if (id === false) {
        response.json(createResponse(false, {}));
        return;
    }

    response.json(createResponse(true, {id: id}));
});

router.post('/vertex/disconnect', function(request, response) {
    var data = request.body;
    var status = api.disconnectVertex(data);

    response.json(createResponse(status, {}));
});

router.post('/edge/weight', function(request, response) {
    var data = request.body;
    var status = api.setEdgeWeight(data);

    response.json(createResponse(status, {}));
});

router.get('/hello', function(request, response) {
    response.json(createResponse(true, [1,2,3,4]));
});

function createResponse(status, data) {
    return {status: status, data: data};
}

module.exports = router;