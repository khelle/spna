var Evenement = function() {

    this.Register = function(obj, event, callback) {
        obj.addEventListener(event, callback);
    };

    return this;
};
