float pallo(vec2 uv, vec2 paikka){
	return distance(uv, paikka);
}

float rajoitaEtaisyys(float variarvo){
	
	
	
	if(variarvo >= 1.0)
		return 1.0;
	else 
		return 0.1;

}

void main(void)
{
	vec2 uv = gl_FragCoord.xy / iResolution.xy;
	uv.x*=iResolution.x/iResolution.y;
		
	vec2 paikka1 = vec2(0.7+sin(iGlobalTime*0.9), 0.5);
	float sade1 = 0.2;
		
	vec2 paikka2 = vec2(0.2+sin(iGlobalTime), 0.5);
	float sade2 = 0.3;
	
	vec4 alkuperainenVari = vec4(1.0, 0.5, (sade1/pallo(paikka1, uv) + sade2/pallo(paikka2, uv)), 1.0);
	vec4 hienoVari = vec4(1.0, 0.5, rajoitaEtaisyys(sade1/pallo(paikka1, uv) + sade2/pallo(paikka2, uv)), 1.0);
	float maara = sin(iGlobalTime)*0.5+0.5;
	vec4 uusiVari = maara*alkuperainenVari+(1.0-maara)*hienoVari;
	
	gl_FragColor = uusiVari;
}