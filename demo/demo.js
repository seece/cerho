var Demo = (function($, assets, glul) {

	var demo = {};
	var prof = new Profiler();
	var gl;
	var textures = {};
	var vshader;
	var shaders = {};

	var programs = {}; 
	var effects = {};
	var playlist = {};

	var quadVerts;
	var quadInds;
    var data = {};

	var getBasename = function (path) {
		return path.split(/[\\/]/).pop();
	}

    /* 
     * func(key, val, list)
     * */
    var mapmap = function (list, func) {
        var obj = {};

		for (var key in list) {
			if (!list.hasOwnProperty(key)) 
				continue;

            obj[key] = func(key, list[key], list);
		}

        return obj;
    }

	/* Compiles and links multiple fragment shaders with a single vertex shader. 
     *
     * Each program will be given the basename of the corresponding fragment shader.
     */
	var createPrograms = function (vertexshader, frags) {
		vshader = glul.createShader(vertexshader, gl.VERTEX_SHADER);

		for (var frag in frags) {
			var fstr = Assets.fragmentshaders[frag];
			console.log("Compiling shader", frag);
			var program = glul.createProgram(vertexshader, fstr);
			//programs.push(program);
            var name = getBasename(frag);
			programs[name] = program;
		}
	}

	var createTexture = function(image, params) {
		console.log("Creating texture with ", image, params);
		var tex = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, tex);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

		// Apply custom texture parameters.
		for (var name in params) {
			if (!params.hasOwnProperty(name))
				continue;

			gl.texParameteri(gl.TEXTURE_2D, name, params[name]);
		}

		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.bindTexture(gl.TEXTURE_2D, null);
		
		return tex;
	}

	var generateTextures = function(images) {
		console.log("Generating images", images);

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

	var set2DVertexAttribPointer = function (prog, itemSize) {
		gl.bindBuffer(gl.ARRAY_BUFFER, quadVerts);
		prog.vertexPosAttrib = gl.getAttribLocation(prog, 'pos');
		gl.enableVertexAttribArray(prog.vertexPosAttrib);
		gl.vertexAttribPointer(prog.vertexPosAttrib, quadVerts.itemSize, gl.FLOAT, false, 0, 0);
	}

    /* Loads all assets and calls 'setup' which calls 'success' function. */
    var load = function (demodata, setup, success) {
        data = demodata;
        console.log("Loaded demo data", demodata);

        console.log("Assets: ", data.assets);

        data.assets.images.map(Assets.queueImage);
        Assets.queueVertexShader(data.assets.vertexshader);
        data.assets.fragmentshaders.map(Assets.queueFragmentShader);

        if ("text" in data.assets)
            data.assets.text.map(Assets.queue);

        Assets.loadAll(function () {
            setup(success);
        }, function (filename) {
            throw "Couldn't load file " + filename;
        });
    }

    var createEffects = function (efflist) {
        mapmap(efflist, function (key, val, list) {
            if (!(val.shader in programs))
                throw "Invalid shader in datafile: '" + val.shader + "' in effect " + key;

            effects[key] = new Effect(programs[val.shader], val.config);
        });

        console.log("Effects", effects);
    }

    /* Generates OpenGL objects from the loaded assets.*/
    var setupAssets = function(callback) {
		prof.begin("texture gen");
		generateTextures(Assets.images);
		prof.end("texture gen");

		prof.begin("shaders");
		createPrograms(Assets.vertexshaders["shaders/shader.vert"], Assets.fragmentshaders);
		prof.end("shaders");

		var quad = glul.screenQuad();
		quadVerts = quad[0];
		quadInds = quad[1];

        mapmap(programs, function (key, prog, list) {
            console.log("mapmap", key, prog, list);
			gl.useProgram(prog);	
			set2DVertexAttribPointer(prog, quadVerts.itemSize);
        });

        console.log("programs: ", programs);

        createEffects(data.effects);

        playlist = new Playlist(data.playlist);

		prof.end("init");

		console.log(prof.entries);
		console.log(playlist);

        callback();
    }

	demo.init = function(viewportElement, demodata, success) {
		console.log("Initializing");
		prof.begin("init");
		gl = glul.initGL(viewportElement);

        load(demodata, setupAssets, success);
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

		var eff = playlist.getCurrent(5.0);

		if (!(eff.effect in effects)) {
			console.log("Invalid effect name in playlist: ", eff);

		} else {
			effects[eff.effect].render({}, function (prog) {
                set2DVertexAttribPointer(prog);
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, quadInds)
				gl.drawElements(gl.TRIANGLES, quadInds.numItems, gl.UNSIGNED_SHORT, 0);
			});
		}

	}

	return demo;
})($, Assets, glul);
