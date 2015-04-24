exports.getValue = function(value, defaultValue) {
    return typeof value !== 'undefined' ? value : defaultValue;
};

exports.array = function(value) {
    return Array.isArray(value) ? value : [];
};

exports.number = function(value) {
  return typeof value !== 'number' ? 0 : value;
};