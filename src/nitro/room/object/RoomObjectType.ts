export class RoomObjectType
{
    public static USER: string              = 'user';
    public static PET: string               = 'pet_animated';
    public static BOT: string               = 'bot';
    public static RENTABLE_BOT: string      = 'rentable_bot';
    public static MONSTER_PLANT: string     = 'monsterplant';
    public static AVATAR_TYPES: string[]    = [ 'user', 'pet_animated', 'bot', 'rentable_bot' ];

    public static getTypeId(type: string): number
    {
        if(type === RoomObjectType.USER) return 1;
        
        if(type === RoomObjectType.PET) return 2;

        if(type === RoomObjectType.BOT) return 3;

        if(type === RoomObjectType.RENTABLE_BOT) return 4;
    }

    public static getTypeName(id: number): string
    {
        if(id === 1) return RoomObjectType.USER;

        if(id === 2) return RoomObjectType.PET;

        if(id === 3) return RoomObjectType.BOT;

        if(id === 4) return RoomObjectType.RENTABLE_BOT;
    }
}