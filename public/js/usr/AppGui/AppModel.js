var AppModel = function() {
    this.box         = null;
    this.popBox      = null;
    this.Keyboard    = null;
    this.Storage     = null;
    this.Renderer    = null;
    this.Evenement   = null;
    this.ModeManager = null;
    this.Media       = null;
    this.Analyzer    = null;

    this.MODES = {
        BUILD:      'build',
        DEMOLISH:   'demolish',
        SIMULATE:   'simulate',
        PRIORITY:   'priority'
    };

    this.Init = function() {
        this.box         = $('#box');
        this.Keyboard    = new Keyboard();
        this.Storage     = new PetriStorage(this, new Ajax());
        this.Renderer    = new GraphRenderer(this, document.querySelector('#graph-canvas'));
        this.Evenement   = new Evenement(this);
        this.ModeManager = new ModeManager(this);
        this.Media       = new MediaManager(this, new Ajax(this));
        this.Analyzer    = new Analyzer(this, new Ajax(this));

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
        var man;
        var buildMode;
        var demolishMode;
        var simulationMode;
        var priorityMode;
        var On;
        var Off;

        man = this.ModeManager;

        On = 'On';
        Off = 'Off';

        buildMode      = new Mode(this.MODES.BUILD);
        demolishMode   = new Mode(this.MODES.DEMOLISH);
        simulationMode = new Mode(this.MODES.SIMULATE);
        priorityMode   = new Mode(this.MODES.PRIORITY);

        buildMode.SetCallback(On, $.proxy(this.OnBuildModeOn, this));
        buildMode.SetCallback(Off, $.proxy(this.OnBuildModeOff, this));
        buildMode.AddDependency(On, demolishMode.GetName(), Off);
        buildMode.AddRequirement(On, simulationMode.GetName(), Off);

        demolishMode.SetCallback(On, $.proxy(this.OnDemolishModeOn, this));
        demolishMode.SetCallback(Off, $.proxy(this.OnDemolishModeOff, this));
        demolishMode.AddDependency(On, buildMode.GetName(), Off);
        demolishMode.AddRequirement(On, simulationMode.GetName(), Off);

        simulationMode.SetCallback(On, $.proxy(this.OnSimulationModeOn, this));
        simulationMode.SetCallback(Off, $.proxy(this.OnSimulationModeOff, this));
        simulationMode.AddDependency(On, buildMode.GetName(), Off);
        simulationMode.AddDependency(On, demolishMode.GetName(), Off);

        priorityMode.SetCallback(On, $.proxy(this.OnPriorityModeOn, this));
        priorityMode.SetCallback(Off, $.proxy(this.OnPriorityModeOff, this));

        man.SetMode(buildMode.GetName(), buildMode);
        man.SetMode(demolishMode.GetName(), demolishMode);
        man.SetMode(simulationMode.GetName(), simulationMode);
        man.SetMode(priorityMode.GetName(), priorityMode);

        return this;
    };

    this.BuildModeOn = function() {
        return this.ModeManager.TurnOnMode(this.MODES.BUILD);
    };

    this.BuildModeOff = function() {
        return this.ModeManager.TurnOffMode(this.MODES.BUILD);
    };

    this.OnBuildModeOn = function() {
        $('#btn-1').addClass('app-button-active');
        this.PopMessage('Build mode ON...');
    };

    this.OnBuildModeOff = function() {
        $('#btn-1').removeClass('app-button-active');
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


    this.DemolishModeOff = function() {
        return this.ModeManager.TurnOffMode(this.MODES.DEMOLISH);
    };

    this.OnDemolishModeOn = function() {
        $('#btn-2').addClass('app-button-active');
        this.PopMessage('Demolish mode ON...');
    };

    this.OnDemolishModeOff = function() {
        $('#btn-2').removeClass('app-button-active');
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

    this.SimulationModeOn = function() {
        return this.ModeManager.TurnOnMode(this.MODES.SIMULATE);
    };

    this.SimulationModeOff = function() {
        return this.ModeManager.TurnOffMode(this.MODES.SIMULATE);
    };

    this.OnSimulationModeOn = function() {
        this.Renderer.Freeze();
        $('#btn-12').addClass('app-button-active');
        this.PopMessage('Simulation mode ON...');
    };

    this.OnSimulationModeOff = function() {
        this.Renderer.Unfreeze();
        $('#btn-12').removeClass('app-button-active');
        this.PopMessage('Simulation mode OFF...');
    };

    this.SimulationModeSwitch = function() {
        if (this.ModeManager.IsOn(this.MODES.SIMULATE)) {
            this.ModeManager.TurnOffMode(this.MODES.SIMULATE);
        }
        else {
            this.ModeManager.TurnOnMode(this.MODES.SIMULATE);
        }
    };

    this.PriorityModeOn = function() {
        return this.ModeManager.TurnOnMode(this.MODES.PRIORITY);
    };

    this.PriorityModeOff = function() {
        return this.ModeManager.TurnOffMode(this.MODES.PRIORITY);
    };

    this.OnPriorityModeOn = function() {
        $('#btn-14').addClass('app-button-active');
        this.Analyzer.TurnPrioritiesOn();
        this.PopMessage('Priority mode ON...');
    };

    this.OnPriorityModeOff = function() {
        $('#btn-14').removeClass('app-button-active');
        this.Analyzer.TurnPrioritiesOff();
        this.PopMessage('Priority mode OFF...');
    };

    this.PriorityModeSwitch = function() {
        if (this.ModeManager.IsOn(this.MODES.PRIORITY)) {
            this.ModeManager.TurnOffMode(this.MODES.PRIORITY);
        }
        else {
            this.ModeManager.TurnOnMode(this.MODES.PRIORITY);
        }
    };

    this.SetPriorityMode = function(on) {
        if (on) {
            this.ModeManager.TurnOnMode(this.MODES.PRIORITY);
        }
        else {
            this.ModeManager.TurnOffMode(this.MODES.PRIORITY);
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

        var $preloader = $('#preloader-box');

        w = w-$preloader.width();
        h = h-$preloader.height();

        $preloader.css({
            left: w/2,
            top: h/2
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

    this.PromptMessage = function(title, message, icons, buttons) {
        icons = icons || [];
        buttons = buttons || [];

        var promptLayer;
        var promptHeader;
        var promptMessage;
        var promptButtons;
        var i;
        var icon;
        var button;

        promptLayer = this.box.find('#prompt-layer');
        promptHeader  = promptLayer.find('#prompt-header');
        promptMessage = promptLayer.find('#prompt-message');
        promptButtons = promptLayer.find('#prompt-buttons');

        promptLayer.stop().css({
            display: 'block',
            opacity: 1
        });

        promptHeader.html('');
        for (i in icons) {
            if (icons.hasOwnProperty(i) !== false) {
                icon = icons[i];

                promptHeader.append(
                    this.GenerateButton('', 'prompt-icon glyphicon glyphicon-remove', icon.fn)
                )
            }
        }
        promptHeader.append(
            '<label class="prompt-title">' + title + '</label>'
        );

        promptMessage.html(message);

        promptButtons.html('');
        for (i in buttons) {
            if (buttons.hasOwnProperty(i) !== false) {
                button = buttons[i];

                promptButtons.append(
                    this.GenerateButton(button.name, 'prompt-button', button.fn)
                )
            }
        }

        this.AdjustPromptSize();

        return this;
    };

    this.ClosePromptMessage = function() {
        var promptLayer;

        promptLayer = this.box.find('#prompt-layer');

        promptLayer.stop().animate({
            opacity: 0
        }, 200, "linear", function() {
            $(this).css({
                display: 'none'
            });
        });

        return this;
    };

    this.GenerateButton = function(name, type, fn) {
        var button;

        button = document.createElement('div');
        button.innerHTML = name;
        button.className = type;
        button.onclick = fn;

        return button;
    };

    this.AdjustPromptSize = function() {
        var promptBox;
        var w;
        var h;
        var layerWidth;
        var layerHeight;

        promptBox = this.box.find('#prompt-box');

        w = $(window).width();
        h = $(window).height();
        layerWidth  = promptBox.width();
        layerHeight = promptBox.height();

        promptBox.css({
            left: ~~((w-layerWidth)*0.5),
            top: ~~((h-layerHeight)*0.4)
        });
    };

    this.ShowInstructions = function() {
        var app = this;
        var message = "<b>Shortcuts:</b><br>[hold] CTRL build mode ON/OFF <br>[hold] LSHIFT destruction mode ON/OFF <br>[click] CAPSLOCK simulation mode ON/OFF<br>[click] LPM selects node <br>[click] CTRL+LPM creates node <br>[click] CTRL+RPM creates transition <br>[click] LSHIFT+LPM destroys node/transition <br>[click] Z select/unselect last selected node <br>[click] X reset camera position <br>[click] C save current camera position <br>[click] V load saved camera position <br><br><b>Meantime one of the nodes is selected:</b><br>[click] CTRL+LPM creates connection to the node/transition <br>[click] CTRL+RPM selects node <br>[click] LSHIFT+LPM deletes connection to the node/transition <br>[click] LSHIFT+RPM deletes node/transition";

        app.PromptMessage(
            'Instructions',
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

    this.ShowPreloader = function() {
        $('#preloader').css('display', 'block');
    };

    this.ClosePreloader = function() {
        $('#preloader').css('display', 'none');
    };

    return this;
};
