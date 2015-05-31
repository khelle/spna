var Analyzer = function(app, ajax) {
    this.app  = app;
    this.ajax = ajax;

    this.DownloadAnalysis = function() {
        var proxy = this;

        this.ajax.HttpGet('/api/graph/analyze', null, function(data, status) {
            if (data.status === true) {
                proxy.PromptAnalysisData(data.data.analysis);
            }
        })
    };

    this.PromptAnalysisData = function(data) {
        var message;
        var app;
        var i;
        var row;

        app = this.app;

        message = '<label>Below are given characterstics of current graph:</label>';

        message += '<table cellpadding=0 cellspacing=0>';
        for (i in data) {
            if (data.hasOwnProperty(i) !== false) {
                row = data[i];

                message += '<tr><td width="120"><b>' + i + '</b></td><td>' + row + '</td></tr>';
            }
        }
        message += '</table>';

        app.PromptMessage(
            'Analysis results',
            message,
            [
                {
                    type: 'close',
                    fn: function() {
                        app.ClosePromptMessage();
                    }
                }
            ],
            [
                {
                    name: 'OK',
                    fn: function() {
                        app.ClosePromptMessage();
                    }
                }
            ]
        );
    };

    return this;
};
