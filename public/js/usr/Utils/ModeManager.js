var ModeManager = function(app) {
    this.app    = app;
    this.modes  = {};

    this.SetMode = function(name, mode) {
        this.modes[name] = mode;
    };

    this.RemoveMode = function(name) {
        delete this.modes[name];
    };

    this.TurnMode = function(name, state) {
        switch (state) {
            case 'On':  return this.TurnOnMode(name);
            case 'Off': return this.TurnOffMode(name);
            default:
                return false;
        }
    };

    this.TurnOnMode = function(name) {
        if (!this.ExistsMode(name)) {
            return false;
        }

        var mode   = this.modes[name];

        if (mode.GetState() === 'On') {
            return false;
        }

        var reqs   = mode.GetRequirements('On');
        var dpndcs = mode.GetDependencies('On');
        var key;

        for (key in reqs) {
            if (reqs.hasOwnProperty(key) !== false) {
                if (this.ExistsMode(key) && this.GetMode(key).GetState() !== reqs[key]) {
                    return false;
                }
            }
        }

        for (key in dpndcs) {
            if (dpndcs.hasOwnProperty(key) !== false) {
                if (this.ExistsMode(key) && this.GetMode(key).GetState() !== dpndcs[key]) {
                    this.TurnMode(key, dpndcs[key]);
                }
            }
        }

        mode.SetState('On');
        mode.GetCallback('On')();

        return true;
    };

    this.TurnOffMode = function(name) {
        if (!this.ExistsMode(name)) {
            return false;
        }

        var mode   = this.modes[name];

        if (mode.GetState() === 'Off') {
            return false;
        }

        var reqs   = mode.GetRequirements('Off');
        var dpndcs = mode.GetDependencies('Off');
        var key;

        for (key in reqs) {
            if (reqs.hasOwnProperty(key) !== false) {
                if (this.ExistsMode(key) && this.GetMode(key).GetState() !== reqs[key]) {
                    return false;
                }
            }
        }

        for (key in dpndcs) {
            if (dpndcs.hasOwnProperty(key) !== false) {
                if (this.ExistsMode(key) && this.GetMode(key).GetState() !== dpndcs[key]) {
                    this.TurnMode(key, dpndcs[key]);
                }
            }
        }

        mode.SetState('Off');
        mode.GetCallback('Off')();

        return true;
    };

    this.GetMode = function(name) {
        return this.modes[name];
    };

    this.ExistsMode = function(name) {
        return this.modes[name] !== undefined;
    };

    this.IsOn = function(name) {
        return this.ExistsMode(name) && this.GetMode(name).GetState() === 'On';
    };

    this.IsOff = function(name) {
        return !this.ExistsMode(name) || this.GetMode(name).GetState() === 'Off';
    };

    return this;
};
