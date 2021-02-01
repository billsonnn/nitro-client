export class WebGL
{
    public static isWebGLAvailable(): boolean
    {
        if(window.WebGLRenderingContext)
        {
            const canvas = document.createElement('canvas');
            const names = ['webgl2', 'webgl', 'experimental-webgl', 'moz-webgl', 'webkit-3d'];

            for(const name of names)
            {
                try
                {
                    const context = canvas.getContext(name);

                    // @ts-ignore
                    if(context && typeof context.getParameter == 'function') return true;
                }

                catch (e)
                {
                    continue;
                }
            }

            // WebGL is supported, but disabled
            return false;
        }

        // WebGL not supported
        return false;
    }
}