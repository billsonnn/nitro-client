import { settings } from 'pixi.js';

export class WebGL
{
    public static isWebGLAvailable(): boolean
    {
        try
        {
            if(!window.WebGLRenderingContext) return false;

            const contextOptions = {
                stencil: true,
                failIfMajorPerformanceCaveat: settings.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT
            };

            const canvas  = document.createElement('canvas');
            let gl      = (canvas.getContext('webgl', contextOptions) || canvas.getContext('experimental-webgl', contextOptions));

            //@ts-ignore
            const success = !!(gl && gl.getContextAttributes().stencil);

            if(gl)
            {
                //@ts-ignore
                const loseContext = gl.getExtension('WEBGL_lose_context');

                if(loseContext) loseContext.loseContext();
            }

            gl = null;

            return success;
        }

        catch (e)
        {
            return false;
        }
    }
}