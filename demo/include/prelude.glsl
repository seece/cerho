precision mediump float;

uniform vec3      iResolution;           // viewport resolution (in pixels)
uniform float     iGlobalTime;           // shader playback time (in seconds)
//uniform float     iChannelTime[4];       // channel playback time (in seconds)
//uniform vec3      iChannelResolution[4]; // channel resolution (in pixels)
uniform vec4      iMouse;                // mouse pixel coords. xy: current (if MLB down), zw: click
//uniform samplerXX iChannel0..3;          // input channel. XX = 2D/Cube
//uniform vec4      iDate;                 // (year, month, day, time in seconds)

// Custom uniforms not found on ShaderToy
uniform vec4      iLocalMouse;                // normalized mouse coords. xy: current, zw: left click, right click
