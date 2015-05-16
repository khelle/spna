exports.getValue = function(value, defaultValue) {
    return typeof value !== 'undefined' ? value : defaultValue;
};

exports.array = function(value) {
    return Array.isArray(value) ? value : [];
};

exports.number = function(value) {
  return typeof value !== 'number' ? 0 : value;
};

exports.clone = function(obj) {
    if(obj === null || typeof(obj) !== 'object')
        return obj;

    var temp = obj.constructor(); // changed

    for(var key in obj) {
        if(Object.prototype.hasOwnProperty.call(obj, key)) {
            temp[key] = clone(obj[key]);
        }
    }
    return temp;
};