precision mediump float;

uniform float time;
uniform float flash;

//varying highp vec2 vTextureCoord;

void main() { 
	gl_FragColor = vec4(1.0, 0.0 + flash, 0.0, 1.0);
}