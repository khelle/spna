var DefaultVertexStorage = function() {
    this.verticesIndex  = {};
    this.vertices       = {};
    this.verticesCount  = 0;
    this.vertexNextID   = 0;

    this.AddVertex = function(V) {
        var index = this.vertexNextID++;
        V.id = index;

        this.vertices[index] = V;
        this.verticesIndex[index] = index;
        this.verticesCount++;

        return true;
    };
    
    this.SetVertex = function(id, V) {
        var index;

        if (this.verticesIndex[id] !== undefined) {
            return false;
        }

        index = this.vertexNextID++;
        V.id = id;

        this.vertices[index] = V;
        this.verticesIndex[id] = index;
        this.verticesCount++;

        return true;
    };

    this.GetVertex = function(id) {
        var index;

        if ((index = this.verticesIndex[id]) === undefined) {
            return null;
        }

        return this.vertices[index];
    };

    this.RemoveVertex = function(id) {
        var index;

        if ((index = this.verticesIndex[id]) === undefined) {
            return false;
        }

        delete this.vertices[index];
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

    this.GetVertexIndex = function(id) {
        return this.verticesIndex[id];
    };

    return this;
};

module.exports = DefaultVertexStorage;