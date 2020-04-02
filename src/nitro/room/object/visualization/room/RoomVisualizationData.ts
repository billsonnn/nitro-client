import { GraphicAssetCollection } from '../../../../../core/asset/GraphicAssetCollection';
import { IAssetData } from '../../../../../core/asset/interfaces';
import { Disposable } from '../../../../../core/common/disposable/Disposable';
import { IObjectVisualizationData } from '../../../../../room/object/visualization/IRoomObjectVisualizationData';
import { PlaneMaskManager } from './mask/PlaneMaskManager';
import { FloorRasterizer } from './rasterizer/basic/FloorRasterizer';
import { WallRasterizer } from './rasterizer/basic/WallRasterizer';

export class RoomVisualizationData extends Disposable implements IObjectVisualizationData
{
    private _wallRasterizer: WallRasterizer;
    private _floorRasterizer: FloorRasterizer;
    private _maskManager: PlaneMaskManager;
    private _initialized: boolean;

    constructor()
    {
        super();

        this._wallRasterizer    = new WallRasterizer();
        this._floorRasterizer   = new FloorRasterizer();
        this._maskManager       = new PlaneMaskManager();
        this._initialized       = false;
    }

    public initialize(asset: IAssetData): boolean
    {
        //@ts-ignore
        const wallData = asset.wallData;

        if(wallData) this._wallRasterizer.initialize(wallData);

        //@ts-ignore
        const floorData = asset.floorData;

        if(floorData) this._floorRasterizer.initialize(floorData);

        //@ts-ignore
        const maskData = asset.maskData;

        if(maskData) this._maskManager.initialize(maskData);

        return true;
    }

    protected onDispose(): void
    {
        if(this._wallRasterizer)
        {
            this._wallRasterizer.dispose();

            this._wallRasterizer = null;
        }

        if(this._floorRasterizer)
        {
            this._floorRasterizer.dispose();

            this._floorRasterizer = null;
        }

        if(this._maskManager)
        {
            this._maskManager.dispose();

            this._maskManager = null;
        }

        super.onDispose();
    }

    public setGraphicAssetCollection(collection: GraphicAssetCollection): void
    {
        if(this._initialized) return;

        this._wallRasterizer._Str_6703(collection);
        this._floorRasterizer._Str_6703(collection);
        this._maskManager._Str_6703(collection);

        this._initialized = true;
    }

    public _Str_3355(): void
    {
        if(this._wallRasterizer) this._wallRasterizer._Str_3355();

        if(this._floorRasterizer) this._floorRasterizer._Str_3355();
    }

    public get wallRasterizer(): WallRasterizer
    {
        return this._wallRasterizer;
    }

    public get floorRasterizer(): FloorRasterizer
    {
        return this._floorRasterizer;
    }

    public get maskManager(): PlaneMaskManager
    {
        return this._maskManager;
    }
}