precision mediump float;

uniform float time;
uniform float flash;
uniform float beat;

//varying highp vec2 vTextureCoord;

void main() { 
	gl_FragColor = vec4(mod(beat, 1.0), 0.0 + flash, 0.5 + sin(time*3.14)*0.5, 1.0);
}