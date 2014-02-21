
function Effect(program, config) {
    this.program = program;      // linked shader program object
    this.config = config;  // configuration object

    console.log("New effect: ", this);
}


/* 
 * params:              a parameter map
 * quadDrawFunc(prog)   a function that draws a full screen quad with the given program
 */
Effect.prototype.render = function (params, quadDrawFunc) {
    var t = params["time"];

    if ("time" in params) {
        t = params["time"];
    }

    //console.log("Rendering with params", params, this.program);
    gl.useProgram(this.program);
    quadDrawFunc(this.program);
}
