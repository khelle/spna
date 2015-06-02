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
        var props;

        app = this.app;

        message = '<label>Below are given characterstics of current graph:</label>';
        props = [
            'NetLimit', 'Conservative', 'Reversable', 'Vital'
        ];

        message += '<table cellpadding=0 cellspacing=0>';
        for (i in props) {
            if (data.hasOwnProperty(props[i]) !== false) {
                row = data[props[i]];

                message += '<tr><td width="120"><b>' + props[i] + '</b></td><td>' + row + '</td></tr>';
            }
        }
        message += '</table>';

        app.Renderer.ShowTransitionsVitality(data["Transitions vitality"]);

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
