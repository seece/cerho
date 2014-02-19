var Demo = (function($, assets, glul) {

	var demo = {};
	var prof = new Profiler();
	var gl;

	demo.init = function(viewportElement) {
		console.log("Initializing");
		prof.begin("init");
		gl = glul.initGL(viewportElement);
		//var gl = glul.initGL($('#viewport').get(0));
		prof.end("init");

		console.log(prof.entries);
	}

	demo.run = function() {
		console.log("Running demo");
		demo.update();
	}

	demo.update = function () {
		demo.draw();
		window.requestAnimationFrame(demo.update);
	}

	demo.draw = function() {
		gl.clearColor(0.2, 0.2, 0.2, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT);
	}

	return demo;
})($, Assets, glul);
