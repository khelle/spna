/**
 * Created by Rael on 2015-05-16.
 */

var fs = require('fs');

function IOperations() {
    this.writeFile = function (jsData, Path) {
        try {
            fs.writeFileSync(Path, jsData);
            return true;
        } catch(e) {
            return false;
        }
    };

    this.readFile = function (Path) {
        try {
            return fs.readFileSync(Path, {encoding: 'utf-8'});
        } catch(e) {
            return false;
        }
    };
}

module.exports = IOperations;
