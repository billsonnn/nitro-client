import { Disposable } from '../../core/common/disposable/Disposable';
import { IConnection } from '../../core/communication/connections/IConnection';
import { NitroConfiguration } from '../../NitroConfiguration';
import { IVector3D } from '../../room/utils/IVector3D';
import { Vector3d } from '../../room/utils/Vector3d';
import { FurnitureFloorAddEvent } from '../communication/messages/incoming/room/furniture/floor/FurnitureFloorAddEvent';
import { FurnitureFloorEvent } from '../communication/messages/incoming/room/furniture/floor/FurnitureFloorEvent';
import { FurnitureFloorRemoveEvent } from '../communication/messages/incoming/room/furniture/floor/FurnitureFloorRemoveEvent';
import { FurnitureFloorUpdateEvent } from '../communication/messages/incoming/room/furniture/floor/FurnitureFloorUpdateEvent';
import { FurnitureStateEvent } from '../communication/messages/incoming/room/furniture/FurnitureStateEvent';
import { FurnitureWallAddEvent } from '../communication/messages/incoming/room/furniture/wall/FurnitureWallAddEvent';
import { FurnitureWallEvent } from '../communication/messages/incoming/room/furniture/wall/FurnitureWallEvent';
import { FurnitureWallRemoveEvent } from '../communication/messages/incoming/room/furniture/wall/FurnitureWallRemoveEvent';
import { FurnitureWallUpdateEvent } from '../communication/messages/incoming/room/furniture/wall/FurnitureWallUpdateEvent';
import { RoomDoorEvent } from '../communication/messages/incoming/room/mapping/RoomDoorEvent';
import { RoomHeightMapEvent } from '../communication/messages/incoming/room/mapping/RoomHeightMapEvent';
import { RoomHeightMapUpdateEvent } from '../communication/messages/incoming/room/mapping/RoomHeightMapUpdateEvent';
import { RoomModelEvent } from '../communication/messages/incoming/room/mapping/RoomModelEvent';
import { RoomModelNameEvent } from '../communication/messages/incoming/room/mapping/RoomModelNameEvent';
import { RoomPaintEvent } from '../communication/messages/incoming/room/mapping/RoomPaintEvent';
import { RoomThicknessEvent } from '../communication/messages/incoming/room/mapping/RoomThicknessEvent';
import { RoomRollingEvent } from '../communication/messages/incoming/room/RoomRollingEvent';
import { RoomUnitChatEvent } from '../communication/messages/incoming/room/unit/chat/RoomUnitChatEvent';
import { RoomUnitChatShoutEvent } from '../communication/messages/incoming/room/unit/chat/RoomUnitChatShoutEvent';
import { RoomUnitChatWhisperEvent } from '../communication/messages/incoming/room/unit/chat/RoomUnitChatWhisperEvent';
import { RoomUnitTypingEvent } from '../communication/messages/incoming/room/unit/chat/RoomUnitTypingEvent';
import { RoomUnitDanceEvent } from '../communication/messages/incoming/room/unit/RoomUnitDanceEvent';
import { RoomUnitEffectEvent } from '../communication/messages/incoming/room/unit/RoomUnitEffectEvent';
import { RoomUnitEvent } from '../communication/messages/incoming/room/unit/RoomUnitEvent';
import { RoomUnitExpressionEvent } from '../communication/messages/incoming/room/unit/RoomUnitExpressionEvent';
import { RoomUnitHandItemEvent } from '../communication/messages/incoming/room/unit/RoomUnitHandItemEvent';
import { RoomUnitIdleEvent } from '../communication/messages/incoming/room/unit/RoomUnitIdleEvent';
import { RoomUnitInfoEvent } from '../communication/messages/incoming/room/unit/RoomUnitInfoEvent';
import { RoomUnitRemoveEvent } from '../communication/messages/incoming/room/unit/RoomUnitRemoveEvent';
import { RoomUnitStatusEvent } from '../communication/messages/incoming/room/unit/RoomUnitStatusEvent';
import { UserInfoEvent } from '../communication/messages/incoming/user/data/UserInfoEvent';
import { RoomModel2Composer } from '../communication/messages/outgoing/room/mapping/RoomModel2Composer';
import { RoomModelComposer } from '../communication/messages/outgoing/room/mapping/RoomModelComposer';
import { FurnitureFloorDataParser } from '../communication/messages/parser/room/furniture/floor/FurnitureFloorDataParser';
import { FurnitureWallDataParser } from '../communication/messages/parser/room/furniture/wall/FurnitureWallDataParser';
import { RoomDoorParser } from '../communication/messages/parser/room/mapping/RoomDoorParser';
import { IRoomCreator } from './IRoomCreator';
import { LegacyDataType } from './object/data/type/LegacyDataType';
import { RoomObjectUserType } from './object/RoomObjectUserType';
import { RoomObjectVariable } from './object/RoomObjectVariable';
import { RoomPlaneParser } from './object/RoomPlaneParser';
import { FurnitureQueueTileVisualization } from './object/visualization/furniture/FurnitureQueueTileVisualization';
import { RoomVariableEnum } from './RoomVariableEnum';
import { FurnitureStackingHeightMap } from './utils/FurnitureStackingHeightMap';
import { ObjectRolling } from './utils/ObjectRolling';

