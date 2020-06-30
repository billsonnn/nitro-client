import { IObjectData } from '../../../room/object/data/IObjectData';
import { RoomWidgetUpdateEvent } from './RoomWidgetUpdateEvent';

export class RoomWidgetFurniInfostandUpdateEvent extends RoomWidgetUpdateEvent
{
    public static FURNI: string = "RWFIUE_FURNI";

    private _id: number = 0;
    private _category: number = 0;
    private _name: string = "";
    private _description: string = "";
    private _image: PIXI.Texture = null;
    private _Str_4167: boolean = false;
    private _Str_21073: boolean = false;
    private _Str_7750: boolean = false;
    private _roomControllerLevel: number = 0;
    private _Str_10043: boolean = false;
    private _expiration: number = -1;
    private _Str_25890: number = -1;
    private _Str_6693: number = -1;
    private _Str_3194: string = "";
    private _Str_4514: boolean = false;
    private _stuffData: IObjectData = null;
    private _groupId: number = 0;
    private _ownerId: number = 0;
    private _ownerName: string = "";
    private _Str_5135: number = 0;
    private _Str_26155: number = -1;
    private _Str_6586: number = -1;
    private _Str_9981: boolean;
    private _Str_11465: boolean;
    private _Str_6871: boolean;

    constructor(k: string)
    {
        super(k);
    }

    public set id(k: number)
    {
        this._id = k;
    }

    public get id(): number
    {
        return this._id;
    }

    public set category(k: number)
    {
        this._category = k;
    }

    public get category(): number
    {
        return this._category;
    }

    public set name(k: string)
    {
        this._name = k;
    }

    public get name(): string
    {
        return this._name;
    }

    public set description(k: string)
    {
        this._description = k;
    }

    public get description(): string
    {
        return this._description;
    }

    public set image(k: PIXI.Texture)
    {
        this._image = k;
    }

    public get image(): PIXI.Texture
    {
        return this._image;
    }

    public set _Str_2770(k: boolean)
    {
        this._Str_4167 = k;
    }

    public get _Str_2770(): boolean
    {
        return this._Str_4167;
    }

    public set _Str_17541(k: boolean)
    {
        this._Str_21073 = k;
    }

    public get _Str_17541(): boolean
    {
        return this._Str_21073;
    }

    public set _Str_2781(k: boolean)
    {
        this._Str_7750 = k;
    }

    public get _Str_2781(): boolean
    {
        return this._Str_7750;
    }

    public set roomControllerLevel(k: number)
    {
        this._roomControllerLevel = k;
    }

    public get roomControllerLevel(): number
    {
        return this._roomControllerLevel;
    }

    public set _Str_2799(k: boolean)
    {
        this._Str_10043 = k;
    }

    public get _Str_2799(): boolean
    {
        return this._Str_10043;
    }

    public set expiration(k: number)
    {
        this._expiration = k;
    }

    public get expiration(): number
    {
        return this._expiration;
    }

    public set _Str_3473(k: number)
    {
        this._Str_6693 = k;
    }

    public get _Str_3473(): number
    {
        return this._Str_6693;
    }

    public set _Str_2415(k: string)
    {
        this._Str_3194 = k;
    }

    public get _Str_2415(): string
    {
        return this._Str_3194;
    }

    public set _Str_3233(k: boolean)
    {
        this._Str_4514 = k;
    }

    public get _Str_3233(): boolean
    {
        return this._Str_4514;
    }

    public set stuffData(k: IObjectData)
    {
        this._stuffData = k;
    }

    public get stuffData(): IObjectData
    {
        return this._stuffData;
    }

    public set groupId(k: number)
    {
        this._groupId = k;
    }

    public get groupId(): number
    {
        return this._groupId;
    }

    public set ownerId(k: number)
    {
        this._ownerId = k;
    }

    public get ownerId(): number
    {
        return this._ownerId;
    }

    public set ownerName(k: string)
    {
        this._ownerName = k;
    }

    public get ownerName(): string
    {
        return this._ownerName;
    }

    public set _Str_4172(k: number)
    {
        this._Str_5135 = k;
    }

    public get _Str_4172(): number
    {
        return this._Str_5135;
    }

    public set _Str_3693(k: number)
    {
        this._Str_6586 = k;
    }

    public get _Str_3693(): number
    {
        return this._Str_6586;
    }

    public get _Str_7629(): boolean
    {
        return this._Str_9981;
    }

    public set _Str_7629(k: boolean)
    {
        this._Str_9981 = k;
    }

    public get _Str_8116(): boolean
    {
        return this._Str_11465;
    }

    public set _Str_8116(k: boolean)
    {
        this._Str_11465 = k;
    }

    public get _Str_6098(): boolean
    {
        return this._Str_6871;
    }

    public set _Str_6098(k: boolean)
    {
        this._Str_6871 = k;
    }
}