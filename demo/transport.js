function Transport(song, bpm) {
    this.song = song;
    this.playstart = Utils.getNow() / 1000.0;
    this.playing = false;
    this.pos = 0.0;
    this.bpm = bpm || 120;

    var now = function () {
        return Utils.getNow() / 1000.0;
    }

    this.getPos = function () {
        if (!this.playing) {
            return this.pos;
        }

        if (this.song === undefined) {
            return now() - this.playstart;
        }

        return 0.0;
    }

    this.play = function() {
        this.playing = true; 
        this.playstart = now() + this.pos;

        // If there's no song set, just pretend we are playing.
        if (this.song === undefined) 
            return;
    }

    this.playstart = this.getPos();
}


Transport.prototype.pause = function() {
    this.pos = getPos();
    this.playing = false;
}

Transport.prototype.seek = function(seconds) {
    return this.getPos();
}

