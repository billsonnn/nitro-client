import { Container, Sprite } from 'pixi.js';
import { AvatarFigurePartType } from '../../../../client/nitro/avatar/enum/AvatarFigurePartType';
import { FigureData } from '../../../../client/nitro/avatar/figuredata/FigureData';
import { IAvatarImageListener } from '../../../../client/nitro/avatar/IAvatarImageListener';
import { IAvatarRenderManager } from '../../../../client/nitro/avatar/IAvatarRenderManager';
import { IFigurePart } from '../../../../client/nitro/avatar/structure/figure/IFigurePart';
import { IFigurePartSet } from '../../../../client/nitro/avatar/structure/figure/IFigurePartSet';
import { IPartColor } from '../../../../client/nitro/avatar/structure/figure/IPartColor';
import { Nitro } from '../../../../client/nitro/Nitro';
import { IGraphicAsset } from '../../../../client/room/object/visualization/utils/IGraphicAsset';
import { TextureUtils } from '../../../../client/room/utils/TextureUtils';
import { CategoryBaseModel } from './CategoryBaseModel';

export class AvatarEditorGridPartItem implements IAvatarImageListener
{
    private static THUMB_DIRECTIONS: number[]   = [2, 6, 0, 4, 3, 1];
    private static DRAW_ORDER: string[]         = [
        AvatarFigurePartType.LEFT_HAND_ITEM,
        AvatarFigurePartType.LEFT_HAND,
        AvatarFigurePartType.LEFT_SLEEVE,
        AvatarFigurePartType.LEFT_COAT_SLEEVE,
        AvatarFigurePartType.BODY,
        AvatarFigurePartType.SHOES,
        AvatarFigurePartType.LEGS,
        AvatarFigurePartType.CHEST,
        AvatarFigurePartType.CHEST_ACCESSORY,
        AvatarFigurePartType.COAT_CHEST,
        AvatarFigurePartType.CHEST_PRINT,
        AvatarFigurePartType.WAIST_ACCESSORY,
        AvatarFigurePartType.RIGHT_HAND,
        AvatarFigurePartType.RIGHT_SLEEVE,
        AvatarFigurePartType.RIGHT_COAT_SLEEVE,
        AvatarFigurePartType.HEAD,
        AvatarFigurePartType.FACE,
        AvatarFigurePartType.EYES,
        AvatarFigurePartType.HAIR,
        AvatarFigurePartType.HAIR_BIG,
        AvatarFigurePartType.FACE_ACCESSORY,
        AvatarFigurePartType.EYE_ACCESSORY,
        AvatarFigurePartType.HEAD_ACCESSORY,
        AvatarFigurePartType.HEAD_ACCESSORY_EXTRA,
        AvatarFigurePartType.RIGHT_HAND_ITEM,
    ];

    private _renderManager: IAvatarRenderManager;
    private _model: CategoryBaseModel;
    private _partSet: IFigurePartSet;
    private _colors: IPartColor[];
    private _useColors: boolean;
    private _isDisabledForWearing: boolean;
    private _thumbContainer: Container;
    private _imageUrl: string;
    private _maxColorIndex: number;
    private _isValidFigure: boolean;
    private _isSelected: boolean;
    private _isHC: boolean;
    private _isSellable: boolean;
    private _disposed: boolean;
    private _isInitalized: boolean;

    constructor(model: CategoryBaseModel, partSet: IFigurePartSet, partColors: IPartColor[], useColors: boolean = true, isDisabledForWearing: boolean = false)
    {
        this._renderManager         = Nitro.instance.avatar;
        this._model                 = model;
        this._partSet               = partSet;
        this._colors                = partColors;
        this._useColors             = useColors;
        this._isDisabledForWearing  = isDisabledForWearing;
        this._thumbContainer        = null;
        this._imageUrl              = null;
        this._maxColorIndex         = 0;
        this._isValidFigure         = false;
        this._isSelected            = false;
        this._isHC                  = false;
        this._isSellable            = false;
        this._disposed              = false;
        this._isInitalized          = false;

        if(partSet)
        {
            const colors = partSet._Str_806;

            for(let color of colors) this._maxColorIndex = Math.max(this._maxColorIndex, color._Str_827);
        }
    }

    public init(): void
    {
        if(this._isInitalized) return;
        
        this._isInitalized = true;

        this.update();
    }

    public dispose(): void
    {
        if(this._disposed) return;

        this._renderManager     = null;
        this._model             = null;
        this._partSet           = null;
        this._colors            = null;
        this._imageUrl          = null;
        this._disposed          = true;
        this._isInitalized      = false;

        if(this._thumbContainer)
        {
            this._thumbContainer.destroy();

            this._thumbContainer = null;
        }
    }

