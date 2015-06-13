var GraphRenderer = function(app, renderingRoot) {
    this.app                 = app;
    this.renderingRoot       = renderingRoot;
    this.mouseLayer          = null;
    this.sigma               = null;
    this.sigmaRenderer       = null;
    this.sigmaCameraViewport = null;
    this.mode                = 0;
    this.selectedNode        = null;
    this.lastSelectedNode    = null;
    this.paintable           = true;
    this.activeTrans         = {};
    this.blockclick          = false;

    this.sigmaSettings = {
        autoRescale: false,
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
        sigma.canvas.nodes.place      = this.PlaceRenderer;
        sigma.canvas.nodes.transition = this.TransitionRenderer;

        this.sigma.bind('overNode', $.proxy(this.OverNode, this));
        this.sigma.bind('outNode', $.proxy(this.OutNode, this));
        this.sigma.bind('clickNode', $.proxy(this.ClickNode, this));
        this.sigma.bind('doubleClickNode', $.proxy(this.DoubleClickNode, this));
        this.sigma.bind('rightClickNode', $.proxy(this.RightClickNode, this));

        this.mouseLayer = this.renderingRoot.querySelector('canvas:last-child');

        this.app.Evenement.Register(
            this.mouseLayer, 'click', $.proxy(this.AddPlace, this)
        );
        this.app.Evenement.Register(
            this.mouseLayer, 'contextmenu', $.proxy(this.AddTransition, this)
        );

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
                var x = e.data.node.x;
                var y = e.data.node.y;
                var storageID = e.data.node.storageID;

                renderer.app.Storage.SetPlacePos(storageID, x, y);

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

    this.EnableDrawingPriorities = function() {
        this.sigmaRenderer.settings({drawPriorities: true});
    };

    this.DisableDrawingPriorities = function() {
        this.sigmaRenderer.settings({drawPriorities: false});
    };

    this.PlaceRenderer = function(node, ctx, settings) {
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
            (node.markers > 0 ? node.markers : ''),
            0,
            (node[prefix + 'size'] / 2)
        );

        ctx.restore();
    };

    this.TransitionRenderer = function(node, ctx, settings) {
        var prefix = settings('prefix') || '';
        var nx = node[prefix + 'x'];
        var ny = node[prefix + 'y'];
        var nsize = node[prefix + 'size'];
        var fontSize = (settings('nodeTextSize') === 'fixed') ? settings('defaultNodeTextSize') : settings('defaultNodeTextSize') * size * Math.pow(size, -1 / settings('nodeTextSizePowRatio'));

        ctx.shadowBlur = 0;

        var shadowColor = node.shadowColor || settings('defaultShadowColor');

        if (shadowColor !== 'default') {
            ctx.shadowColor = shadowColor;
            ctx.shadowBlur = 10;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
        }

        ctx.fillStyle = node.color || settings('defaultTransitionColor');
        ctx.fillRect(
            nx-nsize,
            ny-nsize,
            nsize*2,
            nsize*2
        );
        ctx.save();

        ctx.shadowBlur = 0;

        if (!settings('drawPriorities')) {
            return;
        }

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
            (node.priority > 1 ? node.priority : ''),
            0,
            (node[prefix + 'size'] / 2)
        );

        ctx.restore();
    };

    this.RenderNode = function(record, defaultColor, defaultShadow) {
        defaultColor = defaultColor || 'default';
        defaultShadow = defaultShadow || 'default';

        this.sigma.graph.addNode({
            id:                 'n' + record.id,
            storageID:          record.id,
            markers:            record.markers,
            priority:           record.priority,
            label:              record.label,
            size:               8,
            x:                  record.x,
            y:                  record.y,
            dX:                 0,
            dY:                 0,
            type:               record.type,
            defaultColor:       defaultColor,
            defaultTextColor:   '#ffffff',
            defaultShadowColor: defaultShadow,
            lastColor:          defaultColor,
            lastTextColor:      '#ffffff',
            lastShadowColor:    defaultShadow
        });
    };

    this.DropNode = function(id) {
        this.sigma.graph.dropNode('n' + id);
    };

    this.RenderConnection = function(record, edgeType) {

        this.sigma.graph.addEdge({
            id:         'e' + record.id,
            storageID:  record.id,
            label:      (record.cost > 1) ? '' + record.cost : '',
            cost:       record.cost,
            source:     'n' + record.source,
            target:     'n' + record.target,
            type:       edgeType
        });
    };

    this.DropConnection = function(id) {
        this.sigma.graph.dropEdge('e' + id);
    };

    this.GetMouseXY = function(e) {
        var x, y, p;

        x = sigma.utils.getX(e) - this.renderingRoot.offsetWidth / 2;
        y = sigma.utils.getY(e) - this.renderingRoot.offsetHeight / 2;
        p = this.sigma.camera.cameraPosition(x, y);

        return { x: p.x, y: p.y };
    };

    this.PaintFromStorage = function() {
        var record;
        var records;
        var checked;
        var el, key;
        var toDel, keyDel;
        var edges, edgeType;

        records = this.app.Storage.GetAll();
        checked = {};
        // places
        for (key in records[0]) {
            if (records[0].hasOwnProperty(key) !== false) {
                record = records[0][key];
                checked[record.id] = true;

                if (
                    (el = this.sigma.graph.nodes('n' + record.id)) !== undefined
                    && (
                        (record.type === this.app.Storage.PLACE && this.app.Storage.ComparePlaces(el, record) !== true)
                        ||
                        (record.type === this.app.Storage.TRANSITION && this.app.Storage.CompareTransitions(el, record) !== true)
                    )
                ) {
                    this.DropNode(record.id);
                }

                try {
                    this.RenderNode(record, '#cc0000');
                }
                catch(e) {
                    // ignore existing node
                }
            }
        }

        // transitions
        for (key in records[1]) {
            if (records[1].hasOwnProperty(key) !== false) {
                record = records[1][key];
                checked[record.id] = true;

                if (
                    (el = this.sigma.graph.nodes('n' + record.id)) !== undefined
                    && (
                    (record.type === this.app.Storage.PLACE && this.app.Storage.ComparePlaces(el, record) !== true)
                    ||
                    (record.type === this.app.Storage.TRANSITION && this.app.Storage.CompareTransitions(el, record) !== true)
                    )
                ) {
                    this.DropNode(record.id);
                }

                try {
                    this.RenderNode(record, '#cc0000');
                }
                catch(e) {
                    // ignore existing node
                }
            }
        }

        // remove
        toDel = {};
        this.sigma.graph.nodes().forEach(function(n) {
            if (n.type !== 'ghost' && checked[n.storageID] === undefined) {
                toDel[n.storageID] = true;
            }
        });

        for (keyDel in toDel) {
            if (toDel.hasOwnProperty(keyDel) !== false) {
                this.DropNode(keyDel);
            }
        }

        // -----

        edges = this.app.Storage.GetConnections();
        checked = {};

        for (key in edges) {
            if (edges.hasOwnProperty(key) !== false) {
                record = edges[key];
                checked[record.id] = true;

                if (this.app.Storage.GetConnection(record.target, record.source) !== null) {
                    edgeType = 'curvedArrow';
                }
                else {
                    edgeType = 'arrow';
                }

                if (
                    (el = this.sigma.graph.edges('e' + record.id)) !== undefined
                    && (
                        this.app.Storage.CompareConnections(el, record) !== true
                        ||
                        el.type !== edgeType
                    )
                ) {
                    this.DropConnection(record.id);
                }

                try {
                    this.RenderConnection(record, edgeType);
                }
                catch(e) {
                    // ignore
                }
            }
        }

        // remove
        toDel = {};
        this.sigma.graph.edges().forEach(function(e) {
            if (checked[e.storageID] === undefined) {
                toDel[e.storageID] = true;
            }
        });

        for (keyDel in toDel) {
            if (toDel.hasOwnProperty(keyDel) !== false) {
                this.DropConnection(keyDel);
            }
        }

        return this;
    };

    this.Paint = function() {
        if (this.sigma != null && this.paintable === true) {
            this.PaintFromStorage();
            this.sigma.refresh();
        }

        return this;
    };

    this.GetCanvasSize = function() {
        if (this.sigma.graph.nodes().length) {
            var w = this.renderingRoot.offsetWidth,
                h = this.renderingRoot.offsetHeight;

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

    this.MoveCameraTo = function(x, y) {
        this.sigma.camera.goTo({
            x: x,
            y: y,
            ratio: 1
        });
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
            ratio: 1
        });
    };

    this.SetCameraZoom = function(ratio) {
        this.sigma.camera.goTo({
            ratio: 1-ratio
        });
    };

    this.AddPlace = function(e) {
        e.preventDefault();

        if (this.app.ModeManager.IsOn(this.app.MODES.BUILD) && !this.blockclick && this.selectedNode === null) {
            var pos = this.GetMouseXY(e);

            this.app.Storage.AddPlace(pos.x, pos.y, 'P' + this.app.Storage.GetPlaceCurrentNumo().toString(), 0);
            this.Paint();
        }
        else if (!this.blockclick) {
            this.DeselectCurrentNode();
        }
        else {
            this.blockclick = false;
        }

        return false;
    };

    this.AddTransition = function(e) {
        e.preventDefault();

        if (this.app.ModeManager.IsOn(this.app.MODES.BUILD) && !this.blockclick && this.selectedNode === null) {
            var pos = this.GetMouseXY(e);

            this.app.Storage.AddTransition(pos.x, pos.y, 'T' + this.app.Storage.GetTransitionCurrentNumo().toString(), 1);
            this.Paint();
        }
        else {
            this.blockclick = false;
        }

        return false;
    };

    this.RemovePlace = function(id) {
        if (this.app.ModeManager.IsOn(this.app.MODES.DEMOLISH)) {
            this.app.Storage.RemovePlace(id);
            this.Paint();
        }
    };

    this.RemoveTransition = function(id) {
        if (this.app.ModeManager.IsOn(this.app.MODES.DEMOLISH)) {
            this.app.Storage.RemoveTransition(id);
            this.Paint();
        }
    };

    this.AddConnection = function(sourceID, targetID) {
        this.app.Storage.AddConnection(sourceID, targetID, 1);
        this.Paint();
    };

    this.RemoveConnection = function(sourceID, targetID) {
        this.app.Storage.RemoveConnection(sourceID, targetID);
        this.Paint();
    };

    this.OverNode = function() {

    };

    this.OutNode = function() {

    };

    this.ClickNode = function(e) {
        var node = e.data.node;

        if (this.app.ModeManager.IsOn(this.app.MODES.DEMOLISH) && this.selectedNode === null) {
            if (node.type === this.app.Storage.PLACE) {
                this.RemovePlace(node.storageID);
            }
            else if (node.type === this.app.Storage.TRANSITION) {
                this.RemoveTransition(node.storageID);
            }
        }
        else if (this.app.ModeManager.IsOn(this.app.MODES.DEMOLISH) && this.selectedNode !== null) {
            this.blockclick = true;
            this.RemoveConnection(this.selectedNode, node.storageID);
        }
        else if (this.app.ModeManager.IsOn(this.app.MODES.BUILD) && this.selectedNode !== null) {
            this.blockclick = true;
            this.AddConnection(this.selectedNode, node.storageID);
        }
        else if (this.selectedNode !== node.storageID) {
            this.blockclick = true;
            this.SelectNode(node.storageID);
        }
        else {
            this.blockclick = true;
            this.DeselectNode(this.selectedNode);
        }
    };

    this.DoubleClickNode = function(e) {
        var node = e.data.node;

        this.SelectNode(node.storageID);
    };

    this.RightClickNode = function(e) {
        var node = e.data.node;

        if (this.app.ModeManager.IsOn(this.app.MODES.BUILD) && this.selectedNode !== null) {
            this.SelectNode(node.storageID);
        }
        else if (this.app.ModeManager.IsOn(this.app.MODES.DEMOLISH) && this.selectedNode !== null) {
            if (node.type === this.app.Storage.PLACE) {
                this.RemovePlace(node.storageID);
            }
            else if (node.type === this.app.Storage.TRANSITION) {
                this.RemoveTransition(node.storageID);
            }
        }
    };

    this.ResetColoring = function() {
        var nodes;
        var node;
        var key;

        nodes = this.sigma.graph.nodes();

        for (key in nodes) {
            if (nodes.hasOwnProperty(key) !== false) {
                node = nodes[key];

                node.color = node.defaultColor;
                node.textColor = '#ffffff';
                node.shadowColor = node.defaultShadowColor;

                node.lastColor = node.color;
                node.lastTextColor = node.textColor;
                node.lastShadowColor = node.shadowColor;
            }
        }
    };

    this.ColorNode = function(id, color, textColor) {
        var node = this.sigma.graph.nodes('n' + id);
        var tmpColor;
        var tmpTextColor;
        var tmpShadowColor;

        if (node !== undefined) {
            tmpColor = node.color;
            tmpTextColor = node.textColor;
            tmpShadowColor = node.shadowColor;

            node.color = color || node.lastColor;
            node.textColor = textColor || node.lastTextColor;
            node.shadowColor = color || node.lastShadowColor;

            node.lastColor = tmpColor;
            node.lastTextColor = tmpTextColor;
            node.lastShadowColor = tmpShadowColor;

            this.selectedNode = id;
        }
    };

    this.SelectNode = function(id) {
        this.DeselectCurrentNode();

        this.ColorNode(id, '#ffff00', '#000000');

        this.RenderTooltip(id);
        this.RenderSimButtons(id);
        this.Paint();
    };

    this.DeselectNode = function(id) {
        var node = this.sigma.graph.nodes('n' + id);

        if (node !== undefined && node.color === '#ffff00') {
            this.ColorNode(id);
        }

        this.ClearTooltip();
        this.ClearSimButtons();
        this.Paint();

        this.lastSelectedNode = this.selectedNode;
        this.selectedNode     = null;
    };

    this.DeselectCurrentNode = function() {
        if (this.selectedNode !== null) {
            this.DeselectNode(this.selectedNode);
        }
    };

    this.RestorePreviousSelectedNode = function() {
        if (this.lastSelectedNode !== null) {
            this.SelectNode(this.lastSelectedNode);
        }
    };

    this.SwitchSelectedNode = function() {
        if (this.selectedNode === null) {
            this.RestorePreviousSelectedNode();
        }
        else {
            this.DeselectCurrentNode();
        }
    };

    this.SaveCanvas = function() {
        this.DeselectCurrentNode();
        this.RenderTempCopy();

        var canv  = document.querySelector('#temp-canvas .sigma-scene');
        var curl  = canv.toDataURL( "image/jpeg", 1.0 );
        var saver = document.getElementById('canvas-download');

        var app = this.app;
        var message = 'File is being downloaded. If you don\'t see downloading window, please go to your browser default downloading directory.';
        app.PromptMessage(
            'Downloading File...',
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

        saver.href = curl;
        saver.click();

        //this.ClearTempCopy();
        this.ResetCameraPosition();
        this.RestorePreviousSelectedNode();
    };

    this.SaveCameraPosition = function() {
        this.sigmaCameraViewport = {
            x: this.sigma.camera.x,
            y: this.sigma.camera.y,
            ratio: this.sigma.camera.ratio
        }
    };

    this.RestoreCameraPosition = function() {
        if (this.sigmaCameraViewport === null) {
            return;
        }

        this.sigma.camera.goTo({
            x: this.sigmaCameraViewport.x,
            y: this.sigmaCameraViewport.y,
            ratio: this.sigmaCameraViewport.ratio
        });
    };

    this.RenderTempCopy = function() {
        var canvasContainer;
        
        canvasContainer = document.getElementById('temp-canvas-container');
        canvasContainer.innerHTML = '<div id="temp-canvas"></div>';

        var tempRoot = document.querySelector('#temp-canvas');
        var tempSize = this.GetCanvasSize();
        var emptyCanvas = false;

        if (tempSize.xMin === Infinity && tempSize.xMax === -Infinity && tempSize.yMin === Infinity && tempSize.yMax === -Infinity) {
            tempSize.xMin = 0;
            tempSize.xMax = 0;
            tempSize.yMin = 0;
            tempSize.yMax = 0;
            emptyCanvas = true;
        }

        tempRoot.style.width  = (Math.abs(tempSize.xMax-tempSize.xMin) + 100) + 'px';
        tempRoot.style.height = (Math.abs(tempSize.yMax-tempSize.yMin) + 100) + 'px';

        var tempSigma = new sigma({
            renderer: {
                container: tempRoot,
                type: 'canvas'
            },
            settings: this.sigmaSettings
        });

        var nodes = this.sigma.graph.nodes();
        var edges = this.sigma.graph.edges();
        var node;
        var edge;

        var key;
        for (key in nodes) {
            node = nodes[key];

            node.x = node.x - tempSize.xMin;
            node.y = node.y - tempSize.yMin;

            tempSigma.graph.addNode(node);
        }

        for (key in edges) {
            edge = edges[key];
            tempSigma.graph.addEdge(edge);
        }

        var cameraX;
        var cameraY;

        if (!emptyCanvas) {
            cameraX = (tempSize.xMax - tempSize.xMin) / 2;
            cameraY = (tempSize.yMax - tempSize.yMin) / 2;
        }
        else {
            cameraX = 50;
            cameraY = 50;
        }

        tempSigma.camera.goTo({
            x: cameraX,
            y: cameraY
        });

        tempSigma.refresh();
    };

    this.ClearTempCopy = function() {
        var canvas = document.querySelector('#temp-canvas');
        canvas.innerHTML = '';
        canvas.style = '';
    };

    this.RenderSimMainButtons = function() {
        var tooltipBox;
        var tooltipButtons;
        var tooltipButtonsDiv;
        var node;
        var el;

        if (this.app.ModeManager.IsOff(this.app.MODES.SIMULATE)) {
            return;
        }

        tooltipBox     = document.querySelector('#tooltip-box-sim');
        tooltipButtons = document.querySelector('#tooltip-place-glob-buttons');

        tooltipButtonsDiv = tooltipButtons.querySelector('div');

        el = document.createElement('div');
        el.className = 'prompt-button';
        el.innerHTML = 'execute random';

        $(el).on('click', (function(proxy) {
            return function() {
                var id;
                var keys;
                var node

                keys = Object.keys(proxy.activeTrans);
                id = keys[ keys.length * Math.random() << 0];

                proxy.app.Analyzer.ExecuteTransition(id);

                node = proxy.sigma.graph.nodes('n' + id);
                proxy.MoveCameraTo(node.x, node.y);
                proxy.SelectNode(id);

                return false;
            };
        })(this));

        tooltipButtonsDiv.innerHTML = '';
        tooltipButtonsDiv.appendChild(el);

        tooltipButtons.style.display = "block";
        tooltipBox.style.display = "block";
    };

    this.ClearSimMainButtons = function() {
        var tooltipBox;
        var tooltipButtons;

        tooltipBox     = document.querySelector('#tooltip-box-sim');
        tooltipButtons = document.querySelector('#tooltip-place-glob-buttons');

        tooltipBox.style.display = "none";
        tooltipButtons.style.display = "none";
    };

    this.RenderSimButtons = function(id) {
        var tooltipBox;
        var tooltipButtons;
        var tooltipButtonsDiv;
        var node;
        var el;

        if (this.app.ModeManager.IsOff(this.app.MODES.SIMULATE)) {
            return;
        }

        if (id === false) {
            return;
        }

        node = this.sigma.graph.nodes('n' + id);

        if (node === undefined || this.activeTrans[id] === undefined) {
            return;
        }

        tooltipBox         = document.querySelector('#tooltip-box');
        tooltipButtons     = document.querySelector('#tooltip-place-buttons');

        tooltipButtonsDiv = tooltipButtons.querySelector('div');

        el = document.createElement('div');
        el.className = 'prompt-button';
        el.innerHTML = 'execute transition';

        $(el).on('click', (function(proxy, id) {
            return function() {
                proxy.app.Analyzer.ExecuteTransition(id);
                return false;
            };
        })(this, id));

        tooltipButtonsDiv.innerHTML = '';
        tooltipButtonsDiv.appendChild(el);

        tooltipButtons.style.display = "block";
        tooltipBox.style.display = "block";
    };

    this.ClearSimButtons = function() {
        var tooltipBox;
        var tooltipButtons;

        tooltipBox     = document.querySelector('#tooltip-box');
        tooltipButtons = document.querySelector('#tooltip-place-buttons');

        tooltipBox.style.display = "none";
        tooltipButtons.style.display = "none";
    };

    this.RenderTooltip = function(id) {
        var node;
        var attrs;
        var edge;
        var edges;
        var tooltipBox;
        var tooltipData;
        var tooltipIEdges;
        var tooltipOEdges;
        var tooltipDataDiv;
        var tooltipIEdgesDiv;
        var tooltipOEdgesDiv;
        var i;
        var val;

        if (this.app.ModeManager.IsOn(this.app.MODES.SIMULATE)) {
            return;
        }

        node = this.sigma.graph.nodes('n' + id);

        if (node === undefined) {
            return;
        }

        attrs = [];
        if (node.type === this.app.Storage.PLACE) {
            attrs = [ 'label', 'markers' ];
        }
        else if (node.type === this.app.Storage.TRANSITION) {
            attrs = [ 'label' ];

            if (this.app.ModeManager.IsOn(this.app.MODES.PRIORITY)) {
                attrs.push('priority');
            }
        }
        else {
            return;
        }

        tooltipBox    = document.querySelector('#tooltip-box');
        tooltipData   = document.querySelector('#tooltip-place-data');
        tooltipIEdges = document.querySelector('#tooltip-place-iedges');
        tooltipOEdges = document.querySelector('#tooltip-place-oedges');

        tooltipDataDiv   = tooltipData.querySelector('div');
        tooltipIEdgesDiv = tooltipIEdges.querySelector('div');
        tooltipOEdgesDiv = tooltipOEdges.querySelector('div');

        tooltipDataDiv.innerHTML = '';
        tooltipIEdgesDiv.innerHTML = '';
        tooltipOEdgesDiv.innerHTML = '';

        for (i in attrs) {
            if (attrs.hasOwnProperty(i) !== false) {
                this.AddTooltipAttr(tooltipDataDiv, id, attrs[i], attrs[i], node[attrs[i]]);
            }
        }

        if (attrs.length > 0) {
            tooltipData.style.display = "block";
        }

        edges = this.app.Storage.GetIncidentConnections(id);
        val = [ 0, 0 ];

        for (i in edges) {
            if (edges.hasOwnProperty(i) !== false) {
                edge = edges[i];

                if (edge.target === id) {
                    node = this.app.Storage.GetPlace(edge.source);
                    this.AddTooltipEdge(tooltipIEdgesDiv, edge.id, node.label + '::cost', 'cost', edge.cost);
                    val[0]++;
                }
                else if (edge.source === id) {
                    node = this.app.Storage.GetPlace(edge.target);
                    this.AddTooltipEdge(tooltipOEdgesDiv, edge.id, node.label + '::cost', 'cost', edge.cost);
                    val[1]++;
                }
            }
        }

        if (val[0] > 0) {
            tooltipIEdges.style.display = "block";
        }
        if (val[1] > 0) {
            tooltipOEdges.style.display = "block";
        }

        tooltipBox.style.display = "block";
    };

    this.AddTooltipAttr = function(container, id, label, key, val) {
        var tooltipDiv;
        var tooltipInput;

        tooltipInput = document.createElement('input');
        tooltipInput.className = "tooltip-input";
        tooltipInput.type = "text";
        tooltipInput.value = val;
        tooltipInput.onkeyup = (function(renderer, id, type) {
            return function() {
                if (this.value.match(/^([a-zA-Z0-9_\s]*?)$/gi) !== null) {
                    renderer.app.Storage.SetPlaceData(id, type, this.value);
                    renderer.Paint();
                }
            };
        })(this, id, key);

        tooltipDiv = document.createElement('div');
        tooltipDiv.className = "tooltip-div";
        tooltipDiv.innerHTML = label;
        tooltipDiv.appendChild(tooltipInput);

        container.appendChild(tooltipDiv);
    };

    this.AddTooltipEdge = function(container, id, label, key, val) {
        var tooltipDiv;
        var tooltipInput;

        tooltipInput = document.createElement('input');
        tooltipInput.className = "tooltip-input";
        tooltipInput.type = "text";
        tooltipInput.value = val;
        tooltipInput.onkeyup = (function(renderer, id, type) {
            return function() {
                if (this.value.match(/^([a-zA-Z0-9_\s]*?)$/gi) !== null) {
                    renderer.app.Storage.SetConnectionData(id, type, this.value);
                    renderer.Paint();
                }
            };
        })(this, id, key);

        tooltipDiv = document.createElement('div');
        tooltipDiv.className = "tooltip-div";
        tooltipDiv.innerHTML = label;
        tooltipDiv.appendChild(tooltipInput);

        container.appendChild(tooltipDiv);
    };

    this.ClearTooltip = function() {
        var tooltipBox;
        var tooltipData;
        var tooltipIEdges;
        var tooltipOEdges;

        tooltipBox    = document.querySelector('#tooltip-box');
        tooltipData   = document.querySelector('#tooltip-place-data');
        tooltipIEdges = document.querySelector('#tooltip-place-iedges');
        tooltipOEdges = document.querySelector('#tooltip-place-oedges');

        tooltipBox.style.display = "none";
        tooltipData.style.display = "none";
        tooltipIEdges.style.display = "none";
        tooltipOEdges.style.display = "none";
    };

    this.Freeze = function() {
        this.ClearTooltip();
        this.UnregisterDraggableNodes();
    };

    this.Unfreeze = function() {
        this.activeTrans = {};
        this.ResetColoring();
        this.ClearNotes();
        this.ClearSimMainButtons();
        this.ClearSimButtons();
        this.RegisterDraggableNodes();
    };

    this.ShowNotesOfTransitionsVitality = function(data) {
        var key;
        var row;
        var node;
        var nameParts;

        for (key in data) {
            if (data.hasOwnProperty(key) !== false) {
                row = data[key];

                node = this.app.Storage.GetTransition(row.transition);

                nameParts = node.label.split('::');

                node.label = nameParts[0] += '::' + row.vitality;
            }
        }

        this.Paint();
    };

    this.ShowNotesOfActiveTransitions = function(data) {
        var key;
        var row;
        var cnt;

        cnt = 0;
        this.activeTrans = {};
        for (key in data) {
            if (data.hasOwnProperty(key) !== false) {
                row = data[key];

                this.activeTrans[row.id] = true;
                this.ColorNode(row.id, '#ffa500', '#000000');
                cnt++;
            }
        }

        if (cnt > 0) {
            this.RenderSimMainButtons();
        }
        this.Paint();
    };

    this.ClearNotes = function() {
        var key;
        var data;
        var places;
        var trans;
        var node;
        var nameParts;

        data = this.app.Storage.GetAll();

        places = data[0];
        trans  = data[1];

        for (key in trans) {
            if (trans.hasOwnProperty(key) !== false) {
                node = trans[key];

                nameParts = node.label.split('::');
                if (node.label !== nameParts[0]) {
                    node.label = nameParts[0];
                }
            }
        }

        this.Paint();
    };

    return this;
};
