var Keyboard = function() {
    this.mappedKeys = {
        up:    {},
        press: {},
        down:  {}
    };

    this.KEY = {
        ENTER:  13,
        LSHIFT: 16,
        LCTRL:  17
    };

    this.Init = function() {
        $(document).keypress($.proxy(this.OnKeyPress, this));
        $(document).keydown($.proxy(this.OnKeyIn, this));
        $(document).keyup($.proxy(this.OnKeyOut, this));

        return this;
    };

    this.OnKeyPress = function(e) {
        return this.ExecuteKey(e.which, 'press');
    };

    this.OnKeyIn = function(e) {
        return this.ExecuteKey(e.which, 'down');
    };

    this.OnKeyOut = function(e) {
        return this.ExecuteKey(e.which, 'up');
    };

    this.BindKey = function(keyCode, methodID, methodPtr) {
        return this.BindKeyEvent(keyCode, methodID, methodPtr, 'press');
    };

    this.BindKeyIn = function(keyCode, methodID, methodPtr) {
        return this.BindKeyEvent(keyCode, methodID, methodPtr, 'down');
    };

    this.BindKeyOut = function(keyCode, methodID, methodPtr) {
        return this.BindKeyEvent(keyCode, methodID, methodPtr, 'up');
    };

    this.UnbindKey = function(keyCode, methodID) {
        return this.UnbindKeyEvent(keyCode, methodID, 'press');
    };

    this.UnbindKeyIn = function(keyCode, methodID) {
        return this.UnbindKeyEvent(keyCode, methodID, 'down');
    };

    this.UnbindKeyOut = function(keyCode, methodID) {
        return this.UnbindKeyEvent(keyCode, methodID, 'up');
    };

    this.BindKeyEvent = function(keyCode, methodID, methodPtr, bindType) {
        if (keyCode === this.KEY.ENTER) {
            return this;
        }

        var keyID = keyCode.toString();

        if (this.mappedKeys[bindType][keyID] === undefined) {
            this.mappedKeys[bindType][keyID] = {};
        }

        if (this.mappedKeys[bindType][keyID][methodID] !== undefined) {
            return this;
        }

        this.mappedKeys[bindType][keyID][methodID] = methodPtr;

        return this;
    };

    this.UnbindKeyEvent = function(keyCode, methodID, bindType) {
        if (keyCode === this.KEY.ENTER) {
            return this;
        }

        var keyID = keyCode.toString();

        if (this.mappedKeys[bindType][keyID] !== undefined && this.mappedKeys[bindType][keyID][methodID] !== undefined) {
            delete this.mappedKeys[bindType][keyID][methodID];
        }

        return this;
    };

    this.ExecuteKey = function(keyCode, bindType) {
        if (keyCode === this.KEY.ENTER) {
            return this;
        }

        var keyID = keyCode.toString();

        if (this.mappedKeys[bindType][keyID] === undefined) {
            return this;
        }

        var key;
        for (key in this.mappedKeys[bindType][keyID]) {
            if (this.mappedKeys[bindType][keyID].hasOwnProperty(key) !== false) {
                this.mappedKeys[bindType][keyID][key]();
            }
        }

        return this;
    };

    return this;
};
