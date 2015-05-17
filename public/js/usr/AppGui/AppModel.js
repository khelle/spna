var AppModel = function() {
    this.box         = null;
    this.popBox      = null;
    this.Keyboard    = null;
    this.Storage     = null;
    this.Renderer    = null;
    this.Evenement   = null;
    this.ModeManager = null;

    this.MODES = {
        BUILD:      'build',
        DEMOLISH:   'demolish'
    };

    this.Init = function() {
        this.box         = $('#box');
        this.Keyboard    = new Keyboard();
        this.Storage     = new PetriStorage(this);
        this.Renderer    = new GraphRenderer(this, document.querySelector('#graph-canvas'));
        this.Evenement   = new Evenement(this);
        this.ModeManager = new ModeManager(this);

        this
            .AdjustAppSize()
        ;

        this.Keyboard.Init();
        this.Storage. Init();
        this.Renderer.Init();

        this
            .SetModes()
        ;

        return this;
    };

    this.SetModes = function() {
        var man = this.ModeManager;
        var buildMode, demolishMode;
        var On = 'On', Off = 'Off';

        buildMode    = new Mode(this.MODES.BUILD);
        demolishMode = new Mode(this.MODES.DEMOLISH);

        buildMode.SetCallback(On, $.proxy(this.OnBuildModeOn, this));
        buildMode.SetCallback(Off, $.proxy(this.OnBuildModeOff, this));
        buildMode.AddDependency(On, demolishMode.GetName(), Off);

        demolishMode.SetCallback(On, $.proxy(this.OnDemolishModeOn, this));
        demolishMode.SetCallback(Off, $.proxy(this.OnDemolishModeOff, this));
        demolishMode.AddDependency(On, buildMode.GetName(), Off);

        man.SetMode(buildMode.GetName(), buildMode);
        man.SetMode(demolishMode.GetName(), demolishMode);

        return this;
    };

    this.BuildModeOn = function() {
        return this.ModeManager.TurnOnMode(this.MODES.BUILD);
    };

    this.OnBuildModeOn = function() {
        this.PopMessage('Build mode ON...');
    };

    this.BuildModeOff = function() {
        return this.ModeManager.TurnOffMode(this.MODES.BUILD);
    };

    this.OnBuildModeOff = function() {
        this.PopMessage('Build mode OFF...');
    };

    this.BuildModeSwitch = function() {
        if (this.ModeManager.IsOn(this.MODES.BUILD)) {
            this.ModeManager.TurnOffMode(this.MODES.BUILD);
        }
        else {
            this.ModeManager.TurnOnMode(this.MODES.BUILD);
        }
    };

    this.DemolishModeOn = function() {
        return this.ModeManager.TurnOnMode(this.MODES.DEMOLISH);
    };

    this.OnDemolishModeOn = function() {
        this.PopMessage('Demolish mode ON...');
    };

    this.DemolishModeOff = function() {
        return this.ModeManager.TurnOffMode(this.MODES.DEMOLISH);
    };

    this.OnDemolishModeOff = function() {
        this.PopMessage('Demolish mode OFF...');
    };

    this.DemolishModeSwitch = function() {
        if (this.ModeManager.IsOn(this.MODES.DEMOLISH)) {
            this.ModeManager.TurnOffMode(this.MODES.DEMOLISH);
        }
        else {
            this.ModeManager.TurnOnMode(this.MODES.DEMOLISH);
        }
    };

    this.AdjustCameraZoom = function(input) {
        this.PopMessage('Zoom set to x' + ~~(10/(1-input.target.value/64))/10);
        this.Renderer.SetCameraZoom(input.target.value/64);
    };

    this.SaveCameraPosition = function() {
        this.PopMessage('Camera position has been saved.');
        this.Renderer.SaveCameraPosition();
    };

    this.RestoreCameraPosition = function() {
        this.PopMessage('Camera position has been restored.');
        this.Renderer.RestoreCameraPosition();
    };

    this.ExitMessage = function() {
        return 'Are you sure you want to exit application? All unsaved data will be lost.';
    };

    this.AdjustAppSize = function() {
        var w, h, m,pw, ph;

        if (this.box == null) {
            return this;
        }

        w = $(window).width();
        h = $(window).height();
        m  = parseInt(this.box.css('marginTop').replace("px","")) + parseInt(this.box.css('paddingTop').replace("px",""));
        pw = parseInt(this.box.find('#box-body').css('paddingLeft').replace("px",""));
        ph = parseInt(this.box.find('#box-body').css('paddingTop').replace("px",""));

        w = w - m*2 - pw*2;
        h = h - m*2 - ph*2 - 45;

        this.box.find('#canvas, #graph-canvas').css({
          'width': w,
          'height': h
        });

        return this;
    };

    this.PopMessage = function(message) {
        if (this.popBox === null) {
            this.popBox = this.box.find('#popup-message');
        }

        this.popBox.html(message).css({
            display: 'block',
            opacity: 1
        });

        this.popBox.stop().delay(500).animate({
            opacity: 0
        }, 1000, "linear", function() {
            $(this).css({
                display: 'none'
            });
        });

        return this;
    };

    return this;
};
