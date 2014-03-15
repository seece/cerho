# cerho
A WebGL demo engine wannabe.

## Demo data 
A JSON file plus all required shaders. There is one vertex shader (`shader.vert`) and multiple fragment shaders (of the form `*.frag`). All required assets are listed in the `assets` portion of the demo JSON representation.

The demo data is self contained in a single directory (e.g. `invi/`) and all asset paths are assumed to be relative to this directory.

### Parameters
Each Effect (`effects` object in JSON) and PlaylistEntry (`playlist.entries`) can contain *parameters*. These objects are merged prioritizing the entry parameter definitions. The contained floating point values are passed in to the respective fragment shader as shader uniforms.

    
#### Example: parameter passing
In this example we assume the effect `meatballs` is defined in the `effects` portion of the JSON file.

To pass the parameter `flash` to a fragment shader you need to first specify the parameter in JSON:

```json
"entries" : [
            {
            "effect" : "meatballs",
            "begin" : 0.0,
            "end" : 15.0,
            "params" : {
                "flash" : 0.5
            }
            }

```

and also declare it in the fragment shader:

```GLSL
precision mediump float;

uniform float flash;

void main() { 
	gl_FragColor = vec4(flash, flash, flash, 1.0);
}

```

## Debug mode
Append `?debug` to url to enable debug mode.

## Uniforms
[ShaderToy][shader_toy] uniforms:

	uniform vec3      iResolution;           // viewport resolution (in pixels)
	uniform float     iGlobalTime;           // shader playback time (in seconds)
	uniform float     iChannelTime[4];       // channel playback time (in seconds)
	uniform vec3      iChannelResolution[4]; // channel resolution (in pixels)
	uniform vec4      iMouse;                // mouse pixel coords. xy: current (if MLB down), zw: click
	uniform samplerXX iChannel0..3;          // input channel. XX = 2D/Cube
	uniform vec4      iDate;                 // (year, month, day, time in seconds)

## License
zlib license. See `COPYING` for more.

[shader_toy]: https://www.shadertoy.com/