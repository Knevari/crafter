import { compileShader, createProgram, getAttributes, getUniforms } from "./gl";
import type { Texture } from "./texture";

export interface ShaderProgram {
    name: string;
    program: WebGLProgram;
    vertexSource: string;
    fragmentSource: string;
    attributes: Map<string, GLint>;
    uniforms: Map<string, WebGLUniformLocation>;
    
}

export function createShaderProgram(
    gl: WebGL2RenderingContext,
    name: string,
    vertexSource: string,
    fragmentSource: string
): ShaderProgram {
    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

    const program = createProgram(gl, vertexShader, fragmentShader);

    const attributes = getAttributes(gl, program);
    const uniforms = getUniforms(gl, program);

    // Opcionalmente deletar os shaders após linkar o programa
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);

    return {
        name,
        program,
        vertexSource,
        fragmentSource,
        attributes,
        uniforms,
    };
}

export function getUniform(shader: ShaderProgram, name: string): WebGLUniformLocation | null {
    return shader.uniforms.get(name) ?? null;
}

export function getAttribute(shader: ShaderProgram, name: string): GLint | null {
    return shader.attributes.get(name) ?? null;
}

export function shader_set_uniform_mat4(gl: WebGL2RenderingContext, shader: ShaderProgram, name: string, matrix: Float32Array) {
    const location = getUniform(shader, name);
    if (location) {
        gl.uniformMatrix4fv(location, false, matrix);
    }
}

export function shader_set_uniform_4f(gl: WebGL2RenderingContext, shader: ShaderProgram, name: string, x: number, y: number, z: number, w: number) {
    const location = getUniform(shader, name);
    if (location) {
        gl.uniform4f(location, x, y, z, w);
    }
}

export function shader_set_uniform_3f(gl: WebGL2RenderingContext, shader: ShaderProgram, name: string, x: number, y: number, z: number) {
    const location = getUniform(shader, name);
    if (location) {
        gl.uniform3f(location, x, y, z);
    }
}

export function shader_set_uniform_2f(gl: WebGL2RenderingContext, shader: ShaderProgram, name: string, x: number, y: number) {
    const location = getUniform(shader, name);
    if (location) {
        gl.uniform2f(location, x, y);
    }
}

export function shader_set_uniform_1f(gl: WebGL2RenderingContext, shader: ShaderProgram, name: string, x: number) {
    const location = getUniform(shader, name);
    if (location) {
        gl.uniform1f(location, x);
    }
}

export function shader_set_uniform_texture(
    gl: WebGL2RenderingContext,
    shader: ShaderProgram,
    name: string,
    texture: Texture,
    unit: number = 0 
) {
    const glTexture = texture.texture;

    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, glTexture);

    const location = getUniform(shader, name);
    if (location) {
        gl.uniform1i(location, unit);
    }
}
