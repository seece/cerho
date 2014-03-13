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

        return song.currentTime;
    }

    this.getBeat = function () {
        // seconds / beats_per_second
        return this.getPos() / (this.bpm/60.0);
    }

    this.play = function() {
        this.playing = true; 
        this.playstart = now() + this.pos;

        console.log("playin songg: ", this.song);

        // If there's no song set, just pretend we are playing.
        if (this.song === undefined) 
            return;

        song.play();
    }

    this.pause = function() {
        if (this.song === undefined)
            return;

        song.pause();
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

