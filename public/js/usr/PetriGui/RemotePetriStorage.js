var RemotePetriStorage = function(ajax) {
    this.ajax = ajax;

    this.UseGraph = function(name) {
        var response;
        var status;

        this.ajax.HttpPost(
            "/api/graph/create",
            {
                name: name
            },
            function(r, s) {
                response = r;
                status = s;
            }
        );

        return { data: response.data, status: response.status };
    };

    this.CreatePlace = function(label, markers, posx, posy) {
        var response;
        var status;

        this.ajax.HttpPost(
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

        return { data: response.data, status: response.status };
    };

    this.CreateTransition = function(label, posx, posy) {
        var response;
        var status;

        this.ajax.HttpPost(
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

        return { data: response.data, status: response.status };
    };

    this.SetVertexMarkers = function(id, markers) {
        var response;
        var status;

        this.ajax.HttpPost(
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

        return { data: response.data, status: response.status };
    };

    this.SetVertexPriority = function(id, priority) {
        var response;
        var status;

        this.ajax.HttpPost(
            "/api/transition/priority",
            {
                id: id,
                priority: priority
            },
            function(r, s) {
                response = r;
                status = s;
            }
        );

        return { data: response.data, status: response.status };
    };

    this.SetVertexWeight = function(id, weight) {
        var response;
        var status;

        //this.ajax.HttpPost(
        //    "/api/transition/priority",
        //    {
        //        id: id,
        //        priority: priority
        //    },
        //    function(r, s) {
        //        response = r;
        //        status = s;
        //    }
        //);
        //
        //return { data: response.data, status: response.status };
        return { data: {}, status: true };
    };


    this.SetVertexLabel = function(id, label) {
        var response;
        var status;

        this.ajax.HttpPost(
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

        return { data: response.data, status: response.status };
    };

    this.SetVertexPosition = function(id, posx, posy) {
        var response;
        var status;

        this.ajax.HttpPost(
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

        return { data: response.data, status: response.status };
    };

    this.RemoveVertex = function(id) {
        var response;
        var status;

        this.ajax.HttpPost(
            "/api/vertex/remove",
            {
                id: id
            },
            function(r, s) {
                response = r;
                status = s;
            }
        );

        return { data: response.data, status: response.status };
    };

    this.CreateConnection = function(source, target, cost) {
        var response;
        var status;

        this.ajax.HttpPost(
            "/api/vertex/connect",
            {
                source: source,
                target: target,
                weight: cost
            },
            function(r, s) {
                response = r;
                status = s;
            }
        );

        return { data: response.data, status: response.status };
    };

    this.RemoveConnection = function(source, target) {
        var response;
        var status;

        this.ajax.HttpPost(
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

        return { data: response, status: status };
    };

    this.SetConnectionCost = function(id, cost) {
        var response;
        var status;

        this.ajax.HttpPost(
            "/api/edge/weight",
            {
                id: id,
                weight: cost
            },
            function(r, s) {
                response = r;
                status = s;
            }
        );

        return { data: response, status: status };
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
