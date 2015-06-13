var PetriNode = function(id, posx, posy, type, label, markers, priority) {
    this.id       = id;
    this.x        = posx;
    this.y        = posy;
    this.type     = type;
    this.label    = label || "";
    this.markers  = markers || 0;
    this.priority = priority || 0;

    return this;
};
