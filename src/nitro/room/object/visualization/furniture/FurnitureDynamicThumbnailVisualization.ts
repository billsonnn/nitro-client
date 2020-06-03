import { FurnitureThumbnailVisualization } from './FurnitureThumbnailVisualization';

export class FurnitureDynamicThumbnailVisualization extends FurnitureThumbnailVisualization
{
    private _cachedUrl: string;

    constructor()
    {
        super();

        this._cachedUrl = null;
    }

    protected updateModel(scale: number): boolean
    {
        if(this.object)
        {
            const thumbnailUrl = this.getThumbnailURL();

            if(this._cachedUrl !== thumbnailUrl)
            {
                this._cachedUrl = thumbnailUrl;

                if(this._cachedUrl && (this._cachedUrl !== ''))
                {
                    const image = new Image();

                    image.crossOrigin   = 'anonymous';
                    image.onload        = this._Str_25282.bind(this);
                    image.src           = thumbnailUrl;
                }
                else
                {
                    this._Str_6645(null);
                }
            }
        }

        return super.updateModel(scale);
    }

    protected getThumbnailURL(): string
    {
        throw (new Error('This method must be overridden!'));
    }

    private _Str_25282(event: Event): void
    {
        if(!event || !event.target || (!(event.target instanceof Image)))
        {
            this._Str_6645(null);

            return;
        }

        const texture = PIXI.RenderTexture.from(event.target as HTMLImageElement);

        if(texture)
        {
            const graphic = new PIXI.Graphics()
                .beginTextureFill({ texture })
                .drawRect(0, 0, texture.width, texture.height)
                .endFill();
                
            this._Str_6645(graphic);

            return;
        }

        this._Str_6645(null);
    }
}