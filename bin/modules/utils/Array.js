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