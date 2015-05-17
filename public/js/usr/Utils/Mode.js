var Mode = function(name) {
    this.name = name;
    this.state = 'Off';
    this.reqs = {
        On:  {},
        Off: {}
    };
    this.dpndcs = {
        On:  {},
        Off: {}
    };
    this.callbacks = {
        On:  function() {},
        Off: function() {}
    };

    this.GetName = function() {
        return this.name;
    };

    this.SetState = function(state) {
        this.state = state;
    };

    this.GetState = function() {
        return this.state;
    };

    this.SetCallback = function(source, callback) {
        this.callbacks[source] = callback;
    };

    this.GetCallback = function(source) {
        return this.callbacks[source];
    };

    this.RemoveCallback = function(source) {
        this.callbacks[source] = function() {};
    };

    this.AddRequirement = function(source, mode, state) {
        this.reqs[source][mode] = state;
    };

    this.RemoveRequirement = function(source, mode) {
        delete this.reqs[source][mode];
    };

    this.AddDependency = function(source, mode, state) {
        this.dpndcs[source][mode] = state;
    };

    this.RemoveDependency = function(source, mode) {
        delete this.dpndcs[source][mode];
    };

    this.GetRequirements = function(source) {
        return this.reqs[source];
    };

    this.GetDependencies = function(source) {
        return this.dpndcs[source];
    };

    return this;
};
