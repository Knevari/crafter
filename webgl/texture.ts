export interface Texture {
    texture: WebGLTexture;
    width: number;
    height: number;
    format: GLenum;
    internalFormat: GLenum;
    type: GLenum;
    minFilter: GLenum;
    magFilter: GLenum;
    wrapS: GLenum;
    wrapT: GLenum;
    mipmaps: boolean;
}

function isPowerOfTwo(value: number): boolean {
    return (value & (value - 1)) === 0;
}

export function createTexture(
    gl: WebGL2RenderingContext,
    image: ImageBitmap,
    options?: Partial<Omit<Texture, "texture" | "width" | "height">>,
): Texture {
    const texture = gl.createTexture();
    if (!texture) throw new Error("Failed to create WebGLTexture");

    gl.bindTexture(gl.TEXTURE_2D, texture);

    const format = options?.format ?? gl.RGBA;
    const internalFormat = options?.internalFormat ?? gl.RGBA8;
    const type = options?.type ?? gl.UNSIGNED_BYTE;
    const minFilter = options?.minFilter ?? gl.NEAREST;
    const magFilter = options?.magFilter ?? gl.NEAREST;
    let wrapS = options?.wrapS ?? gl.REPEAT;
    let wrapT = options?.wrapT ?? gl.REPEAT;
    const mipmaps = options?.mipmaps ?? false;

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, format, type, image);

    const isPOT = isPowerOfTwo(image.width) && isPowerOfTwo(image.height);

    // Força CLAMP_TO_EDGE se NPOT
    if (!isPOT) {
        if (wrapS !== gl.CLAMP_TO_EDGE || wrapT !== gl.CLAMP_TO_EDGE) {
            console.warn(
                "createTexture: Texture is NPOT; forcing wrapS and wrapT to CLAMP_TO_EDGE"
            );
            wrapS = gl.CLAMP_TO_EDGE;
            wrapT = gl.CLAMP_TO_EDGE;
        }
        if (mipmaps) {
            console.warn(
                "createTexture: Texture is NPOT; mipmaps are not supported and will be ignored"
            );
        }
    } else {
        if (mipmaps) {
            gl.generateMipmap(gl.TEXTURE_2D);
        }
    }

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);

    gl.bindTexture(gl.TEXTURE_2D, null);

    return {
        texture,
        width: image.width,
        height: image.height,
        format,
        internalFormat,
        type,
        minFilter,
        magFilter,
        wrapS,
        wrapT,
        mipmaps: isPOT && mipmaps,
    };
}
