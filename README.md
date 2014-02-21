# cerho
A WebGL demo engine wannabe.

## Demo data 
A JSON file plus all required shaders. There is one vertex shader (`shader.vert`) and multiple fragment shaders (of the form `*.frag`). All required assets are listed in the `assets` portion of the demo JSON representation.

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

## License
zlib license. See `COPYING` for more.
