//shadertoy.com
void main( void )
{
	float t=iGlobalTime; //lyhennysmerkintä
	vec2 pos = ( gl_FragCoord.xy / vec2(320, 240))*(sin(iGlobalTime)*0.2+2.0);
	float a=t*.2;
	pos= pos+vec2(sin(pos.x*4.0),sin(pos.y*3.0))*0.5;
	pos= vec2(pos.x*cos(a)-pos.y*sin(a),pos.x*sin(a)+pos.y*cos(a)); // pyöritys
	pos= pos+vec2(sin(pos.x*4.0),sin(pos.y*3.0))*sin (pos.y*.01+t)*0.1; //aaldojuddu :DD
	float color_r =  sin( pos.y * 40.0+iGlobalTime*10.0 )+sin(pos.x*10.0+iGlobalTime*10.0);
	float color_g = sin(iGlobalTime*20.0+ pos.x*6.0)+sin(pos.y*3.0);
	float color_b = sin(pos.x+pos.y);
	float summa = color_r+color_g+color_b;
	summa = summa/3.0;
	vec4 vari = vec4( color_r*0.0+summa,color_g+summa,color_b+summa,0.0);
	vari = vari*sin(pos.y*.01+t);
	gl_FragColor = vari;
	
    
}