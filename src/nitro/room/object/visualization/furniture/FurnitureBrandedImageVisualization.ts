import { RoomObjectModelKey } from '../../RoomObjectModelKey';
import { FurnitureVisualization } from './FurnitureVisualization';

export class FurnitureBrandedImageVisualization extends FurnitureVisualization
{
    private static BRANDED_IMAGE: string = 'branded_image';

    protected _imageUrl: string;
    protected _imageReady: boolean;
    
    protected _offsetX: number;
    protected _offsetY: number;
    protected _offsetZ: number;

    constructor()
    {
        super();

        this._imageUrl      = null;
        this._imageReady    = false;

        this._offsetX       = 0;
        this._offsetY       = 0;
        this._offsetZ       = 0;
    }

    protected updateObject(direction: number): boolean
    {
        if(!super.updateObject(direction)) return false;

        //if(this._imageReady) this.updateImage();

        return true;
    }

    protected updateModel(): boolean
    {
        const flag = super.updateModel();
        
        if(flag)
        {
            this._offsetX   = this.object.model.getValue(RoomObjectModelKey.FURNITURE_BRANDING_OFFSET_X) as number;
            this._offsetY   = this.object.model.getValue(RoomObjectModelKey.FURNITURE_BRANDING_OFFSET_Y) as number;
            this._offsetZ   = this.object.model.getValue(RoomObjectModelKey.FURNITURE_BRANDING_OFFSET_Z) as number;

            const imageUrl = this.object.model.getValue(RoomObjectModelKey.FURNITURE_BRANDING_IMAGE_URL) as string;

            if(!imageUrl || (this._imageUrl !== imageUrl))
            {
                this._imageUrl      = null;
                this._imageReady    = false;
            }
        }

        if(!this._imageReady)
        {
            this._imageReady = this.checkImageReady();

            if(this._imageReady)
            {
                this.updateImage();

                return true;
            }
        }

        return flag;
    }

    protected getSpriteAssetName(layerId: number): string
    {
        const tag = this.getLayerTag(this._direction, layerId);

        if(tag === FurnitureBrandedImageVisualization.BRANDED_IMAGE) return this._imageUrl;

        return super.getSpriteAssetName(layerId);
    }

    protected getLayerIgnoreMouse(direction: number, layerId: number): boolean
    {
        const tag = this.getLayerTag(direction, layerId);

        if(tag !== FurnitureBrandedImageVisualization.BRANDED_IMAGE) return super.getLayerIgnoreMouse(direction, layerId);

        return true;
    }

    private checkImageReady(): boolean
    {
        const model = this.object && this.object.model;

        if(!model) return false;

        const imageUrl = this.object.model.getValue(RoomObjectModelKey.FURNITURE_BRANDING_IMAGE_URL) as string;

        if(!imageUrl) return false;

        if(this._imageUrl && (this._imageUrl === imageUrl)) return false;

        const imageStatus = this.object.model.getValue(RoomObjectModelKey.FURNITURE_BRANDING_IMAGE_STATUS) as number;

        if(!imageStatus) return false;

        this.imageReady(imageUrl);

        return true;
    }

    protected imageReady(imageUrl: string): void
    {
        this._imageUrl = imageUrl;
    }

    protected updateImage(): void
    {
        if(!this._imageUrl) return;

        // const sprite = this.createAndAddSprite(this._imageUrl, this._imageUrl);

        // if(!sprite) return;

        // sprite.doesntHide = true;

        // this.resetLayers();
    }
}