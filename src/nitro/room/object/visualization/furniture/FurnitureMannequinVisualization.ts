import { IObjectVisualizationData } from '../../../../../room/object/visualization/IRoomObjectVisualizationData';
import { AvatarSetType } from '../../../../avatar/enum/AvatarSetType';
import { IAvatarImage } from '../../../../avatar/IAvatarImage';
import { IAvatarImageListener } from '../../../../avatar/IAvatarImageListener';
import { RoomObjectVariable } from '../../RoomObjectVariable';
import { FurnitureMannequinVisualizationData } from './FurnitureMannequinVisualizationData';
import { FurnitureVisualization } from './FurnitureVisualization';

export class FurnitureMannequinVisualization extends FurnitureVisualization implements IAvatarImageListener
{
    private static AVATAR_IMAGE_SPRITE_TAG: string = 'avatar_image';
    private static _Str_5674: Map<number, IAvatarImage>;

    protected _data: FurnitureMannequinVisualizationData;

    private _mannequinScale: number;
    private _figure: string;
    private _gender: string;
    private _dynamicAssetName: string;
    private _needsUpdate: boolean;

    private _placeHolderFigure: string;

    private _disposed: boolean;

    constructor()
    {
        super();

        this._mannequinScale    = -1;
        this._figure            = null;
        this._gender            = null;
        this._dynamicAssetName  = null;
        this._needsUpdate       = false;

        this._placeHolderFigure = 'hd-99999-99998';

        this._disposed          = false;
    }

    public initialize(data: IObjectVisualizationData): boolean
    {
        if(!(data instanceof FurnitureMannequinVisualizationData)) return false;

        return super.initialize(data);
    }

    public dispose(): void
    {
        if(this._disposed) return;

        this._disposed = true;

        super.dispose();
    }

    protected updateObject(scale: number, direction: number): boolean
    {
        let updateObject = super.updateObject(scale, direction);

        if(updateObject)
        {
            if(this._mannequinScale !== scale)
            {
                this._mannequinScale = scale;

                this._Str_15978();
            }
        }

        return updateObject;
    }

    protected updateModel(scale: number): boolean
    {
        let updateModel = super.updateModel(scale);

        if(updateModel)
        {
            const figure = (this.object.model.getValue(RoomObjectVariable.FURNITURE_MANNEQUIN_FIGURE) || null);

            if(figure)
            {
                this._figure   = (figure + '.' + this._placeHolderFigure);
                this._gender   = (this.object.model.getValue(RoomObjectVariable.FURNITURE_MANNEQUIN_GENDER) || null);

                this._Str_15978();
            }
        }

        updateModel = (updateModel || this._needsUpdate);

        this._needsUpdate = false;

        return updateModel;
    }

    private _Str_23643(k: number): IAvatarImage
    {
        if(!FurnitureMannequinVisualization._Str_5674) FurnitureMannequinVisualization._Str_5674 = new Map();

        let cachedImage = FurnitureMannequinVisualization._Str_5674.get(k);

        if(!cachedImage)
        {
            cachedImage = this._data.createAvatarImage(this._placeHolderFigure, k, null, null);

            FurnitureMannequinVisualization._Str_5674.set(k, cachedImage);
        }

        return cachedImage;
    }

    private _Str_15978(k: boolean = false):void
    {
        if(!this._Str_13016() || k)
        {
            const _local_2 = this._data.createAvatarImage(this._figure, this._mannequinScale, this._gender, this);

            if(_local_2)
            {
                if(_local_2.isPlaceholder())
                {
                    _local_2.dispose();

                    const _local_3 = this._Str_23643(this._mannequinScale);

                    _local_3.setDirection(AvatarSetType.FULL, this.direction);
                    
                    this.asset.addAsset(this._Str_10185(), _local_3.getImage(AvatarSetType.FULL, true), true, 0, 0, false, false);

                    this._needsUpdate = true;

                    return;
                }

                _local_2.setDirection(AvatarSetType.FULL, this.direction);

                if(this._dynamicAssetName) this.asset.disposeAsset(this._dynamicAssetName);

                this.asset.addAsset(this._Str_10185(), _local_2.getImage(AvatarSetType.FULL, true), true, 0, 0, false, false);

                this._dynamicAssetName  = this._Str_10185();
                this._needsUpdate       = true;

                _local_2.dispose();
            }
        }
    }

    private _Str_13016(): boolean
    {
        return (this._figure && (this.getAsset(this._Str_10185()) !== null));
    }

    private _Str_10185(): string
    {
        return (((((('mannequin_' + this._figure) + '_') + this._mannequinScale) + '_') + this.direction) + '_') + this.object.id;
    }

    public resetFigure(figure: string): void
    {
        if(figure === this._figure) this._Str_15978(true);
    }

    protected getSpriteAssetName(scale: number, layerId: number): string
    {
        const tag = this.getLayerTag(scale, this.direction, layerId);

        if(this._figure && (tag === FurnitureMannequinVisualization.AVATAR_IMAGE_SPRITE_TAG) && this._Str_13016())
        {
            return this._Str_10185();
        }

        return super.getSpriteAssetName(scale, layerId);
    }

    protected getLayerXOffset(scale: number, direction: number, layerId: number): number
    {
        const tag = this.getLayerTag(scale, direction, layerId);

        if((tag === FurnitureMannequinVisualization.AVATAR_IMAGE_SPRITE_TAG) && this._Str_13016()) return (-(this.getSprite(layerId).width) / 2);
        
        return super.getLayerXOffset(scale, direction, layerId);
    }

    protected getLayerYOffset(scale: number, direction: number, layerId: number): number
    {
        const tag = this.getLayerTag(scale, direction, layerId);

        if((tag === FurnitureMannequinVisualization.AVATAR_IMAGE_SPRITE_TAG) && this._Str_13016()) return -(this.getSprite(layerId).height);
        
        return super.getLayerYOffset(scale, direction, layerId);
    }

    public get disposed(): boolean
    {
        return this._disposed;
    }
}