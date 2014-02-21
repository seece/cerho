
function Effect(program, params) {
    this.program = program;      // linked shader program object
    this.params = params;        // custom effect parameters

    console.log("New effect: ", this);
}


/* 
 * params:              a parameter map
 * quadDrawFunc(prog)   a function that draws a full screen quad with the given program
 */
Effect.prototype.render = function (entryparams, quadDrawFunc) {
    var self = this;
    var joinedparams = $.extend({}, this.params, entryparams);

    gl.useProgram(this.program);

    Utils.mapmap(joinedparams, function (key, val, list) {
        var loc = gl.getUniformLocation(self.program, key); 

        // Skip if not active
        if (loc === null)
            return;

        gl.uniform1f(loc, val);
    });

    quadDrawFunc(this.program);
}
