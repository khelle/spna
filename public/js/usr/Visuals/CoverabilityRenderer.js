var CoverabilityRenderer = function(app, renderingRoot) {
    this.app                 = app;
    this.renderingRoot       = renderingRoot;
    this.mouseLayer          = null;
    this.sigma               = null;
    this.sigmaRenderer       = null;
    this.paintable           = true;

    this.sigmaSettings = {
        autoRescale: false,/*CHANGE*/
        autoResize: true,
        mouseEnabled: true,
        mouseWheelEnabled: true,
        touchEnabled: false,
        doubleClickEnabled: false,
        enableHovering: false,
        drawLabels: true,
        drawEdgeLabels: true,
        drawPriorities: false,
        edgeLabelSize: 'fixed',
        nodeTextSize: 'fixed',
        nodesPowRatio: 0.5,
        edgesPowRatio: 0.5,
        edgeLabelSizePowRatio: 0.5,
        defaultEdgeColor: '#cc0000',
        defaultNodeColor: '#cc0000',
        defaultPlaceColor: '#cc0000',
        defaultTransitionColor: '#cc0000',
        defaultLabelColor: '#696969',
        defaultEdgeLabelColor: '#696969',
        defaultNodeTextColor: '#eeeeee',
        defaultShadowColor: '#000000',
        defaultEdgeLabelSize: 14,
        defaultLabelSize: 12,
        defaultNodeTextSize: 12,
        edgeColor: 'default',
        labelColor: 'default',
        nodeTextColor: 'default',
        zoomMin: 1/8,
        zoomMax: 1,
        zoomingRatio: 1.4,
        minNodeSize: 0.5,
        maxNodeSize: 2,
        minEdgeSize: 0.5,
        maxEdgeSize: 1,
        minArrowSize: 10
    };

    this.Init = function() {
        sigma.renderers.def = sigma.renderers.canvas;
        this.sigma = new sigma({
            renderer: {
                container: this.renderingRoot,
                type: 'canvas'
            },
            settings: this.sigmaSettings
        });
        this.sigmaRenderer = this.sigma.renderers[0];
        this.RegisterDraggableNodes();

        //sigma.canvas.nodes.node = this.NodeRenderer;

        return this;
    };

    this.GetCanvas = function() {
        return this.mouseLayer;
    };

    this.RegisterDraggableNodes = function() {
        var dragListener = sigma.plugins.dragNodes(
            this.sigma,
            this.sigmaRenderer
        );

        dragListener.bind('dragend', (function(renderer) {
            return function(e) {
                renderer.sigmaRenderer.settings({enableHovering: false});
            };
        })(this));

        // Fixes drag node issue #423
        this.FixBug423();

        return this;
    };

    this.UnregisterDraggableNodes = function() {
        sigma.plugins.killDragNodes(this.sigma);

        return this;
    };

    this.FixBug423 = function() {
        try {
            this.sigma.graph.addNode({
                id: 'ghost',
                size: 0,
                x: 0,
                y: 0,
                dX: 0,
                dY: 0,
                type: 'ghost'
            });
            this.sigma.camera.goTo({
                x: 1000,
                y: 1000
            });
        }
        catch (ex) {}
    };

    this.NodeRenderer = function(node, ctx, settings) {
        var prefix = settings('prefix') || '';
        var fontSize = (settings('nodeTextSize') === 'fixed') ? settings('defaultNodeTextSize') : settings('defaultNodeTextSize') * size * Math.pow(size, -1 / settings('nodeTextSizePowRatio'));

        ctx.shadowBlur = 0;

        ctx.fillStyle = node.color || settings('defaultPlaceColor');
        ctx.beginPath();
        ctx.arc(
            node[prefix + 'x'],
            node[prefix + 'y'],
            node[prefix + 'size'],
            0,
            Math.PI * 2,
            true
        );
        ctx.closePath();

        var shadowColor = node.shadowColor || settings('defaultShadowColor');

        if (shadowColor !== 'default') {
            ctx.shadowColor = shadowColor;
            ctx.shadowBlur = 10;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
        }
        ctx.fill();

        ctx.save();

        ctx.shadowBlur = 0;
        ctx.font = [
            settings('fontStyle'),
            fontSize + 'px',
            settings('font')
        ].join(' ');

        var fillStyle = (settings('nodeTextColor') === 'node') ? (node.color || settings('defaultNodeColor')) : settings('defaultNodeTextColor');
        ctx.fillStyle = (node.textColor !== undefined) ? node.textColor : fillStyle ;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic';

        var cx = node[prefix + 'x'];
        var cy = node[prefix + 'y'];

        ctx.translate(cx, cy);
        ctx.fillText(
            '',
            0,
            (node[prefix + 'size'] / 2)
        );

        ctx.restore();
    };

    this.RenderNode = function(record, defaultColor, defaultShadow) {
        defaultColor = defaultColor || 'default';
        defaultShadow = defaultShadow || 'default';

        var x;
        var y;

        x = ~~(Math.random()*500)+1000;
        y = ~~(Math.random()*500)+1000;

        this.sigma.graph.addNode({
            id:                 'n' + record.id,
            label:              record.label,
            size:               8,
            x:                  x,
            y:                  y,
            dX:                 0,
            dY:                 0,
            defaultColor:       defaultColor,
            defaultTextColor:   '#ffffff',
            defaultShadowColor: defaultShadow
        });
    };

    this.RenderEdge = function(record) {

        this.sigma.graph.addEdge({
            id:         'e' + record.id,
            label:      record.label,
            source:     'n' + record.source,
            target:     'n' + record.target,
            type:       'curvedArrow'
        });
    };

    this.Build = function(graph) {
        var vertices;
        var edges;
        var vertex;
        var edge;
        var i;
        var j;

        this.sigma.graph.clear();

        vertices = graph.vertices;
        edges = [];
        for (i in vertices) {
            if (vertices.hasOwnProperty(i) !== false) {
                vertex = vertices[i];

                for (j in vertex.neighbours) {
                    if (vertex.neighbours.hasOwnProperty(j) !== false) {
                        edge = vertex.neighbours[j];

                        edges.push({ edge_id: edge.edge_id, source: vertex.id, target: edge.id });
                    }
                }

                try {
                    this.RenderNode({ id: vertex.id, label: vertex.label });
                }
                catch(e) {
                    // ignore existing node
                }
            }
        }

        for (i in edges) {
            if (edges.hasOwnProperty(i) !== false) {
                edge = edges[i];

                try {
                    this.RenderEdge({ id: edge.edge_id, label: 'A', source: edge.source, target: edge.target });
                }
                catch (e) {
                    // ignore existing edge
                }
            }
        }

        return this;
    };

    this.Paint = function() {
        if (this.sigma !== null && this.paintable === true) {
            this.sigma.refresh();
        }

        return this;
    };

    this.GetCanvasSize = function() {
        if (this.sigma.graph.nodes().length) {
            var w = $(this.renderingRoot).width(),
                h = $(this.renderingRoot).height();

            // The "rescale" middleware modifies the position of the nodes, but we
            // need here the camera to deal with this.
            var xMin = Infinity,
                xMax = -Infinity,
                yMin = Infinity,
                yMax = -Infinity,
                margin = 50,
                scale;

            this.sigma.graph.nodes().forEach(function (n) {
                // part of BugFix #423
                if (n.type === 'ghost') {
                    return;
                }
                xMin = Math.min(n.x, xMin);
                xMax = Math.max(n.x, xMax);
                yMin = Math.min(n.y, yMin);
                yMax = Math.max(n.y, yMax);
            });

            xMax += margin;
            xMin -= margin;
            yMax += margin;
            yMin -= margin;

            scale = Math.min(
                w / Math.max(xMax - xMin, 1),
                h / Math.max(yMax - yMin, 1)
            );

            return {
                xMin: xMin,
                xMax: xMax,
                yMin: yMin,
                yMax: yMax,
                scale: scale
            }
        }
        else {
            return {
                xMin: 0,
                xMax: 0,
                yMin: 0,
                yMax: 0,
                scale: 1
            }
        }
    };

    this.ResetCameraPosition = function() {
        var canvasSize;
        var xMin, xMax, yMin, yMax, scale, ratio;

        canvasSize = this.GetCanvasSize();
        if (canvasSize.xMin === Infinity && canvasSize.xMax === -Infinity && canvasSize.yMin === Infinity && canvasSize.yMax === -Infinity) {
            this.sigma.camera.goTo({
                x: 1000,
                y: 1000,
                ratio: 1
            });
            return;
        }

        xMin = canvasSize.xMin;
        xMax = canvasSize.xMax;
        yMin = canvasSize.yMin;
        yMax = canvasSize.yMax;
        scale = canvasSize.scale;
        ratio = 1 / scale;

        if (ratio < this.sigmaSettings.zoomMin) {
            ratio = this.sigmaSettings.zoomMin;
        }

        this.sigma.camera.goTo({
            x: (xMin + xMax) / 2,
            y: (yMin + yMax) / 2,
            ratio: ratio
        });
    };

    this.SetCameraZoom = function(ratio) {
        this.sigma.camera.goTo({
            ratio: 1-ratio
        });
    };

    return this;
};
