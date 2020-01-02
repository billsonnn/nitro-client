import { Disposable } from '../../core/common/disposable/Disposable';
import { IConnection } from '../../core/communication/connections/IConnection';
import { IRoomInstance } from '../../room/IRoomInstance';
import { IRoomObjectController } from '../../room/object/IRoomObjectController';
import { Position } from '../../room/utils/Position';
import { FurnitureFloorAddEvent } from '../communication/messages/incoming/room/furniture/floor/FurnitureFloorAddEvent';
import { FurnitureFloorEvent } from '../communication/messages/incoming/room/furniture/floor/FurnitureFloorEvent';
import { FurnitureFloorRemoveEvent } from '../communication/messages/incoming/room/furniture/floor/FurnitureFloorRemoveEvent';
import { FurnitureFloorUpdateEvent } from '../communication/messages/incoming/room/furniture/floor/FurnitureFloorUpdateEvent';
import { FurnitureStateEvent } from '../communication/messages/incoming/room/furniture/FurnitureStateEvent';
import { RoomModelEvent } from '../communication/messages/incoming/room/mapping/RoomModelEvent';
import { RoomModelNameEvent } from '../communication/messages/incoming/room/mapping/RoomModelNameEvent';
import { RoomRollingEvent } from '../communication/messages/incoming/room/RoomRollingEvent';
import { RoomUnitTypingEvent } from '../communication/messages/incoming/room/unit/chat/RoomUnitTypingEvent';
import { RoomUnitDanceEvent } from '../communication/messages/incoming/room/unit/RoomUnitDanceEvent';
import { RoomUnitEffectEvent } from '../communication/messages/incoming/room/unit/RoomUnitEffectEvent';
import { RoomUnitEvent } from '../communication/messages/incoming/room/unit/RoomUnitEvent';
import { RoomUnitExpressionEvent } from '../communication/messages/incoming/room/unit/RoomUnitExpressionEvent';
import { RoomUnitHandItemEvent } from '../communication/messages/incoming/room/unit/RoomUnitHandItemEvent';
import { RoomUnitIdleEvent } from '../communication/messages/incoming/room/unit/RoomUnitIdleEvent';
import { RoomUnitRemoveEvent } from '../communication/messages/incoming/room/unit/RoomUnitRemoveEvent';
import { RoomUnitStatusEvent } from '../communication/messages/incoming/room/unit/RoomUnitStatusEvent';
import { UserInfoEvent } from '../communication/messages/incoming/user/data/UserInfoEvent';
import { RoomModel2Composer } from '../communication/messages/outgoing/room/mapping/RoomModel2Composer';
import { RoomModelComposer } from '../communication/messages/outgoing/room/mapping/RoomModelComposer';
import { FurnitureFloorDataParser } from '../communication/messages/parser/room/furniture/floor/FurnitureFloorDataParser';
import { IRoomCreator } from './IRoomCreator';
import { RoomObjectCategory } from './object/RoomObjectCategory';
import { RoomObjectModelKey } from './object/RoomObjectModelKey';
import { FurnitureQueueTileVisualization } from './object/visualization/furniture/FurnitureQueueTileVisualization';

export class RoomMessageHandler extends Disposable
{
    private _connection: IConnection;
    private _roomCreator: IRoomCreator;

    private _currentRoomId: number;
    private _ownUserId: number;
    private _initialConnection: boolean;

    constructor(roomCreator: IRoomCreator)
    {
        super();

        this._connection        = null;
        this._roomCreator       = roomCreator;

        this._currentRoomId     = 0;
        this._ownUserId         = 0;
        this._initialConnection = true;
    }

    protected onDispose(): void
    {
        super.onDispose();
    }

