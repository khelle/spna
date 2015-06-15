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
            'NetLimit', 'Securability', 'Unlimited', 'Conservative', 'Reversable', 'Vital'
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
        app.Renderer.ShowNotesOfPlaceLimits(data["PlacesLimits"]);

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

    this.DownloadCoverabilityGraph = function() {
        var proxy = this;

        this.ajax.HttpGet('/api/graph/analyze/coverability-graph', null, function(data, status) {
            if (data.status === true) {
                proxy.app.WindowMessage("CoverabilityGraph", false, [
                    {
                        type: 'close',
                        fn: function() {
                            proxy.app.CloseWindowMessage();
                        }
                    }
                ]);
                proxy.app.CoverRenderer.Build(data.data.graph);
                proxy.app.CoverRenderer.Paint();
                proxy.app.CoverRenderer.ResetCameraPosition();
            }
        });
    };

    this.DownloadReachabilityGraph = function() {
        var proxy = this;

        this.ajax.HttpGet('/api/graph/analyze/reachability-graph', null, function(data, status) {
            if (data.status === true) {
                proxy.app.WindowMessage("ReachabilityGraph", false, [
                    {
                        type: 'close',
                        fn: function() {
                            proxy.app.CloseWindowMessage();
                        }
                    }
                ]);
                proxy.app.CoverRenderer.Build(data.data.graph);
                proxy.app.CoverRenderer.Paint();
                proxy.app.CoverRenderer.ResetCameraPosition();
            }
        });
    };

    this.DownloadMatrixRepresentation = function() {
        var proxy = this;

        this.ajax.HttpGet('/api/graph/matrix', null, function(data, status) {
            if (data.status === true) {
                proxy.DisplayMatrixRepresentation(data.data.matrix);
            }
        }, true);
    };

    this.DisplayMatrixRepresentation = function(matrix) {
        var html;
        var proxy;

        html = '';

        html += '<br><div><b>(N)  Matrix:</b></div>' + this.DisplayMatrixInstance(matrix.n_inc);
        html += '<br><div><b>(N+) Matrix:</b></div>' + this.DisplayMatrixInstance(matrix.n_plus);
        html += '<br><div><b>(N-) Matrix:</b></div>' + this.DisplayMatrixInstance(matrix.n_minus);

        html = '<div class="scrollable">' + html + '</div>';

        proxy = this;
        proxy.app.PromptMessage("Matrix representation", html, [
            {
                type: 'close',
                fn: function() {
                    proxy.app.ClosePromptMessage();
                }
            }
        ]);
    };

    this.DisplayMatrixInstance = function(matrix) {
        var html;
        var el;
        var row;
        var column;
        var i;
        var j;

        html = '';
        for (i in matrix) {
            if (matrix.hasOwnProperty(i) !== false) {
                row = matrix[i];
                el = '';

                for (j in row) {
                    if (row.hasOwnProperty(j) !== false) {
                        column = row[j];

                        el += '<td width=20 height=20>' + column.val + '</td>';
                    }
                }

                html += '<tr>' + el + '</tr>';
            }
        }
        html = '<table class="matrix">' + html + '</table>';

        return html;
    };

    return this;
};
