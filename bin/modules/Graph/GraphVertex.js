GraphVertex = function(data) {
    this.id   = -1;
    this.data = data || null;

    this.SetID = function(id) {
        this.id = id;
    };

    this.GetID = function() {
        return this.id;
    };

    this.SetData = function(data) {
        this.data = data;
    };

    this.GetData = function() {
        return this.data;
    };

    return this;
};

module.exports = GraphVertex;