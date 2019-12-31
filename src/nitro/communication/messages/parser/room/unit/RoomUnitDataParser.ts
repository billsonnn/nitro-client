import { IMessageDataWrapper } from '../../../../../../core/communication/messages/IMessageDataWrapper';
import { RoomObjectType } from '../../../../../room/object/RoomObjectType';

export class RoomUnitDataParser
{
    private _id: number;
    private _username: string;
    private _motto: string;
    private _figure: string;
    private _gender: string;
    private _unitId: number;
    private _x: number;
    private _y: number;
    private _z: number;
    private _direction: number;
    private _type: string;

    constructor(wrapper: IMessageDataWrapper)
    {
        if(!wrapper) throw new Error('invalid_packet');

        this.flush();
        this.parse(wrapper);
    }

    public flush(): boolean
    {
        this._id        = null;
        this._username  = null;
        this._motto     = null;
        this._figure    = null;
        this._gender    = null;
        this._unitId    = null;
        this._x         = null;
        this._y         = null;
        this._z         = null;
        this._direction = null;
        this._type      = null;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return  false;

        this._id        = wrapper.readInt();
        this._username  = wrapper.readString();
        this._motto     = wrapper.readString();
        this._figure    = wrapper.readString();
        this._unitId    = wrapper.readInt();
        this._x         = wrapper.readInt();
        this._y         = wrapper.readInt();
        this._z         = parseFloat(wrapper.readString());
        this._direction = wrapper.readInt();
        this._type      = RoomObjectType.getTypeName(wrapper.readInt());

        if(this._type === RoomObjectType.USER)
        {
            this._gender            = wrapper.readString().toLocaleUpperCase();
            const groupId           = wrapper.readInt();
            const someInt           = wrapper.readInt();
            const groupName         = wrapper.readString();
            const someString        = wrapper.readString();
            const achievementScore  = wrapper.readInt();
            const something         = wrapper.readBoolean();
        }

        else if(this._type === RoomObjectType.PET)
        {
            const breed         = wrapper.readInt();
            const ownerId       = wrapper.readInt();
            const ownerUsername = wrapper.readString();
            const rarity        = wrapper.readInt();
            const hasSaddle     = wrapper.readBoolean();
            const something     = wrapper.readBoolean();
            const canBreed      = wrapper.readBoolean();
            const isFullyGrown  = wrapper.readBoolean();
            const isDead        = wrapper.readBoolean();
            const isPublicBreed = wrapper.readBoolean();
            const level         = wrapper.readInt();
            const something2    = wrapper.readString();
        }

        else if(this._type === RoomObjectType.BOT)
        {

        }

        else if(this._type === RoomObjectType.RENTABLE_BOT)
        {
            const gender            = wrapper.readString().toLocaleUpperCase();
            const ownerId           = wrapper.readInt();
            const ownerName         = wrapper.readString();
            const shorts: number[]  = [];

            let totalShorts = wrapper.readInt();

            while(totalShorts > 0)
            {
                shorts.push(wrapper.readShort());

                totalShorts--;
            }
        }

        return true;
    }

    public get id(): number
    {
        return this._id;
    }

    public get username(): string
    {
        return this._username;
    }

    public get motto(): string
    {
        return this._motto;
    }

    public get figure(): string
    {
        return this._figure;
    }

    public get gender(): string
    {
        return this._gender;
    }

    public get unitId(): number
    {
        return this._unitId;
    }

    public get x(): number
    {
        return this._x;
    }

    public get y(): number
    {
        return this._y;
    }

    public get z(): number
    {
        return this._z;
    }

    public get direction(): number
    {
        return this._direction;
    }

    public get type(): string
    {
        return this._type;
    }
}