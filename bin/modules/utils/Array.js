Object.defineProperty(Array.prototype, 'removeElement', {
    enumerable: false,
    value: function(element) {
        var index = this.indexOf(element);

        if (index > -1) {
            this.splice(index,1);
        }

        return this;
    }
});

Object.defineProperty(Array.prototype, 'removeLastElement', {
    enumerable: false,
    value: function(element) {
        var index = this.lastIndexOf(element);

        if (index > -1) {
            this.splice(index,1);
        }

        return this;
    }
});