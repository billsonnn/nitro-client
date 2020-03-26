import { RoomObjectMouseEvent } from '../../../../../room/events/RoomObjectMouseEvent';
import { RoomSpriteMouseEvent } from '../../../../../room/events/RoomSpriteMouseEvent';
import { RoomObjectUpdateMessage } from '../../../../../room/messages/RoomObjectUpdateMessage';
import { IRoomObjectModel } from '../../../../../room/object/IRoomObjectModel';
import { RoomObjectLogicBase } from '../../../../../room/object/logic/RoomObjectLogicBase';
import { IRoomGeometry } from '../../../../../room/utils/IRoomGeometry';
import { MouseEventType } from '../../../../ui/MouseEventType';
import { ObjectRoomMaskUpdateMessage } from '../../../messages/ObjectRoomMaskUpdateMessage';
import { ObjectRoomPlanePropertyUpdateMessage } from '../../../messages/ObjectRoomPlanePropertyUpdateMessage';
import { ObjectRoomPlaneVisibilityUpdateMessage } from '../../../messages/ObjectRoomPlaneVisibilityUpdateMessage';
import { ObjectRoomUpdateMessage } from '../../../messages/ObjectRoomUpdateMessage';
import { RoomMapData } from '../../RoomMapData';
import { RoomObjectVariable } from '../../RoomObjectVariable';
import { RoomPlaneParser } from '../../RoomPlaneParser';

export class RoomLogic extends RoomObjectLogicBase
{
    private _planeParser: RoomPlaneParser;

    constructor()
    {
        super();

        this._planeParser = new RoomPlaneParser();
    }

    public getEventTypes(): string[]
    {
        const types = [ RoomObjectMouseEvent.MOUSE_MOVE, RoomObjectMouseEvent.CLICK ];

        return this.mergeTypes(super.getEventTypes(), types);
    }

    public dispose(): void
    {
        super.dispose();

        if(this._planeParser)
        {
            this._planeParser.dispose();

            this._planeParser = null;
        }
    }

    public initialize(roomMap: RoomMapData): void
    {
        if(!roomMap || !this.object) return;

        if(!(roomMap instanceof RoomMapData)) return;
        
        if(!this._planeParser._Str_16659(roomMap)) return;

        this.object.model.setValue(RoomObjectVariable.ROOM_MAP_DATA, roomMap);
        this.object.model.setValue(RoomObjectVariable.ROOM_BACKGROUND_COLOR, 0xFFFFFF);
        this.object.model.setValue(RoomObjectVariable.ROOM_FLOOR_VISIBILITY, 1);
        this.object.model.setValue(RoomObjectVariable.ROOM_WALL_VISIBILITY, 1);
        this.object.model.setValue(RoomObjectVariable.ROOM_LANDSCAPE_VISIBILITY, 1);
    }

    public processUpdateMessage(message: RoomObjectUpdateMessage): void
    {
        if(!message || !this.object) return;

        const model = this.object.model;

        if(!model) return;

        if(message instanceof ObjectRoomUpdateMessage)
        {
            this.onObjectRoomUpdateMessage(message, model);

            return;
        }

        if(message instanceof ObjectRoomMaskUpdateMessage)
        {
            return;
        }

        if(message instanceof ObjectRoomPlaneVisibilityUpdateMessage)
        {
            this.onObjectRoomPlaneVisibilityUpdateMessage(message, model);

            return;
        }

        if(message instanceof ObjectRoomPlanePropertyUpdateMessage)
        {
            this.onObjectRoomPlanePropertyUpdateMessage(message, model);

            return;
        }
    }

    private onObjectRoomUpdateMessage(message: ObjectRoomUpdateMessage, model: IRoomObjectModel):void
    {
        switch (message.type)
        {
            case ObjectRoomUpdateMessage.ROOM_FLOOR_UPDATE:
                model.setValue(RoomObjectVariable.ROOM_FLOOR_TYPE, message.value);
                return;
            case ObjectRoomUpdateMessage.ROOM_WALL_UPDATE:
                model.setValue(RoomObjectVariable.ROOM_WALL_TYPE, message.value);
                return;
            case ObjectRoomUpdateMessage.ROOM_LANDSCAPE_UPDATE:
                model.setValue(RoomObjectVariable.ROOM_LANDSCAPE_TYPE, message.value);
                return;
        }
    }

    // private onObjectRoomMaskUpdateMessage(message: ObjectRoomMaskUpdateMessage, _arg_2: IRoomObjectModel): void
    // {
    //     var _local_5:String;
    //     var _local_6:XML;
    //     var _local_7:String;
    //     var _local_3:RoomPlaneBitmapMaskData;
    //     var _local_4:Boolean;
    //     switch (message.type)
    //     {
    //         case RoomObjectRoomMaskUpdateMessage.RORMUM_ADD_MASK:
    //             _local_5 = RoomPlaneBitmapMaskData.WINDOW;
    //             if (message._Str_24290 == RoomObjectRoomMaskUpdateMessage.HOLE)
    //             {
    //                 _local_5 = RoomPlaneBitmapMaskData.HOLE;
    //             }
    //             this._roomPlaneBitmapMaskParser.addMask(message._Str_20498, message._Str_25853, message._Str_22823, _local_5);
    //             _local_4 = true;
    //             break;
    //         case RoomObjectRoomMaskUpdateMessage._Str_10260:
    //             _local_4 = this._roomPlaneBitmapMaskParser._Str_23574(message._Str_20498);
    //             break;
    //     }
    //     if (_local_4)
    //     {
    //         _local_6 = this._roomPlaneBitmapMaskParser._Str_5598();
    //         _local_7 = _local_6.toXMLString();
    //         _arg_2.setString(RoomObjectVariableEnum.ROOM_PLANE_MASK_XML, _local_7);
    //     }
    // }

    private onObjectRoomPlaneVisibilityUpdateMessage(message: ObjectRoomPlaneVisibilityUpdateMessage, model: IRoomObjectModel): void
    {
        let visible = 0;

        if(message.visible) visible = 1;

        switch(message.type)
        {
            case ObjectRoomPlaneVisibilityUpdateMessage.FLOOR_VISIBILITY:
                model.setValue(RoomObjectVariable.ROOM_FLOOR_VISIBILITY, visible);
                return;
            case ObjectRoomPlaneVisibilityUpdateMessage.WALL_VISIBILITY:
                model.setValue(RoomObjectVariable.ROOM_WALL_VISIBILITY, visible);
                model.setValue(RoomObjectVariable.ROOM_LANDSCAPE_VISIBILITY, visible);
                return;
        }
    }

    private onObjectRoomPlanePropertyUpdateMessage(message: ObjectRoomPlanePropertyUpdateMessage, model: IRoomObjectModel): void
    {
        switch (message.type)
        {
            case ObjectRoomPlanePropertyUpdateMessage.FLOOR_THICKNESS:
                model.setValue(RoomObjectVariable.ROOM_FLOOR_THICKNESS, message.value);
                return;
            case ObjectRoomPlanePropertyUpdateMessage.WALL_THICKNESS:
                model.setValue(RoomObjectVariable.ROOM_WALL_THICKNESS, message.value);
                return;
        }
    }

    public mouseEvent(event: RoomSpriteMouseEvent, geometry: IRoomGeometry): void
    {
        if(!event || !geometry || !this.object) return;

        const tag = event._Str_4216;

        switch(event.type)
        {
            case MouseEventType.MOVE:
            case MouseEventType.OVER:
            case MouseEventType.CLICK:
                return;
        }
    }
}