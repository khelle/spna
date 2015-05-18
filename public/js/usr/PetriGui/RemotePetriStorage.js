var RemotePetriStorage = function() {
    this.ajax = new Ajax();

    this.UseGraph = function(name) {
        var response;
        var status;

        this.ajax.Request(
            "/api/graph/create",
            {
                name: name
            },
            function(r, s) {
                response = r;
                status = s;
            }
        );

        return { response: response, status: status };
    };

    this.CreatePlace = function(label, markers, posx, posy) {
        var response;
        var status;

        this.ajax.Request(
            "/api/place/create",
            {
                label: label,
                markers: markers,
                posx: posx,
                posy: posy
            },
            function(r, s) {
                response = r;
                status = s;
            }
        );

        return { response: response, status: status };
    };

    this.CreateTransition = function(label, posx, posy) {
        var response;
        var status;

        this.ajax.Request(
            "/api/transition/create",
            {
                label: label,
                posx: posx,
                posy: posy
            },
            function(r, s) {
                response = r;
                status = s;
            }
        );

        return { response: response, status: status };
    };

    this.SetPlaceMarkers = function(id, markers) {
        var response;
        var status;

        this.ajax.Request(
            "/api/place/markers",
            {
                id: id,
                markers: markers
            },
            function(r, s) {
                response = r;
                status = s;
            }
        );

        return { response: response, status: status };
    };

    this.SetVertexLabel = function(id, label) {
        var response;
        var status;

        this.ajax.Request(
            "/api/vertex/label",
            {
                id: id,
                label: label
            },
            function(r, s) {
                response = r;
                status = s;
            }
        );

        return { response: response, status: status };
    };

    this.SetVertexPosition = function(id, posx, posy) {
        var response;
        var status;

        this.ajax.Request(
            "/api/vertex/position",
            {
                id: id,
                posx: posx,
                posy: posy
            },
            function(r, s) {
                response = r;
                status = s;
            }
        );

        return { response: response, status: status };
    };

    this.RemoveVertex = function(id) {
        var response;
        var status;

        this.ajax.Request(
            "/api/vertex/remove",
            {
                id: id
            },
            function(r, s) {
                response = r;
                status = s;
            }
        );

        return { response: response, status: status };
    };

    this.Connect = function(source, target, cost) {
        var response;
        var status;

        this.ajax.Request(
            "/api/vertex/connect",
            {
                source: source,
                target: target
            },
            function(r, s) {
                response = r;
                status = s;
            }
        );

        return { response: response, status: status };
    };

    this.Disconnect = function(source, target) {
        var response;
        var status;

        this.ajax.Request(
            "/api/vertex/disconnect",
            {
                source: source,
                target: target
            },
            function(r, s) {
                response = r;
                status = s;
            }
        );

        return { response: response, status: status };
    };

    this.SetConnectionCost = function(source, target, cost) {
        var response;
        var status;

        return { response: {}, status: true };
    };

    return this;

    //POST /api/graph/create : void
    //name	- string
    //
    //POST /place/create : int id
    //label	- string
    //markers	- int
    //posx	- int
    //posy	- int
    //
    //POST /api/transition/create : int id
    //label	- string
    //posx	- int
    //posy	- int
    //
    //POST /api/place/markers : void
    //    id	- int
    //markers	- int
    //
    //POST /api/vertex/label : void
    //    id	- int
    //label	- string
    //
    //POST /api/vertex/position : void
    //    id	- int
    //posx	- int
    //posy	- int
    //
    //POST /api/vertex/remove : void
    //    id	- int
    //
    //POST /api/vertex/connect : int id
    //source	- int
    //target	- int
    //
    //POST /api/vertex/disconnect : void
    //    source	- int
    //target	- int
};
