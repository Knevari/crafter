#version 300 es
precision mediump float;

in vec2 vUV;
out vec4 outColor;

uniform vec4 uColor;        // Cor base da água
uniform float uTime;        // Tempo para animação
uniform vec2 uWorldOffset;  // Offset global em unidades do mundo
uniform vec2 uTileSize;     // Tamanho do tile em unidades do mundo
uniform float uWaveScale;   // Densidade das ondas


// Hash simples que gera valor pseudoaleatório a partir de uma posição 2D
float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

// Noise interpolado 2D (value noise)
float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
    float total = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;

    for (int i = 0; i < 5; i++) {
        total += noise(p * frequency) * amplitude;
        frequency *= 2.0;
        amplitude *= 0.5;
    }
    return total;
}


float waveHeight(vec2 uv, float time) {
    float phaseShift = fbm(uv * 2.0 + time * 0.5) * 6.2831; // 0 a 2π
    float h = 0.0;
    h += 0.15 * sin(dot(uv, vec2(0.8, 0.6)) * 4.0 - time * 1.0 + phaseShift);
    h += 0.1 * sin(dot(uv, vec2(-0.5, 1.0)) * 7.0 - time * 1.5 + phaseShift * 1.3);
    h += 0.05 * sin(dot(uv, vec2(1.0, -0.3)) * 10.0 - time * 2.0 + phaseShift * 0.7);
    h += 0.05 * fbm(uv * 3.0 + time * 0.2);
    return h;
}



// Normal via gradiente
vec3 computeNormal(vec2 uv, float time) {
    float e = 0.01;
    float c = waveHeight(uv, time);
    float cx = waveHeight(uv + vec2(e,0.0), time);
    float cy = waveHeight(uv + vec2(0.0,e), time);
    vec3 n = normalize(vec3(cx - c, cy - c, e));
    return n;
}

void main() {
    float time = uTime;

    vec2 uvGlobal = vUV * uTileSize + uWorldOffset;
    vec2 uv = uvGlobal * uWaveScale;

    vec3 normal = computeNormal(uv, time);

    vec3 viewDir = normalize(vec3(0.0, 0.0, 1.0));
    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.0) * 0.8 + 0.2;

    float eta = 1.0 /1.3;
    vec3 refracted = refract(-viewDir, normal, eta);

    vec2 refractUV = vUV + refracted.xy * 0.05;

    // Fundo do mar amostrado via refractUV para efeito de refração
    vec3 seabedColor = vec3(0.0, 0.05, 0.1) + 0.15 * fbm(uvGlobal * 2.0  * 10.0 + time * 0.1);

    vec3 waterColor = mix(seabedColor, uColor.rgb, 0.6);

    vec3 skyColor = vec3(0.0f, 0.67f, 1.0f);

    vec3 reflectedColor = mix(waterColor, skyColor, fresnel);

    vec3 lightDir = normalize(vec3(-0.3, 0.5, 0.7));
    float highlight = pow(max(dot(reflect(-lightDir, normal), viewDir), 0.0), 30.0) * 0.5;
    reflectedColor += vec3(1.0f, 0.98f, 0.92f) * highlight;

    outColor = vec4(reflectedColor, uColor.a);
}
