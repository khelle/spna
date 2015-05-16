/**
 * Created by Rael on 2015-05-16.
 */

var fs = require('fs');// wymagamy

function IOperations() {

// czym się różni notacja zapisu funkcji

    this.saveGraph = function (jsData, Path) {
    try {
        fs.writeFileSync(Path, jsData);
        // mamy zwrócić coś
        return true;
    }
    catch(e)
        {
            return false;
        }

    };

    this.loadGraph = function (Path) {
    try {
        var data = null;
        return fs.readFileSync(Path, {encoding: 'utf-8'});
    }
        catch(e)
        {
            return false;

        }
    //return data;
    }; // każdą metodę klasy kończyć średnikiem

}

module.exports = IOperations;
