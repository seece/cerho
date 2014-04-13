
float smin( float a, float b, float k )
{
    float res = exp( -k*a ) + exp( -k*b );
    return -log( res )/k;
}

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float talot(vec3 pos){
	//for more accurate distance field and less iterations
	//float txn=rand(vec2(int(pos.x)+1,int(pos.z)));
	//float txp=rand(vec2(int(pos.x)-1,int(pos.z)));
	//float tyn=rand(vec2(int(pos.x),int(pos.z)+1));
	//float typ=rand(vec2(int(pos.x),int(pos.z)-1));
	//float m=max(max(max(max(t,txn),txp),tyn),typ);
	
	
	float t=rand(vec2(int(pos.x),int(pos.z)));
	return (t*5.0+pos.y*5.0+5.0)*0.1;
}

float maa(vec3 pos){
	return talot(pos);
}
float pallo(vec3 pos){
	return length(pos)-1.0;	
}

float scene(vec3 pos){
	return smin(maa(pos),pallo(pos-vec3(0.0,sin(iLocalTime),0.0)),8.0)*0.2;	
}

float march(vec3 cam, vec3 dir){
	float matka=0.0;
	for (int i=0;i<200;i++){
		vec3 kohta=matka*dir+cam;
		float etaisyys= scene(kohta);
		matka+=etaisyys;
	}
	return matka;
}

void main(void)
{
	vec2 uv = gl_FragCoord.xy / iResolution.xy*2.0-1.0;
	uv.y*=iResolution.y/iResolution.x;
	
	float t=iLocalTime-0.0;
	
	vec3 cam=vec3(sin(t*1.7676),10.0/(t*t),-2.0-25.0/(t*0.5+0.2	));
	
	vec3 dir=normalize(vec3(uv,1.0));
	
	vec3 color= 1.0/vec3(march(cam,dir));
	
	gl_FragColor = vec4(color,1.0);
	
}