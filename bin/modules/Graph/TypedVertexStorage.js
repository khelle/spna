var TypedVertexStorage = function(types) {
    if (!(types instanceof Array)) {
        throw new Error('Types must be of type "Array"');
    }

    this.verticesIndex  = {};
    this.vertices       = {};
    this.verticesCount  = {};
    this.vertexNextID   = 0;

    types.forEach(function(type) {
        this.vertices[type] = {};
        this.verticesCount[type] = 0;
    }, this);
    
    this.AddVertex = function(V) {
        var type;
        type = V.constructor.name;

        try {
            var id = this.vertexNextID++;
            V.id = id;

            this.vertices[type][id] = V;
            this.verticesIndex[id] = type;
            this.verticesCount[type]++;

            return V;
        } catch (e) {
            return null;
        }
    };

    this.GetVertex = function(id) {
        var type;

        if ((type = this.verticesIndex[id]) === undefined) {
            return null;
        }

        return this.vertices[type][id];
    };

    this.RemoveVertex = function(id) {
        var type;

        if ((type = this.verticesIndex[id]) === undefined) {
            return false;
        }

        delete this.vertices[type][id];
        delete this.verticesIndex[id];
        this.verticesCount--;

        return true;
    };

    this.GetVertices = function() {
        return this.vertices;
    };

    this.GetVerticesCount = function() {
        return this.verticesCount;
    };

    return this;
};

module.exports = TypedVertexStorage;