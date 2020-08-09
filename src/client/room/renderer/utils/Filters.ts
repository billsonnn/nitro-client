export class Filters
{
    public static solidColorFilter(color: number): PIXI.Filter
    {
        const solidColorFrag = `
            varying vec2 vTextureCoord;
            uniform sampler2D uSampler;
            uniform vec4 rgbColor;
            void main(void)
            {
                gl_FragColor = texture2D(uSampler, vTextureCoord);
                gl_FragColor.r = rgbColor.r * gl_FragColor.a;
                gl_FragColor.g = rgbColor.g * gl_FragColor.a;
                gl_FragColor.b = rgbColor.b * gl_FragColor.a;
            }
        `;

        return new PIXI.Filter(undefined, solidColorFrag, { rgbColor: color });
    }
}