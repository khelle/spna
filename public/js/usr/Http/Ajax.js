var Ajax = function() {

    this.Request = function(url, params, callback) {
        var status;

        $.ajax({
            url: url,
            type: 'POST',
            async: false,
            data: params,
            dataType: 'json',
            success: function(data, status) {
                status = true;
                callback(data, status);
            },
            error: function() {
                status = false;
            }
        });

        return status;
    };

    return this;
};