    public setConnection(connection: IConnection)
    {
        if(this._connection || !connection) return;

        this._connection = connection;

        this._connection.addMessageEvent(new UserInfoEvent(this.onUserInfoEvent.bind(this)));
        this._connection.addMessageEvent(new RoomModelNameEvent(this.onRoomModelNameEvent.bind(this)));
        this._connection.addMessageEvent(new RoomModelEvent(this.onRoomModelEvent.bind(this)));
        this._connection.addMessageEvent(new RoomRollingEvent(this.onRoomRollingEvent.bind(this)));
        this._connection.addMessageEvent(new FurnitureFloorAddEvent(this.onFurnitureFloorAddEvent.bind(this)));
        this._connection.addMessageEvent(new FurnitureFloorEvent(this.onFurnitureFloorEvent.bind(this)));
        this._connection.addMessageEvent(new FurnitureFloorRemoveEvent(this.onFurnitureFloorRemoveEvent.bind(this)));
        this._connection.addMessageEvent(new FurnitureFloorUpdateEvent(this.onFurnitureFloorUpdateEvent.bind(this)));
        this._connection.addMessageEvent(new FurnitureStateEvent(this.onFurnitureStateEvent.bind(this)));
        this._connection.addMessageEvent(new RoomUnitDanceEvent(this.onRoomUnitDanceEvent.bind(this)));
        this._connection.addMessageEvent(new RoomUnitEffectEvent(this.onRoomUnitEffectEvent.bind(this)));
        this._connection.addMessageEvent(new RoomUnitEvent(this.onRoomUnitEvent.bind(this)));
        this._connection.addMessageEvent(new RoomUnitExpressionEvent(this.onRoomUnitExpressionEvent.bind(this)));
        this._connection.addMessageEvent(new RoomUnitHandItemEvent(this.onRoomUnitHandItemEvent.bind(this)));
        this._connection.addMessageEvent(new RoomUnitIdleEvent(this.onRoomUnitIdleEvent.bind(this)));
        this._connection.addMessageEvent(new RoomUnitRemoveEvent(this.onRoomUnitRemoveEvent.bind(this)));
        this._connection.addMessageEvent(new RoomUnitStatusEvent(this.onRoomUnitStatusEvent.bind(this)));
        this._connection.addMessageEvent(new RoomUnitTypingEvent(this.onRoomUnitTypingEvent.bind(this)));
    }

    public setRoomId(id: number): void
    {
        if(this._currentRoomId)
        {
            if(this._roomCreator) this._roomCreator.destroyRoom(this._currentRoomId);
        }

        this._currentRoomId = id;
    }

    public clearRoomId(): void
    {
        this._currentRoomId = 0;
    }

    private onUserInfoEvent(event: UserInfoEvent): void
    {
        if(!(event instanceof UserInfoEvent) || !event.connection) return;

        this._ownUserId = event.getParser().userInfo.userId;
    }

    private onRoomModelNameEvent(event: RoomModelNameEvent): void
    {
        if(!(event instanceof RoomModelNameEvent) || !event.connection) return;

        if(this._currentRoomId !== event.getParser().roomId)
        {
            this.setRoomId(event.getParser().roomId);
        }

        if(this._roomCreator)
        {
            this._roomCreator.setRoomInstanceModelName(event.getParser().roomId, event.getParser().name);
        }

        if(this._initialConnection)
        {
            event.connection.send(new RoomModelComposer());

            this._initialConnection = false;

            return;
        }

        event.connection.send(new RoomModel2Composer());
    }

    private onRoomModelEvent(event: RoomModelEvent): void
    {
        if(!(event instanceof RoomModelEvent) || !event.connection || !this._roomCreator) return;

        const instance = this._roomCreator.createRoomInstance(this._currentRoomId);

        if(!instance) return;

        this._roomCreator.initializeRoomInstance(instance.id, event.getParser());
    }

    private onRoomRollingEvent(event: RoomRollingEvent): void
    {
        if(!(event instanceof RoomRollingEvent) || !event.connection || !this._roomCreator) return;

        this._roomCreator.updateRoomFurnitureObject(this._currentRoomId, event.getParser().rollerId, null, null, FurnitureQueueTileVisualization.ROLL_ANIMATION_STATE);
    }

