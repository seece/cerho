/*
 * This is the GLUL (OpenGL Ullatus Library)
 *
 * Most of this code has been copy-pasted from 
 * http://devfiles.myopera.com/articles/8442/webgl-utils.js 
 *
 */
var glul = (function() {
	/*
	   window.onerror = function(msg, url, lineno) {
	   alert(url + '(' + lineno + '): ' + msg);
	   }
	   */

	function getWebGLContext(canvas) {
		gl = canvas.getContext("experimental-webgl");

		return gl;
	}


	function initGL(canvas) {
		try {
			gl = getWebGLContext(canvas);
			gl.viewportWidth = canvas.width;
			gl.viewportHeight = canvas.height;
			gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
			console.log("Viewport size", gl.viewportWidth, gl.viewportHeight);
		} catch(e) {
		}
		if (!gl) {
			alert("Could not initialise WebGL, sorry :D");
		}

		return gl;
	}


	function createShader(str, type) {
		var shader = gl.createShader(type);
		gl.shaderSource(shader, str);
		gl.compileShader(shader);
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			throw gl.getShaderInfoLog(shader);
		}
		return shader;
	}

	function createProgram(vstr, fstr) {
		var program = gl.createProgram();
		var vshader = createShader(vstr, gl.VERTEX_SHADER);
		var fshader = createShader(fstr, gl.FRAGMENT_SHADER);
		gl.attachShader(program, vshader);
		gl.attachShader(program, fshader);
		gl.linkProgram(program);
		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			throw gl.getProgramInfoLog(program);
		}
		return program;
	}

	/* Returns a list that contains the vertex buffer and the index buffer */
	function screenQuad() {
		var vertices = [-1, -1, 1, -1, -1, 1, 1, 1];
		var indices = [0, 1, 2, 1, 3, 2]; 

		var vertexPosBuffer = gl.createBuffer();
		var indexPosBuffer = gl.createBuffer();

		gl.bindBuffer(gl.ARRAY_BUFFER, vertexPosBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
		vertexPosBuffer.itemSize = 2;	// item size in elements (floats)
		vertexPosBuffer.numItems = 4;

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexPosBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
		indexPosBuffer.numItems = 6;

		/*
		   2___3
		   |\  |
		   | \ |
		   |__\|
		   0   1
		   */
		return [vertexPosBuffer, indexPosBuffer];
	}

	function linkProgram(program) {
		var vshader = createShader(program.vshaderSource, gl.VERTEX_SHADER);
		var fshader = createShader(program.fshaderSource, gl.FRAGMENT_SHADER);
		gl.attachShader(program, vshader);
		gl.attachShader(program, fshader);
		gl.linkProgram(program);
		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			throw gl.getProgramInfoLog(program);
		}
	}

	function loadFile(file, callback, noCache, isJson) {
		var request = new XMLHttpRequest();
		request.onreadystatechange = function() {
			if (request.readyState == 1) {
				if (isJson) {
					request.overrideMimeType('application/json');
				}
				request.send();
			} else if (request.readyState == 4) {
				if (request.status == 200) {
					callback(request.responseText);
				} else if (request.status == 404) {
					throw 'File "' + file + '" does not exist.';
				} else {
					throw 'XHR error ' + request.status + '.';
				}
			}
		};
		var url = file;
		if (noCache) {
			url += '?' + (new Date()).getTime();
		}
		request.open('GET', url, true);
	}

	function loadProgram(vs, fs, callback) {
		var program = gl.createProgram();
		function vshaderLoaded(str) {
			program.vshaderSource = str;
			if (program.fshaderSource) {
				linkProgram(program);
				callback(program);
			}
		}
		function fshaderLoaded(str) {
			program.fshaderSource = str;
			if (program.vshaderSource) {
				linkProgram(program);
				callback(program);
			}
		}
		loadFile(vs, vshaderLoaded, true);
		loadFile(fs, fshaderLoaded, true);
		return program;
	}

	(function() {
		var lastTime = 0;
		var vendors = ['ms', 'moz', 'webkit', 'o'];
		for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
			window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
			window.cancelRequestAnimationFrame = window[vendors[x]+
		'CancelRequestAnimationFrame'];
		}

		if (!window.requestAnimationFrame)
		window.requestAnimationFrame = function(callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function() { callback(currTime + timeToCall); },
				timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};

	if (!window.cancelAnimationFrame)
		window.cancelAnimationFrame = function(id) {
			clearTimeout(id);
		};
	}())

	return {
		initGL: initGL,
		createShader: createShader,
		createProgram: createProgram,
		screenQuad: screenQuad,
		linkProgram: linkProgram,
		loadFile: loadFile,
		loadProgram: loadProgram
	};
})();
