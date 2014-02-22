
uniform float flash;
uniform float beat;

//varying highp vec2 vTextureCoord;

void main() { 
	float time = iGlobalTime;
	vec2 uv = gl_FragCoord.xy / iResolution.xy;
	uv.y *= 9.0/16.0;
	float c = mod(gl_FragCoord.x, 2.0);
	vec3 col = vec3(c, c, c);
	gl_FragColor = vec4(col, 1.0);
}