var Demo = (function($, assets, glul, utils) {

	var demo = {};
	var prof = new Profiler();
	var gl;
	var textures = {};
	var vshader;
	var shaders = {};
	
	var mouse = {
		pos : {x : 0, y : 0},
		buttons : {1 : 0.0, 2: 0.0, 3: 0.0}
	};

    var transport;
	var programs = {}; 
	var effects = {};
	var playlist = {};

	var quadVerts;
	var quadInds;
    var data = {};
	
    var preludePath = "include/prelude.glsl";
    var vertexShaderPath = "shaders/shader.vert";
    var debugModeEnabled = true;
    var keyListener; // uses the keypress.js library to handle keypresses

	var getBasename = function (path) {
		return path.split(/[\\/]/).pop();
	}

	/* Compiles and links multiple fragment shaders with a single vertex shader. 
     *
     * Each program will be given the basename of the corresponding fragment shader.
     */
	var createPrograms = function (vertexshader, frags) {
        var prelude = Assets.store[preludePath];
		vshader = glul.createShader(prelude + vertexshader, gl.VERTEX_SHADER);

		for (var frag in frags) {
			var fstr = prelude + Assets.fragmentshaders[frag];
			console.log("Compiling shader", frag);
			var program = glul.createProgram(vertexshader, fstr);
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
        Assets.queue(preludePath);
        Assets.queueAudio(data.assets.song, function (pos, length) {
            console.log("Buffering audio: " + ((pos/length) * 100.0) + "%");
        });

        if ("text" in data.assets)
            data.assets.text.map(Assets.queue);

        Assets.loadAll(function () {
            console.log("Loaded all assets.");
            setup(success);
        }, function (filename) {
            throw "Couldn't load file " + filename;
        });
    }

    var createEffects = function (efflist) {
        utils.mapmap(efflist, function (key, val, list) {
            if (!(val.shader in programs))
                throw "Invalid shader in datafile: '" + val.shader + "' in effect " + key;

            effects[key] = new Effect(programs[val.shader], val.params);
        });

        console.log("Effects", effects);
    }

    /* Generates OpenGL objects from the loaded assets.*/
    var setupAssets = function(callback) {
		prof.begin("texture gen");
		generateTextures(Assets.images);
		prof.end("texture gen");

		prof.begin("shaders");
		createPrograms(Assets.vertexshaders[vertexShaderPath], Assets.fragmentshaders);
		prof.end("shaders");

		var quad = glul.screenQuad();
		quadVerts = quad[0];
		quadInds = quad[1];

        utils.mapmap(programs, function (key, prog, list) {
            console.log("utils.mapmap", key, prog, list);
			gl.useProgram(prog);	
			set2DVertexAttribPointer(prog, quadVerts.itemSize);
        });

        console.log("programs: ", programs);

        createEffects(data.effects);

        playlist = new Playlist(data.playlist);

		prof.end("init");

		console.log(prof.entries);
		console.log(playlist);

        transport = new Transport(assets.audio[data.assets.song]);

        callback();
    }

    var setupHotkeys = function(listener) {
        var keyfuncs = {
            "space" : function () {transport.togglePlaying();},
            "backspace" : function () {console.log("scrub to beginning"); transport.seekTo(0)},
            "r" : function () {console.log("reload")}
        };

        utils.mapmap(keyfuncs, function (combo, func, list) {
            listener.simple_combo(combo, func);
        });
    }

	demo.init = function(viewportElement, demodata, success) {
		console.log("Initializing");
		prof.begin("init");
		gl = glul.initGL(viewportElement);

        $(viewportElement).on("mousemove", function (e) {
			mouse.pos = {x: e.originalEvent.layerX, y: e.originalEvent.layerY};
		});
		
		$(viewportElement).on("mousedown", function (e) {
			mouse.buttons[e.which] = 1.0;
		});
		
		$(viewportElement).on("mouseup", function (e) {
			mouse.buttons[e.which] = 0.0;
		});

        if (debugModeEnabled) {
            keyListener = new window.keypress.Listener();
            setupHotkeys(keyListener);
        }

        load(demodata, setupAssets, success);
	}

	demo.run = function() {
		console.log("Running demo");
        transport.play();
		demo.update();
	}

	demo.update = function () {
		demo.draw();
		window.requestAnimationFrame(demo.update);
	}

    var setFloatUniform = function (prog, name, value) {
        var loc = gl.getUniformLocation(prog, name); 

        if (loc === null)
            return;

        gl.uniform1f(loc, value);
    }

    /* TODO add ShaderToy compatible uniforms here */
    var setCommonUniforms = function (entry, prog) {
        setFloatUniform(prog, "iGlobalTime", transport.getPos());
        setFloatUniform(prog, "beat", transport.getBeat());
        
        var resLoc = gl.getUniformLocation(prog, "iResolution");
		var mouseLoc = gl.getUniformLocation(prog, "iMouse");
		var localMouseLoc = gl.getUniformLocation(prog, "iLocalMouse");
        // TODO what's the third coordinate supposed to be?
        gl.uniform3f(resLoc, gl.viewportWidth, gl.viewportHeight, 1.0);
		gl.uniform4f(mouseLoc, mouse.pos.x, mouse.pos.y, mouse.buttons[1], mouse.buttons[1]);
        gl.uniform4f(localMouseLoc, mouse.pos.x / gl.viewportWidth, 1.0 - mouse.pos.y / gl.viewportHeight, mouse.buttons[1], mouse.buttons[3]);
    }

	demo.draw = function() {
		gl.clearColor(0.2, 0.2, 0.2, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT);

        var time = transport.getPos();
		var entry = playlist.getCurrent(time);

        if (!entry) {
            if (debugModeEnabled) 
                console.log("No entry found for current time", time);
            return;
        }
		
		if (!(entry.effect in effects)) {
			console.log("Invalid effect name in playlist: ", entry);
            return;
		} 

        effects[entry.effect].render(entry.params, function (prog) {
            setCommonUniforms(entry, prog);
            set2DVertexAttribPointer(prog);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, quadInds)
            gl.drawElements(gl.TRIANGLES, quadInds.numItems, gl.UNSIGNED_SHORT, 0);
        });

	}

	return demo;
})($, Assets, glul, Utils);
