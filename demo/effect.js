
function Effect(shader, config) {
    console.log("Creating new shader ", shader, config);

    // private variables
    var shader = shader;    // shader object, not source
    var config = config;    // configuration object

}


Effect.prototype.render = function (params) {
    var t = params["time"];

    if ("time" in params) {
        t = params["time"];
    }
}
