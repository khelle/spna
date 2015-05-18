var Ajax = function() {

    this.Request = function(url, params, callback) {
        $.ajax({
            url: url,
            type: 'POST',
            async: false,
            data: params,
            dataType: 'json',
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
