vec3 palautaPallo(vec2 pos, float koko, vec2 uv){			//palauttaa rgb-arvona
	float etaisyysPalloon=length(uv-pos)/koko;			//nykyisen pikselin etäisyys keskipisteeseen
	etaisyysPalloon=min(max((1.0-etaisyysPalloon),0.0),1.0);		//rajataan arvot 0.0..1.0 välille, huomaa invertoidaan väritys
	etaisyysPalloon*=etaisyysPalloon; //tehdään pisteestä pallomaisempi
	return vec3(etaisyysPalloon);
}
void main(void)
{
	vec2 uv = gl_FragCoord.xy / iResolution.xy;
	uv.x*=iResolution.x/iResolution.y;							//kuvasuhteen korjaus
	vec3 variarvot=vec3(0.0, 0.0, 0.0);
	for(float i=0.; i<10.; i++){
		//pallon paikka
		//keksitään jotain sattuman varaisia i:hin sidottuja arvoja pallolle		
		vec2 palloPaikka=vec2(0.5+0.5*sin(iGlobalTime+i)+0.1*i, 0.5+0.3*cos(iGlobalTime+sin(i)+0.54*i));		
		float palloKoko=0.35;
		variarvot+=palautaPallo(palloPaikka,palloKoko,uv);
	}
	
	variarvot *= vec3(sin(uv.x), sin(uv.y), cos(uv)) - vec3(sin(iGlobalTime) + 0.1, 0.0, 0.0);
	
	gl_FragColor = vec4(variarvot*2.0,1.0);					//rgb-arvot esittävät etäisyyttä palloon nykyiseestä käsiteltävästä pikselistä
}