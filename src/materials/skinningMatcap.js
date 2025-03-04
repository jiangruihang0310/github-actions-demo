import vertexShader from '@/shaders/skinning-matcap/vertex.glsl'
import fragmentShader from '@/shaders/skinning-matcap/fragment.glsl'
import { ShaderMaterial, Texture } from 'three'

export default function (texture) {
    return new ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
            uTexture: {
                value: texture
            }
        }
    })
}