    private createFloorFurnitureFromParser(instance: IRoomInstance, parser: FurnitureFloorDataParser): IRoomObjectController
    {
        if(!instance || !parser || !this._roomCreator) return null;

        const data = this._roomCreator.roomSession.sessionData.getFloorItemData(parser.spriteId);

        if(!data) return null;

        const object = instance.createObject(parser.itemId, data.className, RoomObjectCategory.FURNITURE);

        if(!object) return null;

        object.setPosition(new Position(parser.x, parser.y, parser.z, parser.direction));

        object.model.setValue(RoomObjectModelKey.FURNITURE_COLOR, data.colorId);

        const objectData = parser.data;

        if(objectData)
        {
            object.setState(objectData.state);

            objectData.writeRoomObjectModel(object.model);
        }
        
        return object;
    }

    private onFurnitureFloorAddEvent(event: FurnitureFloorAddEvent): void
    {
        if(!(event instanceof FurnitureFloorAddEvent) || !event.connection || !this._roomCreator) return;

        const item = event.getParser().item;

        if(!item) return;

        const instance = this._roomCreator.getRoomInstance(this._currentRoomId);

        if(!instance) return;

        this._roomCreator.addRoomObjects(this.createFloorFurnitureFromParser(instance, item));
    }

    private onFurnitureFloorEvent(event: FurnitureFloorEvent): void
    {
        if(!(event instanceof FurnitureFloorEvent) || !event.connection || !this._roomCreator) return;

        const items = event.getParser().items;

        if(!items || !items.length) return;

        const instance = this._roomCreator.getRoomInstance(this._currentRoomId);

        if(!instance) return;

        const objects: IRoomObjectController[] = [];

        for(let item of items)
        {
            if(!item) continue;

            const object = this.createFloorFurnitureFromParser(instance, item);

            if(!object) continue;

            objects.push(object);
        }

        if(!objects || !objects.length) return;

        this._roomCreator.addRoomObjects(...objects);
    }

    private onFurnitureFloorRemoveEvent(event: FurnitureFloorRemoveEvent): void
    {
        if(!(event instanceof FurnitureFloorRemoveEvent) || !event.connection || !this._roomCreator) return;

        this._roomCreator.removeRoomFurnitureObject(this._currentRoomId, event.getParser().itemId);
    }

    private onFurnitureFloorUpdateEvent(event: FurnitureFloorUpdateEvent): void
    {
        if(!(event instanceof FurnitureFloorUpdateEvent) || !event.connection || !this._roomCreator) return;

        const item = event.getParser().item;

        if(!item) return;

        this._roomCreator.updateRoomFurnitureObject(this._currentRoomId, item.itemId, null, new Position(item.x, item.y, item.z, item.direction), item.data.state, item.data);
    }

    private onFurnitureStateEvent(event: FurnitureStateEvent): void
    {
        if(!(event instanceof FurnitureStateEvent) || !event.connection || !this._roomCreator) return;

        this._roomCreator.updateRoomFurnitureObject(this._currentRoomId, event.getParser().itemId, null, null, event.getParser().state);
    }

    private onRoomUnitDanceEvent(event: RoomUnitDanceEvent): void
    {
        if(!(event instanceof RoomUnitDanceEvent) || !event.connection || !this._roomCreator) return;

        this._roomCreator.updateRoomUnitAction(this._currentRoomId, event.getParser().unitId, RoomObjectModelKey.FIGURE_DANCE, event.getParser().danceId);
    }

    private onRoomUnitEffectEvent(event: RoomUnitEffectEvent): void
    {
        if(!(event instanceof RoomUnitEffectEvent) || !event.connection || !this._roomCreator) return;

        this._roomCreator.updateRoomUnitEffect(this._currentRoomId, event.getParser().unitId, event.getParser().effectId, event.getParser().delay);
    }

    private onRoomUnitEvent(event: RoomUnitEvent): void
    {
        if(!(event instanceof RoomUnitEvent) || !event.connection || !this._roomCreator) return;

        const units = event.getParser().units;

        if(!units || !units.length) return;

        for(let unit of units)
        {
            if(!unit) continue;

            const position  = new Position(unit.x, unit.y, unit.z, unit.direction);

            this._roomCreator.addRoomUnit(this._currentRoomId, unit.unitId, position, unit.type, unit.figure);
        }
    }

