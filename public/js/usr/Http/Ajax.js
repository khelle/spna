var Ajax = function(preloader) {
    this.preloader = preloader || null;

    this.HttpPost = function(url, params, callback, cancelPreloader) {
        params = params || {};
        callback = callback || function() {};
        cancelPreloader = cancelPreloader || false;

        var proxy = this;
        if (proxy.preloader !== null && cancelPreloader === false) {
            proxy.preloader.ShowPreloader();
        }

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
                if (proxy.preloader !== null && cancelPreloader === false) {
                    proxy.preloader.ClosePreloader();
                }

                if (data.status === true) {
                    callback(data, status);
                }
                else {
                    callback({}, false);
                }
            },
            error: function() {
                if (proxy.preloader !== null && cancelPreloader === false) {
                    proxy.preloader.ClosePreloader();
                }

                callback({}, false);
            }
        });
    };

    this.HttpGet = function(url, params, callback, cancelPreloader) {
        params = params && params !== null || '';
        callback = callback || function() {};
        cancelPreloader = cancelPreloader || false;

        if (params !== '') {
            params = JSON.stringify(params);
        }

        var proxy = this;
        if (proxy.preloader !== null && cancelPreloader === false) {
            proxy.preloader.ShowPreloader();
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
                if (proxy.preloader !== null && cancelPreloader === false) {
                    proxy.preloader.ClosePreloader();
                }

                if (data.status === true) {
                    callback(data, status);
                }
                else {
                    callback({}, false);
                }
            },
            error: function() {
                if (proxy.preloader !== null && cancelPreloader === false) {
                    proxy.preloader.ClosePreloader();
                }

                callback({}, false);
            }
        });
    };

    this.HttpMultipart = function(url, data, callback, cancelPreloader) {
        callback = callback || function() {};
        cancelPreloader = cancelPreloader || false;

        var proxy = this;
        if (proxy.preloader !== null && cancelPreloader === false) {
            proxy.preloader.ShowPreloader();
        }

        $.ajax({
            url: url,
            type: 'POST',
            async: false,
            data: data,
            cache: false,
            processData: false,
            contentType: false,
            success: function(data, status) {
                if (proxy.preloader !== null && cancelPreloader === false) {
                    proxy.preloader.ClosePreloader();
                }

                if (data.status === true) {
                    callback(data, status);
                }
                else {
                    callback({}, false);
                }
            },
            error: function() {
                if (proxy.preloader !== null && cancelPreloader === false) {
                    proxy.preloader.ClosePreloader();
                }

                callback({}, false);
            }
        });
    };

    return this;
};
