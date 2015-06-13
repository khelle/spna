function getValue(value, defaultValue) {
    return typeof value !== 'undefined' ? value : defaultValue;
}

function array(value) {
    return Array.isArray(value) ? value : [];
}

function number(value) {
  return (typeof value !== 'number' || isNaN(value)) ? 0 : value;
}

function position(value) {
    if (typeof value !== 'object') {
        return {x: 0, y: 0};
    }

    if (typeof value.x !== 'number') {
        value.x = 0;
    }

    if (typeof value.y !== 'number') {
        value.y = 0;
    }

    return value;
}

module.exports = {
    getValue: getValue,
    array: array,
    number: number,
    position: position
};