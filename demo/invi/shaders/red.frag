
uniform float flash;
uniform float beat;

void main() { 
	float time = iGlobalTime;
	vec2 coords = gl_FragCoord.xy / iResolution.xy;
	vec2 uv = coords * vec2(1.0, 9.0/16.0);
	float c = mod(gl_FragCoord.x, 2.0);
	vec3 col = vec3(uv.x * iMouse.z, iLocalMouse.y > coords.y, iLocalMouse.x > coords.x);
	col.rgb = texture2D(iChannel0, uv).rgb;
	gl_FragColor = vec4(col, 1.0);
}