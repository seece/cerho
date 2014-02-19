var Demo = (function($, assets, glul) {

	var demo = {};
	var prof = new Profiler();
	var gl;
	var textures = {};

	
	var createTexture = function(image, parameters) {
		console.log("Creating texture with ", image);
		var tex = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, tex);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

		// Apply custom texture parameters.
		for (var name in parameters) {
			if (!parameters.hasOwnProperty(name)) {
				continue;
			}

			gl.texParameteri(gl.TEXTURE_2D, name, parameters[name]);
		}

		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.bindTexture(gl.TEXTURE_2D, null);
		
		return tex;
	}

	var generateTextures = function(images) {
		console.log("Generating images");

		for (var path in images) {
			if (!images.hasOwnProperty(path)) {
				continue;
			}

			var params = {};
			params[gl.TEXTURE_WRAP_S] = gl.CLAMP_TO_EDGE;
			params[gl.TEXTURE_WRAP_T] = gl.CLAMP_TO_EDGE;
			
			var texture = createTexture(images[path], params);
		}

	}

	demo.init = function(viewportElement) {
		console.log("Initializing");
		prof.begin("init");
		gl = glul.initGL(viewportElement);
		//var gl = glul.initGL($('#viewport').get(0));

		prof.begin("texture gen");
		generateTextures(Assets.images);
		prof.end("texture gen");
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
