var Analyzer = function(app, ajax) {
    this.app  = app;
    this.ajax = ajax;

    this.DownloadAnalysis = function() {
        var proxy = this;

        this.ajax.HttpGet('/api/graph/analyze', null, function(data, status) {
            if (data.status === true) {
                proxy.PromptAnalysisData(data.data.analysis);
            }
        });
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

        app.SimulationModeOn();
        app.Renderer.ShowNotesOfTransitionsVitality(data["Transitions vitality"]);

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

    this.GetActiveTransitions = function() {
        var proxy = this;

        this.ajax.HttpGet('/api/transition/active', null, function(data, status) {
            if (data.status === true) {
                proxy.app.SimulationModeOn();
                proxy.app.Renderer.ShowNotesOfActiveTransitions(data.data.transitions);
            }
        }, true);
    };

    this.ExecuteTransition = function(id) {
        var proxy = this;

        this.ajax.HttpPost('/api/transition/execute', { id: id }, function(data, status) {
            if (data.status === true) {
                proxy.app.Storage.Reset();
                proxy.app.Renderer.Paint();
                proxy.app.Storage.Build(data.data.graph);
                proxy.app.Renderer.Paint();

                /*proxy.GetActiveTransitions();*/

                proxy.app.SimulationModeOn();
                proxy.app.Renderer.ShowNotesOfActiveTransitions(data.data.graph.active_transitions);
            }
        }, true);
    };

    this.TurnPrioritiesOn = function() {
        var proxy = this;

        this.ajax.HttpPost('/api/graph/priorities', { priorities: true }, function(data, status) {
            if (data.status === true) {
                proxy.app.Renderer.EnableDrawingPriorities();
                proxy.app.Renderer.SelectNode(proxy.app.Renderer.selectedNode);
                proxy.app.Renderer.Paint();
            }
        }, true);
    };

    this.TurnPrioritiesOff = function() {
        var proxy = this;

        this.ajax.HttpPost('/api/graph/priorities', { priorities: false }, function(data, status) {
            if (data.status === true) {
                proxy.app.Renderer.DisableDrawingPriorities();
                proxy.app.Renderer.SelectNode(proxy.app.Renderer.selectedNode);
                proxy.app.Renderer.Paint();
            }
        }, true);
    };

    return this;
};