export class RoomMessageHandler extends Disposable
{
    private _connection: IConnection;
    private _roomCreator: IRoomCreator;
    private _planeParser: RoomPlaneParser;
    private _latestEntryTileEvent: RoomDoorEvent;

    private _currentRoomId: number;
    private _ownUserId: number;
    private _initialConnection: boolean;

    constructor(roomCreator: IRoomCreator)
    {
        super();

        this._connection            = null;
        this._roomCreator           = roomCreator;
        this._planeParser           = new RoomPlaneParser();
        this._latestEntryTileEvent  = null;

        this._currentRoomId     = 0;
        this._ownUserId         = 0;
        this._initialConnection = true;
    }

    protected onDispose(): void
    {
        super.onDispose();

        this._connection            = null;
        this._roomCreator           = null;
        this._latestEntryTileEvent  = null;

        if(this._planeParser)
        {
            this._planeParser.dispose();

            this._planeParser = null;
        }
    }

    public setConnection(connection: IConnection)
    {
        if(this._connection || !connection) return;

        this._connection = connection;

        this._connection.addMessageEvent(new UserInfoEvent(this.onUserInfoEvent.bind(this)));
        this._connection.addMessageEvent(new RoomModelNameEvent(this.onRoomModelNameEvent.bind(this)));
        this._connection.addMessageEvent(new RoomPaintEvent(this.onRoomPaintEvent.bind(this)));
        this._connection.addMessageEvent(new RoomModelEvent(this.onRoomModelEvent.bind(this)));
        this._connection.addMessageEvent(new RoomHeightMapEvent(this.onRoomHeightMapEvent.bind(this)));
        this._connection.addMessageEvent(new RoomHeightMapUpdateEvent(this.onRoomHeightMapUpdateEvent.bind(this)));
        this._connection.addMessageEvent(new RoomThicknessEvent(this.onRoomThicknessEvent.bind(this)));
        this._connection.addMessageEvent(new RoomDoorEvent(this.onRoomDoorEvent.bind(this)));
        this._connection.addMessageEvent(new RoomRollingEvent(this.onRoomRollingEvent.bind(this)));
        this._connection.addMessageEvent(new FurnitureFloorAddEvent(this.onFurnitureFloorAddEvent.bind(this)));
        this._connection.addMessageEvent(new FurnitureFloorEvent(this.onFurnitureFloorEvent.bind(this)));
        this._connection.addMessageEvent(new FurnitureFloorRemoveEvent(this.onFurnitureFloorRemoveEvent.bind(this)));
        this._connection.addMessageEvent(new FurnitureFloorUpdateEvent(this.onFurnitureFloorUpdateEvent.bind(this)));
        this._connection.addMessageEvent(new FurnitureWallAddEvent(this.onFurnitureWallAddEvent.bind(this)));
        this._connection.addMessageEvent(new FurnitureWallEvent(this.onFurnitureWallEvent.bind(this)));
        this._connection.addMessageEvent(new FurnitureWallRemoveEvent(this.onFurnitureWallRemoveEvent.bind(this)));
        this._connection.addMessageEvent(new FurnitureWallUpdateEvent(this.onFurnitureWallUpdateEvent.bind(this)));
        this._connection.addMessageEvent(new FurnitureStateEvent(this.onFurnitureStateEvent.bind(this)));
        this._connection.addMessageEvent(new RoomUnitDanceEvent(this.onRoomUnitDanceEvent.bind(this)));
        this._connection.addMessageEvent(new RoomUnitEffectEvent(this.onRoomUnitEffectEvent.bind(this)));
        this._connection.addMessageEvent(new RoomUnitEvent(this.onRoomUnitEvent.bind(this)));
        this._connection.addMessageEvent(new RoomUnitExpressionEvent(this.onRoomUnitExpressionEvent.bind(this)));
        this._connection.addMessageEvent(new RoomUnitHandItemEvent(this.onRoomUnitHandItemEvent.bind(this)));
        this._connection.addMessageEvent(new RoomUnitIdleEvent(this.onRoomUnitIdleEvent.bind(this)));
        this._connection.addMessageEvent(new RoomUnitInfoEvent(this.onRoomUnitInfoEvent.bind(this)));
        this._connection.addMessageEvent(new RoomUnitRemoveEvent(this.onRoomUnitRemoveEvent.bind(this)));
        this._connection.addMessageEvent(new RoomUnitStatusEvent(this.onRoomUnitStatusEvent.bind(this)));
        this._connection.addMessageEvent(new RoomUnitChatEvent(this.onRoomUnitChatEvent.bind(this)));
        this._connection.addMessageEvent(new RoomUnitChatShoutEvent(this.onRoomUnitChatEvent.bind(this)));
        this._connection.addMessageEvent(new RoomUnitChatWhisperEvent(this.onRoomUnitChatEvent.bind(this)));
        this._connection.addMessageEvent(new RoomUnitTypingEvent(this.onRoomUnitTypingEvent.bind(this)));
    }

