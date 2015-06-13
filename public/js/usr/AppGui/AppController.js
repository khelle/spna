var AppController = function() {
    this.app = null;

    this.Start = function() {
        this.app = new AppModel().Init();

        this
            .AttachEvents()
        ;

        this.app
            .ShowInstructions()
        ;

        return this;
    };

    this.AttachEvents = function() {
        var app       = this.app;
        var evenement = app.Evenement;
        var keyboard  = app.Keyboard;
        var renderer  = app.Renderer;
        var media     = app.Media;
        var analyzer  = app.Analyzer;

        evenement.Register(window, 'resize', $.proxy(app.AdjustAppSize, app));
        //evenement.Register(window, 'beforeunload', $.proxy(app.ExitMessage, app));
        window.onbeforeunload = app.ExitMessage;

        evenement.Register($('#btn-1')[0], 'click', $.proxy(app.BuildModeSwitch, app));
        evenement.Register($('#btn-2')[0], 'click', $.proxy(app.DemolishModeSwitch, app));
        evenement.Register($('#canvas-zoom-input')[0], 'input', $.proxy(app.AdjustCameraZoom, app));
        evenement.Register($('#btn-3')[0], 'click', $.proxy(renderer.SwitchSelectedNode, renderer));
        evenement.Register($('#btn-4')[0], 'click', $.proxy(renderer.SaveCanvas, renderer));
        evenement.Register($('#btn-5')[0], 'click', $.proxy(app.SaveCameraPosition, app));
        evenement.Register($('#btn-6')[0], 'click', $.proxy(app.RestoreCameraPosition, app));
        evenement.Register($('#btn-7')[0], 'click', $.proxy(renderer.ResetCameraPosition, renderer));
        evenement.Register($('#btn-8')[0], 'click', $.proxy(media.PrepareDownload, media));
        evenement.Register($('#btn-9')[0], 'click', $.proxy(media.PrepareUpload, media));
        evenement.Register($('#btn-10')[0], 'click', $.proxy(analyzer.DownloadAnalysis, analyzer));
        evenement.Register($('#btn-11')[0], 'click', $.proxy(app.ShowInstructions, app));
        evenement.Register($('#btn-12')[0], 'click', $.proxy(app.SimulationModeSwitch, app));
        evenement.Register($('#btn-13')[0], 'click', $.proxy(analyzer.GetActiveTransitions, analyzer));
        evenement.Register($('#btn-14')[0], 'click', $.proxy(app.PriorityModeSwitch, app));
        evenement.Register($('#btn-15')[0], 'click', $.proxy(analyzer.DownloadCoverabilityGraph, analyzer));
        evenement.Register($('#btn-16')[0], 'click', $.proxy(analyzer.DownloadReachabilityGraph, analyzer));
        evenement.Register($('#prompt-layer .prompt-bg:first')[0], 'click', $.proxy(app.ClosePromptMessage, app));
        evenement.Register($('#window-layer .prompt-bg:first')[0], 'click', $.proxy(app.CloseWindowMessage, app));

        keyboard.BindKeyIn(
            keyboard.KEY.LCTRL, 'BuildModeActivator', $.proxy(app.BuildModeOn, app)
        );
        keyboard.BindKeyOut(
            keyboard.KEY.LCTRL, 'BuildModeActivator', $.proxy(app.BuildModeOff, app)
        );

        keyboard.BindKeyIn(
            keyboard.KEY.LSHIFT, 'DemolishModeActivator', $.proxy(app.DemolishModeOn, app)
        );
        keyboard.BindKeyOut(
            keyboard.KEY.LSHIFT, 'DemolishModeActivator', $.proxy(app.DemolishModeOff, app)
        );

        keyboard.BindKeyOut(
            keyboard.KEY.CAPS, 'SimulationModeActivator', $.proxy(app.SimulationModeSwitch, app)
        );

        keyboard.BindKeyOut(
            keyboard.KEY.ESC, 'ClosePrompts', $.proxy(function() {
                var app = this;
                app.ClosePromptMessage();
                app.CloseWindowMessage();
            }, app)
        );

        keyboard.BindKeyOut(
            90, 'ReleaseSelection', $.proxy(renderer.SwitchSelectedNode, renderer)
        );
        keyboard.BindKeyOut(
            67, 'CameraSaver', $.proxy(app.SaveCameraPosition, app)
        );
        keyboard.BindKeyOut(
            86, 'CameraLoader', $.proxy(app.RestoreCameraPosition, app)
        );
        keyboard.BindKeyOut(
            88, 'CameraReset', $.proxy(renderer.ResetCameraPosition, renderer)
        );

        return this;
    };

    return this;
};
