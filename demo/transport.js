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
        if (this.song === undefined) {
            if (!this.playing) {
                return this.pos;
            }

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

        console.log("Playing song from ", this.getPos());

        // If there's no song set, just pretend we are playing.
        if (this.song === undefined) 
            return;

        song.play();
    }

    this.togglePlaying = function() {

        if (this.playing) {
            this.pause();
        } else {
            this.play();
        }
    }

    this.playstart = this.getPos();
}

Transport.prototype.pause = function() {
    this.playing = false;

        if (this.song === undefined)
            return;

        song.pause();
}

Transport.prototype.seek = function(seconds) {
	this.song.currentTime = seconds;
    return this.getPos();
}