    public update(): void
    {
        this.updateThumbVisualization();
    }

    private analyzeFigure(): boolean
    {
        if(!this._renderManager || !this._model || !this.partSet || !this.partSet._Str_806 || !this.partSet._Str_806.length) return false;

        const figureContainer = this._renderManager.createFigureContainer(((this.partSet.type + '-') + this.partSet.id));

        if(!this._renderManager.isFigureContainerReady(figureContainer))
        {
            this._renderManager.downloadAvatarFigure(figureContainer, this);

            return false;
        }

        this._isValidFigure = true;

        return true;
    }

    private renderThumb(): Container
    {
        if(!this._renderManager || !this.partSet || !this._model) return null;

        if(!this._isValidFigure)
        {
            if(!this.analyzeFigure()) return null;
        }

        const parts     = this.partSet._Str_806.concat().sort(this.sortByDrawOrder);
        const container = new Container();

        for(let part of parts)
        {
            if(!part) continue;

            let asset: IGraphicAsset    = null;
            let direction               = 0;
            let hasAsset                = false;

            while(!hasAsset && (direction < AvatarEditorGridPartItem.THUMB_DIRECTIONS.length))
            {
                const assetName = ((((((((((FigureData.H + '_') + FigureData.STD) + '_') + part.type) + '_') + part.id) + '_') + AvatarEditorGridPartItem.THUMB_DIRECTIONS[direction]) + '_') + FigureData._Str_2028);

                asset = this._renderManager.getAssetByName(assetName);

                if(asset && asset.texture)
                {
                    hasAsset = true;
                }
                else
                {
                    direction++;
                }
            }

            if(!hasAsset) continue;

            let x                       = asset.offsetX;
            let y                       = asset.offsetY;
            let partColor: IPartColor   = null;

            if(this._useColors && (part._Str_827 > 0))
            {
                const color = this._colors[(part._Str_827 - 1)];

                if(color) partColor = color;
            }

            const sprite = new Sprite(asset.texture);

            sprite.position.set(x, y);

            if(partColor) sprite.tint = partColor._Str_915;

            container.addChild(sprite);
        }

        return container;
    }

    private updateThumbVisualization(): void
    {
        if(!this._isInitalized) return;

        let container: Container = this._thumbContainer;

        if(!container) container = this.renderThumb();

        if(!container) return;

        if(this._partSet)
        {
            this._isHC          = (this._partSet.clubLevel > 0);
            this._isSellable    = this._partSet._Str_651;
        }
        else
        {
            this._isHC          = false;
            this._isSellable    = false;
        }

        if(this._isDisabledForWearing) this.setAlpha(container, 0.2);

        this._imageUrl = TextureUtils.generateImageUrl(container);
    }

    private setAlpha(container: Container, alpha: number): Container
    {
        container.alpha = alpha;

        return container;
    }

    private sortByDrawOrder(a: IFigurePart, b: IFigurePart): number
    {
        const indexA = AvatarEditorGridPartItem.DRAW_ORDER.indexOf(a.type);
        const indexB = AvatarEditorGridPartItem.DRAW_ORDER.indexOf(b.type);

        if(indexA < indexB) return -1;

        if(indexA > indexB) return 1;

        if(a.index < b.index) return -1;

        if(a.index > b.index) return 1;

        return 0;
    }

    public resetFigure(figure: string): void
    {
        if(!this.analyzeFigure()) return;

        this.update();
    }

    public get disposed(): boolean
    {
        return this._disposed;
    }

    public get id(): number
    {
        if(!this._partSet) return -1;

        return this._partSet.id;
    }

    public get partSet(): IFigurePartSet
    {
        return this._partSet;
    }

    public set colors(partColors: IPartColor[])
    {
        this._colors = partColors;

        this.update();
    }

    public get isDisabledForWearing(): boolean
    {
        return this._isDisabledForWearing;
    }

    public set iconImage(k: Container)
    {
        this._thumbContainer = k;

        this.update();
    }

    public get imageUrl(): string
    {
        return this._imageUrl;
    }

    public get colorLayerCount(): number
    {
        return this._maxColorIndex;
    }

    public get isSelected(): boolean
    {
        return this._isSelected;
    }

    public set isSelected(flag: boolean)
    {
        this._isSelected = flag;
    }

    public get isHC(): boolean
    {
        return this._isHC;
    }

    public get isSellable(): boolean
    {
        return this._isSellable;
    }
}