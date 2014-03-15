precision mediump float;
attribute vec2 pos;
//varying highp vec2 vTextureCoord;

void main() { 
    gl_Position = vec4(pos, 0, 1);
    //vTextureCoord = pos * 0.5 + vec2(0.5, 0.5);
}
