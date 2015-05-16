function getValue(value, defaultValue) {
    return typeof value !== 'undefined' ? value : defaultValue;
}

function array(value) {
    return Array.isArray(value) ? value : [];
}

function number(value) {
  return typeof value !== 'number' ? 0 : value;
}

function position(value) {
    if (typeof value !== 'object' || typeof value.x !== 'number' || typeof value.y !== 'number') {
        return {x: 0, y: 0};
    }
}

module.exports = {
    getValue: getValue,
    array: array,
    number: number
};