import { RoomEngine } from '../RoomEngine';
import { RoomObjectType } from './RoomObjectType';

export class RoomObjectCategory
{
    public static MINIMUM: number   = -1;
    public static ROOM: number      = 0;
    public static FURNITURE: number = 10;
    public static WALL: number      = 20;
    public static UNIT: number      = 100;

    public static getCategory(type: string): number
    {
        switch(type)
        {
            case RoomObjectType.USER:
            case RoomObjectType.BOT:
            case RoomObjectType.RENTABLE_BOT:
            case RoomObjectType.PET:
                return RoomObjectCategory.UNIT;
            case RoomEngine.ROOM_OBJECT_TYPE:
            case RoomEngine.CURSOR_OBJECT_TYPE:
                return RoomObjectCategory.ROOM;
            default:
                return RoomObjectCategory.FURNITURE;
        }
    }
}