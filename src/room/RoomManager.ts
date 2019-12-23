import { IAssetData } from '../core/asset/interfaces/IAssetData';
import { NitroManager } from '../core/common/NitroManager';
import { NitroInstance } from '../nitro/NitroInstance';
import { IRoomEngine } from '../nitro/room/IRoomEngine';
import { IRoomInstance } from './IRoomInstance';
import { IRoomInstanceContainer } from './IRoomInstanceContainer';
import { IRoomManager } from './IRoomManager';
import { IRoomObjectManager } from './IRoomObjectManager';
import { IRoomObjectController } from './object/IRoomObjectController';
import { RoomInstance } from './RoomInstance';
import { RoomObjectManager } from './RoomObjectManager';

export class RoomManager extends NitroManager implements IRoomManager, IRoomInstanceContainer
{
    private _rooms: Map<number, IRoomInstance>;

    private _roomEngine: IRoomEngine;

    constructor(roomEngine: IRoomEngine)
    {
        super();

        this._rooms         = new Map();

        this._roomEngine    = roomEngine;
    }

    protected onDispose(): void
    {
        return;
    }

    public getRoomInstance(roomId: number): IRoomInstance
    {
        const existing = this._rooms.get(roomId);

        if(!existing) return null;

        return existing;
    }

    public createRoomInstance(roomId: number): IRoomInstance
    {
        if(this._rooms.get(roomId)) return null;

        const instance = new RoomInstance(roomId, this);

        this._rooms.set(instance.id, instance);

        return instance;
    }

    public removeRoomInstance(roomId: number): boolean
    {
        const existing = this._rooms.get(roomId);

        if(!existing) return false;

        this._rooms.delete(roomId);

        existing.dispose();

        return true;
    }

    public initalizeObject(object: IRoomObjectController): IRoomObjectController
    {
        if(object.isReady) return object;
        
        let visualization: string   = object.type;
        let logic: string           = object.type;
        let assetName: string       = object.type;

        // if(RoomObjectType.AVATAR_TYPES.indexOf(object.type) >= 0)
        // {
        //     if(object.type === RoomObjectType.PET)
        //     {
        //         const petType = object.model.getValue(RoomObjectModelKey.PET_TYPE);

        //         if(petType >= 0) assetName = NitroConfiguration.PET_TYPES[petType];
        //     }
        // }
        // else assetName = object.type;

        let asset: IAssetData = null;

        if(assetName)
        {
            asset = NitroInstance.instance.core.asset.getAsset(assetName);

            if(asset)
            {
                visualization   = asset.visualizationType;
                logic           = asset.logicType;
            }
        }

        const visualInstance    = this._roomEngine.visualizationFactory.getVisualization(visualization);
        const logicInstance     = this._roomEngine.logicFactory.getLogic(logic);

        object.setVisualization(visualInstance);
        object.setLogic(logicInstance);

        if(visualInstance)
        {
            const data = this._roomEngine.visualizationFactory.getVisualizationData(assetName, visualization, asset);

            if(!data || !visualInstance.initialize(data))
            {
                object.dispose();

                return null;
            }
        }

        if(logicInstance) logicInstance.initialize(asset);

        object.isReady = true;

        return object;
    }

    public createRoomObjectManager(): IRoomObjectManager
    {
        return new RoomObjectManager();
    }
}