    public setRoomId(id: number): void
    {
        if(this._currentRoomId !== 0)
        {
            if(this._roomCreator) this._roomCreator.destroyRoom(this._currentRoomId);
        }

        this._currentRoomId         = id;
        this._latestEntryTileEvent  = null;
    }

    public clearRoomId(): void
    {
        this._currentRoomId         = 0;
        this._latestEntryTileEvent  = null;
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

    private onRoomPaintEvent(event: RoomPaintEvent): void
    {
        if(!(event instanceof RoomPaintEvent)) return;

        const parser = event.getParser();

        if(!parser) return;

        const floorType     = parser.floorType;
        const wallType      = parser.wallType;
        const landscapeType = parser.landscapeType;

        if(this._roomCreator)
        {
            this._roomCreator.updateRoomInstancePlaneType(this._currentRoomId, floorType, wallType, landscapeType);
        }
    }

    private onRoomModelEvent(event: RoomModelEvent): void
    {
        if(!(event instanceof RoomModelEvent) || !event.connection || !this._roomCreator) return;

        const parser = event.getParser();

        if(!parser) return;

        const wallGeometry = this._roomCreator.getLegacyWallGeometry(this._currentRoomId);

        if(!wallGeometry) return;

        this._planeParser.reset();

        const width     = parser.width;
        const height    = parser.height;

        this._planeParser._Str_13735(width, height);

        let entryTile: RoomDoorParser = null;

        if(this._latestEntryTileEvent) entryTile = this._latestEntryTileEvent.getParser();

        let doorX           = -1;
        let doorY           = -1;
        let doorZ           = 0;
        let doorDirection   = 0;

        let y = 0;

        while (y < height)
        {
            let x = 0;

            while (x < width)
            {
                const tileHeight = parser.getHeight(x, y);

                if(((((y > 0) && (y < (height - 1))) || ((x > 0) && (x < (width - 1)))) && (!(tileHeight == RoomPlaneParser._Str_3134))) && ((entryTile == null) || ((x == entryTile.x) && (y == entryTile.y))))
                {
                    if(((parser.getHeight(x, (y - 1)) == RoomPlaneParser._Str_3134) && (parser.getHeight((x - 1), y) == RoomPlaneParser._Str_3134)) && (parser.getHeight(x, (y + 1)) == RoomPlaneParser._Str_3134))
                    {
                        doorX           = (x + 0.5);
                        doorY           = y;
                        doorZ           = tileHeight;
                        doorDirection   = 90;
                    }

                    if(((parser.getHeight(x, (y - 1)) == RoomPlaneParser._Str_3134) && (parser.getHeight((x - 1), y) == RoomPlaneParser._Str_3134)) && (parser.getHeight((x + 1), y) == RoomPlaneParser._Str_3134))
                    {
                        doorX           = x;
                        doorY           = (y + 0.5);
                        doorZ           = tileHeight;
                        doorDirection   = 180;
                    }
                }

                this._planeParser._Str_3982(x, y, tileHeight);

                x++;
            }
            
            y++;
        }
        
        this._planeParser._Str_3982(Math.floor(doorX), Math.floor(doorY), doorZ);
        this._planeParser._Str_12919(parser.wallHeight);
        this._planeParser._Str_3982(Math.floor(doorX), Math.floor(doorY), (doorZ + this._planeParser.wallHeight));

        wallGeometry.scale = parser.scale;
        wallGeometry.initialize(width, height, this._planeParser._Str_7678);

        let heightIterator = (parser.height - 1);

        while(heightIterator >= 0)
        {
            let widthIterator = (parser.width - 1);

            while(widthIterator >= 0)
            {
                wallGeometry._Str_3982(widthIterator, heightIterator, this._planeParser._Str_2754(widthIterator, heightIterator));
                widthIterator--;
            }

            heightIterator--;
        }

        const roomMap = this._planeParser._Str_5598();

        roomMap.doors.push({
            x: doorX,
            y: doorY,
            z: doorZ,
            dir: doorDirection
        });

        this._roomCreator.createRoomInstance(this._currentRoomId, roomMap);
    }

    private onRoomHeightMapEvent(event: RoomHeightMapEvent): void
    {
        if(!(event instanceof RoomHeightMapEvent) || !event.connection || !this._roomCreator) return;

        const parser = event.getParser();

        if(!parser) return;

        const width     = parser.width;
        const height    = parser.height;
        const heightMap = new FurnitureStackingHeightMap(width, height);

        let y = 0;

        while(y < height)
        {
            let x = 0;

            while(x < width)
            {
                heightMap.setHeight(x, y, parser.getHeight(x, y));
                heightMap.setStackable(x, y, parser.isStackable(x, y));
                heightMap.setTile(x, y, parser.isTile(x, y));

                x++;
            }

            y++;
        }
        
        this._roomCreator.setFurnitureStackingHeightMap(this._currentRoomId, heightMap);
    }

    private onRoomHeightMapUpdateEvent(event: RoomHeightMapUpdateEvent): void
    {
        if(!(event instanceof RoomHeightMapUpdateEvent) || !event.connection || !this._roomCreator) return;

        const parser = event.getParser();

        if(!parser) return;

        const heightMap = this._roomCreator.getFurnitureStackingHeightMap(this._currentRoomId);

        if(!heightMap) return;

        while(parser.next())
        {
            heightMap.setHeight(parser.x, parser.y, parser.getHeight());
            heightMap.setStackable(parser.x, parser.y, parser.isStackable());
            heightMap.setTile(parser.x, parser.y, parser.isTile());
        }
    }

    private onRoomThicknessEvent(event: RoomThicknessEvent): void
    {
        if(!(event instanceof RoomThicknessEvent)) return;

        const parser = event.getParser();

        if(!parser) return;

        const visibleWall       = !parser.hideWalls;
        const visibleFloor      = true; 
        const thicknessWall     = parser.thicknessWall;
        const thicknessFloor    = parser.thicknessFloor;

        if(this._roomCreator)
        {
            this._roomCreator.updateRoomInstancePlaneVisibility(this._currentRoomId, visibleWall, visibleFloor);
            this._roomCreator.updateRoomInstancePlaneThickness(this._currentRoomId, thicknessWall, thicknessFloor);
        }
    }

    private onRoomDoorEvent(event: RoomDoorEvent): void
    {
        if(!(event instanceof RoomDoorEvent)) return;

        this._latestEntryTileEvent = event;
    }

    private onRoomRollingEvent(event: RoomRollingEvent): void
    {
        if(!(event instanceof RoomRollingEvent) || !event.connection || !this._roomCreator) return;

        if(event.getParser().rollerId)
        {
            this._roomCreator.updateRoomObjectFloor(this._currentRoomId, event.getParser().rollerId, null, null, FurnitureQueueTileVisualization.ROLL_ANIMATION_STATE, null);
        }

        const furnitureRolling = event.getParser().itemsRolling;

        if(furnitureRolling && furnitureRolling.length)
        {
            for(let rollData of furnitureRolling)
            {
                if(!rollData) continue;

                this._roomCreator.rollRoomObjectFloor(this._currentRoomId, rollData.id, rollData.location, rollData.targetLocation); 
            }
        }

        const unitRollData = event.getParser().unitRolling;

        if(unitRollData)
        {
            this._roomCreator.updateRoomObjectUserLocation(this._currentRoomId, unitRollData.id, unitRollData.location, unitRollData.targetLocation);

            if(!NitroConfiguration.ROLLING_OVERRIDES_POSTURE) return;

            const object = this._roomCreator.getRoomObjectUser(this._currentRoomId, unitRollData.id);

            if(object && object.type !== RoomObjectUserType.MONSTER_PLANT)
            {
                let posture: string = 'std';

                switch(unitRollData.movementType)
                {
                    case ObjectRolling.MOVE:
                        posture = 'mv';
                        break;
                    case ObjectRolling.SLIDE:
                        posture = 'std';
                        break;
                }
                
                this._roomCreator.updateRoomObjectUserPosture(this._currentRoomId, unitRollData.id, posture);
            }
        }
    }

    private onFurnitureFloorAddEvent(event: FurnitureFloorAddEvent): void
    {
        if(!(event instanceof FurnitureFloorAddEvent) || !event.connection || !this._roomCreator) return;

        const item = event.getParser().item;

        if(!item) return;

        this.addRoomObjectFurnitureFloor(this._currentRoomId, item);
    }

    private onFurnitureFloorEvent(event: FurnitureFloorEvent): void
    {
        if(!(event instanceof FurnitureFloorEvent) || !event.connection || !this._roomCreator) return;

        const parser = event.getParser();

        if(!parser) return;

        const totalObjects = parser.items.length;

        let iterator = 0;

        while(iterator < totalObjects)
        {
            const object = parser.items[iterator];

            if(object) this.addRoomObjectFurnitureFloor(this._currentRoomId, object);

            iterator++;
        }
    }

    private onFurnitureFloorRemoveEvent(event: FurnitureFloorRemoveEvent): void
    {
        if(!(event instanceof FurnitureFloorRemoveEvent) || !event.connection || !this._roomCreator) return;

        this._roomCreator.removeRoomObjectFloor(this._currentRoomId, event.getParser().itemId);
    }

    private onFurnitureFloorUpdateEvent(event: FurnitureFloorUpdateEvent): void
    {
        if(!(event instanceof FurnitureFloorUpdateEvent) || !event.connection || !this._roomCreator) return;

        const item = event.getParser().item;

        if(!item) return;

        const location: IVector3D   = new Vector3d(item.x, item.y, item.z);
        const direction: IVector3D  = new Vector3d(item.direction);

        this._roomCreator.updateRoomObjectFloor(this._currentRoomId, item.itemId, location, direction, item.data.state, item.data);
        this._roomCreator.updateRoomObjectFloorHeight(this._currentRoomId, item.itemId, item.stackHeight);
        this._roomCreator.updateRoomObjectFloorExpiration(this._currentRoomId, item.itemId, item.expires);
    }

    private onFurnitureWallAddEvent(event: FurnitureWallAddEvent): void
    {
        if(!(event instanceof FurnitureWallAddEvent) || !event.connection || !this._roomCreator) return;

        const data = event.getParser().item;

        if(!data) return;

        this.addRoomObjectFurnitureWall(this._currentRoomId, data);
    }

    private onFurnitureWallEvent(event: FurnitureWallEvent): void
    {
        if(!(event instanceof FurnitureWallEvent) || !event.connection || !this._roomCreator) return;

        const parser = event.getParser();

        if(!parser) return;

        const totalObjects = parser.items.length;

        let iterator = 0;

        while(iterator < totalObjects)
        {
            const data = parser.items[iterator];

            if(data) this.addRoomObjectFurnitureWall(this._currentRoomId, data);

            iterator++;
        }
    }

    private onFurnitureWallRemoveEvent(event: FurnitureWallRemoveEvent): void
    {
        if(!(event instanceof FurnitureWallRemoveEvent) || !event.connection || !this._roomCreator) return;

        this._roomCreator.removeRoomObjectWall(this._currentRoomId, event.getParser().itemId);
    }

    private onFurnitureWallUpdateEvent(event: FurnitureWallUpdateEvent): void
    {
        if(!(event instanceof FurnitureWallUpdateEvent) || !event.connection || !this._roomCreator) return;

        const wallGeometry = this._roomCreator.getLegacyWallGeometry(this._currentRoomId);

        if(!wallGeometry) return;

        const item = event.getParser().item;

        if(!item) return;

        const location  = wallGeometry.getLocation(item.width, item.height, item.localX, item.localY, item.direction);
        const direction = new Vector3d(wallGeometry.getDirection(item.direction));

        this._roomCreator.updateRoomObjectWall(this._currentRoomId, item.itemId, location, direction, item.state, item.stuffData);
        this._roomCreator.updateRoomObjectWallExpiration(this._currentRoomId, item.itemId, item.secondsToExpiration);
    }

    private onFurnitureStateEvent(event: FurnitureStateEvent): void
    {
        if(!(event instanceof FurnitureStateEvent) || !event.connection || !this._roomCreator) return;

        const data = new LegacyDataType();

        this._roomCreator.updateRoomObjectFloor(this._currentRoomId, event.getParser().itemId, null, null, event.getParser().state, data);
    }

    private onRoomUnitDanceEvent(event: RoomUnitDanceEvent): void
    {
        if(!(event instanceof RoomUnitDanceEvent) || !event.connection || !this._roomCreator) return;

        this._roomCreator.updateRoomObjectUserAction(this._currentRoomId, event.getParser().unitId, RoomObjectVariable.FIGURE_DANCE, event.getParser().danceId);
    }

    private onRoomUnitEffectEvent(event: RoomUnitEffectEvent): void
    {
        if(!(event instanceof RoomUnitEffectEvent) || !event.connection || !this._roomCreator) return;

        this._roomCreator.updateRoomObjectUserEffect(this._currentRoomId, event.getParser().unitId, event.getParser().effectId, event.getParser().delay);
    }

    private onRoomUnitEvent(event: RoomUnitEvent): void
    {
        if(!(event instanceof RoomUnitEvent) || !event.connection || !this._roomCreator) return;

        const units = event.getParser().units;

        if(!units || !units.length) return;

        for(let unit of units)
        {
            if(!unit) continue;

            const location  = new Vector3d(unit.x, unit.y, unit.z);
            const direction = new Vector3d(unit.direction);

            this._roomCreator.addRoomObjectUser(this._currentRoomId, unit.unitId, location, direction, unit.direction, unit.type, unit.figure);

            if(unit.id === this._ownUserId)
            {
                this._roomCreator.setRoomSessionOwnUser(this._currentRoomId, unit.unitId);
                this._roomCreator.updateRoomObjectUserOwn(this._currentRoomId, unit.unitId);
            }

            // breed, something
            this._roomCreator.updateRoomObjectUserFigure(this._currentRoomId, unit.unitId, unit.figure, unit.gender);

            if(RoomObjectUserType.getTypeString(unit.type) === RoomObjectUserType.PET)
            {
                // if (this._roomCreator._Str_18909(_local_5.figure) == PetTypeEnum.MONSTERPLANT)
                //     {
                //         this._roomCreator._Str_7176(this._currentRoomId, _local_5._Str_2707, _local_5._Str_16593);
                //     }
                // }
            }
        }
    }

    private onRoomUnitExpressionEvent(event: RoomUnitExpressionEvent): void
    {
        if(!(event instanceof RoomUnitExpressionEvent) || !event.connection || !this._roomCreator) return;

        this._roomCreator.updateRoomObjectUserAction(this._currentRoomId, event.getParser().unitId, RoomObjectVariable.FIGURE_EXPRESSION, event.getParser().expression);
    }

    private onRoomUnitHandItemEvent(event: RoomUnitHandItemEvent): void
    {
        if(!(event instanceof RoomUnitHandItemEvent) || !event.connection || !this._roomCreator) return;

        this._roomCreator.updateRoomObjectUserAction(this._currentRoomId, event.getParser().unitId, RoomObjectVariable.FIGURE_CARRY_OBJECT, event.getParser().handId);
    }

    private onRoomUnitIdleEvent(event: RoomUnitIdleEvent): void
    {
        if(!(event instanceof RoomUnitIdleEvent) || !event.connection || !this._roomCreator) return;

        this._roomCreator.updateRoomObjectUserAction(this._currentRoomId, event.getParser().unitId, RoomObjectVariable.FIGURE_SLEEP, (event.getParser().isIdle ? 1 : 0));
    }

    private onRoomUnitInfoEvent(event: RoomUnitInfoEvent): void
    {
        if(!(event instanceof RoomUnitInfoEvent) || !event.connection || !this._roomCreator) return;

        this._roomCreator.updateRoomObjectUserFigure(this._currentRoomId, event.getParser().unitId, event.getParser().figure, event.getParser().gender);
    }

    private onRoomUnitRemoveEvent(event: RoomUnitRemoveEvent): void
    {
        if(!(event instanceof RoomUnitRemoveEvent) || !event.connection || !this._roomCreator) return;

        this._roomCreator.removeRoomObjectUser(this._currentRoomId, event.getParser().unitId);
    }

    private onRoomUnitStatusEvent(event: RoomUnitStatusEvent): void
    {
        if(!(event instanceof RoomUnitStatusEvent) || !event.connection || !this._roomCreator) return;

        const statuses = event.getParser().statuses;

        if(!statuses || !statuses.length) return;

        const roomInstance = this._roomCreator.getRoomInstance(this._currentRoomId);

        if(!roomInstance) return;

        const zScale = roomInstance.model.getValue(RoomVariableEnum.ROOM_Z_SCALE) || 1;

        for(let status of statuses)
        {
            if(!status) continue;

            let height = status.height;

            if(height) height = (height / zScale);

            const location  = new Vector3d(status.x, status.y, (status.z + height));
            const direction = new Vector3d(status.direction);

            let goal: IVector3D = null;

            if(status.didMove) goal = new Vector3d(status.targetX, status.targetY, status.targetZ);

            this._roomCreator.updateRoomObjectUserLocation(this._currentRoomId, status.id, location, goal, status.canStandUp, height, direction, status.headDirection);
            this._roomCreator.updateRoomObjectUserFlatControl(this._currentRoomId, status.id, null);

            let isPosture       = true;
            let postureUpdate   = false;
            let postureType     = RoomObjectVariable.STD;
            let parameter       = '';

            if(status.actions && status.actions.length)
            {
                for(let action of status.actions)
                {
                    if(!action) continue;

                    switch(action.action)
                    {
                        case 'flatctrl':
                            this._roomCreator.updateRoomObjectUserFlatControl(this._currentRoomId, status.id, action.value);
                            break;
                        case 'sign':
                            if(status.actions.length === 1) isPosture = false;

                            this._roomCreator.updateRoomObjectUserAction(this._currentRoomId, status.id, RoomObjectVariable.FIGURE_SIGN, parseInt(action.value));
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
                }
            }

            if(postureUpdate) this._roomCreator.updateRoomObjectUserPosture(this._currentRoomId, status.id, postureType, parameter);
            else if(isPosture) this._roomCreator.updateRoomObjectUserPosture(this._currentRoomId, status.id, RoomObjectVariable.STD, '');
        }
    }

    private onRoomUnitChatEvent(event: RoomUnitChatEvent): void
    {
        if(!(event instanceof RoomUnitChatEvent) || !event.connection || !this._roomCreator) return;

        const parser = event.getParser();

        if(!parser) return;

        this._roomCreator.updateRoomObjectUserGesture(this._currentRoomId, parser.unitId, parser.gesture);
        this._roomCreator.updateRoomObjectUserAction(this._currentRoomId, parser.unitId, RoomObjectVariable.FIGURE_TALK, (parser.message.length / 10));
    }

    private onRoomUnitTypingEvent(event: RoomUnitTypingEvent): void
    {
        if(!(event instanceof RoomUnitTypingEvent) || !event.connection || !this._roomCreator) return;

        this._roomCreator.updateRoomObjectUserAction(this._currentRoomId, event.getParser().unitId, RoomObjectVariable.FIGURE_IS_TYPING, event.getParser().isTyping ? 1 : 0);
    }

    private addRoomObjectFurnitureFloor(roomId: number, data: FurnitureFloorDataParser): void
    {
        if(!data || !this._roomCreator) return;

        const location  = new Vector3d(data.x, data.y, data.z);
        const direction = new Vector3d(data.direction);

        this._roomCreator.addFurnitureFloor(roomId, data.itemId, data.spriteId, location, direction, data.state, data.data, NaN, data.expires, data.usagePolicy, data.userId, data.username, true, true, data.stackHeight);
    }

    private addRoomObjectFurnitureWall(roomId: number, data: FurnitureWallDataParser): void
    {
        if(!data || !this._roomCreator) return;

        const wallGeometry = this._roomCreator.getLegacyWallGeometry(roomId);

        if(!wallGeometry) return;

        let location: IVector3D = null;

        if(!data._Str_22379)
        {
            location = wallGeometry.getLocation(data.width, data.height, data.localX, data.localY, data.direction);
        }
        else
        {
            //location = wallGeometry._Str_24084(data.y, data.z, data.direction);
        }

        const direction = new Vector3d(wallGeometry.getDirection(data.direction));

        this._roomCreator.addFurnitureWall(roomId, data.itemId, data.spriteId, location, direction, data.state, data.stuffData, data.secondsToExpiration, data.usagePolicy, data.userId, data.username);
    }

    public get currentRoomId(): number
    {
        return this._currentRoomId;
    }
}