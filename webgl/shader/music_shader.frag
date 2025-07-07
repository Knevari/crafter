#version 300 es
precision mediump float;

in vec2 vUV;
out vec4 outColor;

uniform vec4 uColor;

uniform float uTime;
uniform float uMusicVolume;
uniform vec3 uMusicFFT;      // bass, mid, treble
uniform float uMusicVoice;   // voz separada
uniform float uMusicCentroid;
uniform float uMusicEnergy;
uniform float uMusicPitch;
uniform float uMusicIsBeat;

// HSV para RGB
vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1., 2./3., 1./3., 3.);
    vec3 p = abs(fract(c.xxx + K.xyz)*6. - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0., 1.), c.y);
}

void main() {
    vec2 uv = vUV * 2.0 - 1.0; // centro em (0,0)
    float dist = length(uv);
    float angle = atan(uv.y, uv.x); // -pi a pi
    
    // Normaliza ângulo 0 a 1
    float normAngle = (angle + 3.1415926) / (2.0 * 3.1415926);

    const int BAR_COUNT = 8;
    float barSize = 1.0 / float(BAR_COUNT);

    // Define valores das barras baseado nos parâmetros
    float values[8];
    values[0] = uMusicFFT.x;      // bass
    values[1] = uMusicFFT.y;      // mid
    values[2] = uMusicFFT.z;      // treble
    values[3] = uMusicVoice;      // voice
    values[4] = uMusicVolume;     // volume
    values[5] = uMusicCentroid;   // centroid
    values[6] = uMusicEnergy;     // energy
    values[7] = uMusicPitch;      // pitch

    // Determina qual barra o pixel está dentro (por ângulo)
    int barIndex = int(floor(normAngle * float(BAR_COUNT)));
    float barStart = float(barIndex) * barSize;
    float barEnd = barStart + barSize;

    // Se o ângulo está dentro do intervalo da barra
    if(normAngle >= barStart && normAngle < barEnd) {
        // Normaliza a posição da barra no seu setor angular [0,1]
        float localAngle = (normAngle - barStart) / barSize;

        // Altura (distância do centro) da barra proporcional ao valor do áudio
        float val = values[barIndex];
        val *= 0.8 + 0.5 * uMusicIsBeat; // pulse na batida

        // Bar radius (comprimento da barra)
        float barLength = 0.3 + val * 0.5;

        // Largura angular da barra (menor que o setor)
        float barThickness = barSize * 0.6;

        // Mapeia a barra para faixa angular: localAngle de 0 a 1
        float angleFromCenter = (localAngle - 0.5) * barSize * 2.0;

        // Ajusta distância radial para criar a barra
        // Checa se pixel está na barra:
        // dist <= barLength é dentro da barra no comprimento
        // abs(angleFromCenter) < barThickness/2 é dentro da espessura angular

        if(dist < barLength && abs(angleFromCenter) < barThickness / 2.0) {
            // Cor dinâmico com hue baseado no índice da barra e tempo
            float hue = mod(float(barIndex) / float(BAR_COUNT) + uTime * 0.1, 1.0);
            float sat = 0.8 + 0.2 * uMusicEnergy;
            float valCol = 0.6 + 0.4 * val;

            vec3 color = hsv2rgb(vec3(hue, sat, valCol));

            // Intensifica canais RGB com graves, médios, voz para dar riqueza
            if(barIndex == 0) color.r += uMusicFFT.x * 0.3;
            else if(barIndex == 1) color.g += uMusicFFT.y * 0.3;
            else if(barIndex == 3) color.b += uMusicVoice * 0.4;

            // Glow suave perto da borda da barra
            float glow = smoothstep(barLength, barLength - 0.02, dist);

            color *= glow;

            outColor = vec4(color, 1.0);
            return;
        }
    }

    // Fundo preto suave com vignette circular
    float vignette = smoothstep(0.8, 0.4, dist);
    vec3 bgColor = vec3(0.05, 0.05, 0.05) * vignette;

    outColor = vec4(bgColor, 1.0);
}
