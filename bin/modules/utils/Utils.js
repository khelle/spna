function getValue(value, defaultValue) {
    return typeof value !== 'undefined' ? value : defaultValue;
}

function array(value) {
    return Array.isArray(value) ? value : [];
}

function number(value) {
  return typeof value !== 'number' ? 0 : value;
}

//function clone(obj) {
//    if(obj === null || typeof(obj) !== 'object')
//        return obj;
//
//    var temp = obj.constructor(); // changed
//
//    for(var key in obj) {
//        if(Object.prototype.hasOwnProperty.call(obj, key)) {
//            temp[key] = clone(obj[key]);
//        }
//    }
//
//    return temp;
//}
function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    //var copy = obj.constructor();
    var copy = {};
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
    }
    return copy;
}


module.exports = {
    getValue: getValue,
    array: array,
    number: number,
    clone: clone
};