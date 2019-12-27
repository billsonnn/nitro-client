import { INitroCommunicationManager } from 'nitro/communication/INitroCommunicationManager';
import { IRoomSessionManager } from 'nitro/session/IRoomSessionManager';
import { NitroManager } from '../../core/common/NitroManager';
import { IRoomInstance } from '../../room/IRoomInstance';
import { IRoomObjectLogicFactory } from '../../room/object/logic/IRoomObjectLogicFactory';
import { IRoomObjectVisualizationFactory } from '../../room/object/visualization/IRoomObjectVisualizationFactory';
import { IRoomRendererFactory } from '../../room/renderer/IRoomRendererFactory';
import { RoomRendererFactory } from '../../room/renderer/RoomRendererFactory';
import { RoomModelParser } from '../communication/messages/parser/room/mapping/RoomModelParser';
import { NitroInstance } from '../NitroInstance';
import { RoomSessionEvent } from '../session/events/RoomSessionEvent';
import { RoomEngineEvent } from './events/RoomEngineEvent';
import { IRoomCreator } from './IRoomCreator';
import { IRoomEngine } from './IRoomEngine';
import { ObjectLogicFactory } from './object/logic/ObjectLogicFactory';
import { RoomObjectCategory } from './object/RoomObjectCategory';
import { ObjectVisualizationFactory } from './object/visualization/ObjectVisualizationFactory';
import { RoomMessageHandler } from './RoomMessageHandler';
import { RoomInstanceData } from './utils/RoomInstanceData';

export class RoomEngine extends NitroManager implements IRoomEngine, IRoomCreator
{
    private static ROOM_OBJECT_ID: number       = -1;
    private static ROOM_OBJECT_TYPE: string     = 'room';

    private static CURSOR_OBJECT_ID: number     = -2;
    private static CURSOR_OBJECT_TYPE: string   = 'tile_cursor';

    private _communication: INitroCommunicationManager;
    private _roomSession: IRoomSessionManager;
    private _roomMessageHandler: RoomMessageHandler;

    private _roomInstanceData: Map<number, RoomInstanceData>;

    private _roomRendererFactory: IRoomRendererFactory;
    private _visualizationFactory: IRoomObjectVisualizationFactory;
    private _logicFactory: IRoomObjectLogicFactory;

    constructor(communication: INitroCommunicationManager, roomSession: IRoomSessionManager)
    {
        super();

        this._communication         = communication;
        this._roomSession           = roomSession;
        this._roomMessageHandler    = new RoomMessageHandler(this);

        this._roomInstanceData      = new Map();

        this._roomRendererFactory   = new RoomRendererFactory();
        this._visualizationFactory  = new ObjectVisualizationFactory();
        this._logicFactory          = new ObjectLogicFactory();
    }

    protected onInit(): void
    {
        this._roomMessageHandler.setConnection(this._communication.connection);

        this._roomSession.events.addEventListener(RoomSessionEvent.STARTED, this.onRoomSessionEvent.bind(this));
        this._roomSession.events.addEventListener(RoomSessionEvent.ENDED, this.onRoomSessionEvent.bind(this));
    }

    protected onDispose(): void
    {
        this._roomSession.events.removeEventListener(RoomSessionEvent.STARTED, this.onRoomSessionEvent.bind(this));
        this._roomSession.events.removeEventListener(RoomSessionEvent.ENDED, this.onRoomSessionEvent.bind(this));
        
        super.onDispose();
    }

    private onRoomSessionEvent(event: RoomSessionEvent): void
    {
        if(!(event instanceof RoomSessionEvent)) return;

        switch(event.type)
        {
            case RoomSessionEvent.STARTED:
                if(this._roomMessageHandler) this._roomMessageHandler.setRoomId(event.session.roomId);
                return;
            case RoomSessionEvent.ENDED:
                if(this._roomMessageHandler)
                {
                    this._roomMessageHandler.clearRoomId();
                    this.removeRoomInstance(event.session.roomId);
                }
                return;
        }
    }

    public destroyRoom(roomId: number): void
    {
        this.removeRoomInstance(roomId);
    }

    public getRoomInstance(roomId: number): IRoomInstance
    {
        if(!this._roomSession || !this._roomSession.roomManager) return;

        return this._roomSession.roomManager.getRoomInstance(roomId);
    }

    private getRoomInstanceData(roomId: number): RoomInstanceData
    {
        const existing = this._roomInstanceData.get(roomId);

        if(existing) return existing;

        const data = new RoomInstanceData(roomId);

        this._roomInstanceData.set(data.roomId, data);

        return data;
    }

    public removeRoomInstance(roomId: number): void
    {
        const instance = this.getRoomInstance(roomId);

        if(instance)
        {
            if(instance.renderer) NitroInstance.instance.renderer.camera.removeChild(instance.renderer);

            this._roomSession.roomManager.removeRoomInstance(roomId);
        }

        const existing = this._roomInstanceData.get(roomId);

        if(!existing) return;

        this._roomInstanceData.delete(existing.roomId);

        existing.dispose();

        this.events.dispatchEvent(new RoomEngineEvent(RoomEngineEvent.DISPOSED, roomId));
    }

    public createRoomInstance(roomId: number): IRoomInstance
    {
        if(!this.isLoaded)
        {
            console.log('Room Engine not initilized yet, can not create room. Room data stored for later initialization.');

            return;
        }

        const instance = this.setupRoomInstance(roomId);

        if(!instance) return;

        this.events.dispatchEvent(new RoomEngineEvent(RoomEngineEvent.INITIALIZED, roomId));

        return instance;
    }

    private setupRoomInstance(roomId: number): IRoomInstance
    {
        if(!this.isLoaded) return;

        const instance = this._roomSession.roomManager.createRoomInstance(roomId);

        if(!instance) return null;

        const renderer = this._roomRendererFactory.createRenderer();

        if(!renderer) return;

        instance.setRenderer(renderer);

        if(instance.renderer) NitroInstance.instance.renderer.camera.addChild(instance.renderer);

        return instance;
    }

    public initializeRoomInstance(roomId: number, model: RoomModelParser): void
    {
        const instance = this.getRoomInstance(roomId);

        if(!instance) return;

        if(model)
        {
            const object = instance.createObject(RoomEngine.ROOM_OBJECT_ID, RoomEngine.ROOM_OBJECT_TYPE, RoomObjectCategory.ROOM);

            object.setRoom(instance);

            this._roomSession.roomManager.initalizeObject(object, model);
        }

        const tileCursor = instance.createObject(RoomEngine.CURSOR_OBJECT_ID, RoomEngine.CURSOR_OBJECT_TYPE, RoomObjectCategory.ROOM);

        tileCursor.setRoom(instance);

        this._roomSession.roomManager.initalizeObject(tileCursor); 
    }

    public get roomSession(): IRoomSessionManager
    {
        return this._roomSession;
    }

    public get roomRendererFactory(): IRoomRendererFactory
    {
        return this._roomRendererFactory;
    }

    public get visualizationFactory(): IRoomObjectVisualizationFactory
    {
        return this._visualizationFactory;
    }

    public get logicFactory(): IRoomObjectLogicFactory
    {
        return this._logicFactory;
    }
}