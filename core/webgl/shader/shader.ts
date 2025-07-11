import { compileShader, createProgram, getAttributes, getUniforms } from "../gl";

export interface Shader {
  name: string;
  program: WebGLProgram;
  vertexSource: string;
  fragmentSource: string;
  attributes: Map<string, GLint>;
  uniforms: Map<string, WebGLUniformLocation>;
}

export function createShader(
  gl: WebGL2RenderingContext,
  name: string,
  vertexSource: string,
  fragmentSource: string
): Shader {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

  const program = createProgram(gl, vertexShader, fragmentShader);

  const attributes = getAttributes(gl, program);
  const uniforms = getUniforms(gl, program);

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