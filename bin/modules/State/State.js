
function State(places) {

    /*
    LABELS:
    new - default, new state to check in analysis
    old - found exact same state earlier (going from root)
    dead - no more alive transitions from this state
     */
    this.label = State.NEW;
    this.markers = {};
    this.dead = false;

    for (var i in places) {
        this.markers[i] = places[i].getMarkers();
    }

    this.getHash = function() {
        var hash = '';

        for (var i in this.markers) {
            var m = this.markers[i];
            hash += (m === Infinity ? 'i' : m);
        }
        return hash;
    };

    this.getLabel = function() {
        return this.label;
    };
    this.setLabel = function(label) {
        this.label = label;
        return this;
    };

    this.setDead = function(dead) {
        this.dead = dead;
        return this;
    };

    this.getDead = function() {

        return  this.dead;
    };

    this.getState = function() {
        return this.markers;
    };


    /*
    thisState.isEqual(someState)
    true if both have same markings
     */
    this.isEqual = function(state) {
        if (null === state) {
            return false;
        }

        for (var i in this.getState()) {
            if (this.getState()[i] != state.getState()[i])
                return false;
        }
        return ( Object.keys(this.getState()).length == Object.keys(state.getState()).length );
    };

    /*
    thisState.isGreaterEqual(someState)
    true if every mark from thisState is greater or equal to someState
    AND there is at least one greater entry
    also sets greaters to Infinity
     */
    this.setInfinity = function(state) {

        var foundOneGreater = false;
        for (var i in this.getState()) {
            if (!foundOneGreater && (this.getState()[i] > state.getState()[i])) {
                foundOneGreater = true;
            }
            if ( this.getState()[i] < state.getState()[i] )
                return false;
        }

        if (foundOneGreater) {
            for (var i in this.getState()) {
                if (this.getState()[i] > state.getState()[i]) {
                    this.getState()[i] = Infinity;
                }
            }

            return true;
        }
        else
            return false;
    };

    this.print = function() {

        var string = 'Label: ';
        string += this.getLabel();

        string += "\nMarks:\n";

        for (var i in this.getState()) {
            string += " (" + i + ")" + this.getState()[i];
        }
        string += "\n";

        return string;
    };


    return this;
}

State.NEW = "new";
State.CHECKED = "checked"
State.OLD = "old";
//State.DEAD = "dead";

module.exports=State;