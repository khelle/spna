var Ajax = function() {

    this.HttpPost = function(url, params, callback) {
        params = params || {};
        callback = callback || function() {};

        $.ajax({
            url: url,
            type: 'POST',
            async: false,
            cache: false,
            data: JSON.stringify(params),
            dataType: 'json',
            processData: false,
            contentType: "application/json",
            success: function(data, status) {
                if (data.status === true) {
                    callback(data, status);
                }
                else {
                    callback({}, false);
                }
            },
            error: function() {
                callback({}, false);
            }
        });
    };

    this.HttpGet = function(url, params, callback) {
        params = params && params !== null || '';
        callback = callback || function() {};

        if (params !== '') {
            params = JSON.stringify(params);
        }

        $.ajax({
            url: url,
            type: 'GET',
            async: false,
            cache: false,
            data: params,
            dataType: 'json',
            processData: false,
            contentType: "application/json",
            success: function(data, status) {
                if (data.status === true) {
                    callback(data, status);
                }
                else {
                    callback({}, false);
                }
            },
            error: function() {
                callback({}, false);
            }
        });
    };

    this.HttpMultipart = function(url, data, callback) {
        callback = callback || function() {};

        $.ajax({
            url: url,
            type: 'POST',
            data: data,
            cache: false,
            processData: false,
            contentType: false,
            success: function(data, status) {
                if (data.status === true) {
                    callback(data, status);
                }
                else {
                    callback({}, false);
                }
            },
            error: function() {
                callback({}, false);
            }
        });
    };

    return this;
};
