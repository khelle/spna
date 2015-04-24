/**
 * Helper module which extends functionality of Arrays
 */

/**
 * @param element
 * @returns {Array}
 *
 * Removes first occurrence of the element in the array
 */
Array.prototype.removeElement = function(element) {
    var index = this.indexOf(element);

    if (index > -1) {
        this.splice(index,1);
    }

    return this;
};

/**
 * @param element
 * @returns {Array}
 *
 * Removes last occurrence of the element in the array
 */
Array.prototype.removeLastElement = function(element) {
    var index = this.lastIndexOf(element);

    if (index > -1) {
        this.splice(index,1);
    }

    return this;
};