    private onRoomUnitExpressionEvent(event: RoomUnitExpressionEvent): void
    {
        if(!(event instanceof RoomUnitExpressionEvent) || !event.connection || !this._roomCreator) return;

        this._roomCreator.updateRoomUnitAction(this._currentRoomId, event.getParser().unitId, RoomObjectModelKey.FIGURE_EXPRESSION, event.getParser().expression);
    }

    private onRoomUnitHandItemEvent(event: RoomUnitHandItemEvent): void
    {
        if(!(event instanceof RoomUnitHandItemEvent) || !event.connection || !this._roomCreator) return;

        this._roomCreator.updateRoomUnitAction(this._currentRoomId, event.getParser().unitId, RoomObjectModelKey.FIGURE_CARRY_OBJECT, event.getParser().handId);
    }

    private onRoomUnitIdleEvent(event: RoomUnitIdleEvent): void
    {
        if(!(event instanceof RoomUnitIdleEvent) || !event.connection || !this._roomCreator) return;

        this._roomCreator.updateRoomUnitAction(this._currentRoomId, event.getParser().unitId, RoomObjectModelKey.FIGURE_SLEEP, (event.getParser().isIdle ? 1 : 0));
    }

    private onRoomUnitRemoveEvent(event: RoomUnitRemoveEvent): void
    {
        if(!(event instanceof RoomUnitRemoveEvent) || !event.connection || !this._roomCreator) return;

        this._roomCreator.removeRoomUnitObject(this._currentRoomId, event.getParser().unitId);
    }

    private onRoomUnitStatusEvent(event: RoomUnitStatusEvent): void
    {
        if(!(event instanceof RoomUnitStatusEvent) || !event.connection || !this._roomCreator) return;

        const statuses = event.getParser().statuses;

        if(!statuses || !statuses.length) return;

        for(let status of statuses)
        {
            if(!status) continue;

            const position = new Position(status.x, status.y, status.z, status.direction);

            let goal: Position = null;

            if(status.didMove)
            {
                goal = position.copy();

                goal.x = status.targetX;
                goal.y = status.targetY;
                goal.z = status.targetZ;
            }

            this._roomCreator.updateRoomUnitLocation(this._currentRoomId, status.id, position, goal, status.isSlide, status.headDirection);

            this._roomCreator.updateRoomUnitFlatControl(this._currentRoomId, status.id, null);

            let isPosture       = true;
            let postureUpdate   = false;
            let postureType     = RoomObjectModelKey.STD;
            let parameter       = '';

            if(status.actions && status.actions.length)
            {
                for(let action of status.actions)
                {
                    if(!action) continue;

                    switch(action.action)
                    {
                        case 'flatctrl':
                            this._roomCreator.updateRoomUnitFlatControl(this._currentRoomId, status.id, action.value);
                            break;
                        case 'sign':
                            if(status.actions.length === 1) isPosture = false;

                            this._roomCreator.updateRoomUnitAction(this._currentRoomId, status.id, RoomObjectModelKey.FIGURE_SIGN, parseInt(action.value));
                            break;
                        case 'gst':
                            if(status.actions.length === 1) isPosture = false;

                            break;
                        case 'wav':
                        case 'mv':
                            postureUpdate   = true;
                            postureType     = action.action;
                            parameter       = action.value;
                            break;
                        case 'trd': break;
                        default:
                            postureUpdate   = true;
                            postureType     = action.action;
                            parameter       = action.value;
                            break;
                    }

                    if(postureUpdate) this._roomCreator.updateRoomUnitPosture(this._currentRoomId, status.id, postureType, parameter);
                    else if(isPosture) this._roomCreator.updateRoomUnitPosture(this._currentRoomId, status.id, RoomObjectModelKey.STD, '');
                }
            }
        }
    }

    private onRoomUnitTypingEvent(event: RoomUnitTypingEvent): void
    {
        if(!(event instanceof RoomUnitTypingEvent) || !event.connection || !this._roomCreator) return;

        this._roomCreator.updateRoomUnitAction(this._currentRoomId, event.getParser().unitId, RoomObjectModelKey.FIGURE_IS_TYPING, event.getParser().isTyping ? 1 : 0);
    }

    public get currentRoomId(): number
    {
        return this._currentRoomId;
    }
}