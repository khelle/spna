exports.removeElement = function(array, element) {
    var index = array.indexOf(element);

    if (index > -1) {
        array.splice(index,1);
    }

    return element;
};

exports.removeLastElement = function(array, element) {
    var index = array.lastIndexOf(element);

    if (index > -1) {
        array.splice(index,1);
    }

    return element;
};

exports.intersect = function(a, b) {
    var t;
    if (b.length > a.length) t = b, b = a, a = t; // indexOf to loop over shorter
    return a.filter(function (e) {
        if (b.indexOf(e) !== -1) return true;
    })
};