var AppController = function() {
    this.app = null;

    this.Start = function() {
        this.app = new AppModel().Init();

        this
            .AttachEvents()
        ;

        return this;
    };

    this.AttachEvents = function() {
        var app       = this.app;
        var evenement = app.Evenement;
        var keyboard  = app.Keyboard;
        var renderer  = app.Renderer;

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
