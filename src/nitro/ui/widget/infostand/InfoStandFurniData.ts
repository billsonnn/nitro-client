import { IObjectData } from '../../../room/object/data/IObjectData';
import { RoomWidgetFurniInfostandUpdateEvent } from '../events/RoomWidgetFurniInfostandUpdateEvent';

export class InfoStandFurniData 
{
    private _id: number = 0;
    private _category: number = 0;
    private _name: string = "";
    private _description: string = "";
    private _image: PIXI.Texture;
    private _purchaseOfferId: number = -1;
    private _extraParam: string = "";
    private _stuffData: IObjectData = null;
    private _groupId: number;
    private _ownerId: number = 0;
    private _ownerName: string = "";
    private _rentOfferId: number = -1;
    private _availableForBuildersClub: boolean = false;

    public set id(k: number)
    {
        this._id = k;
    }

    public set category(k: number)
    {
        this._category = k;
    }

    public set name(k: string)
    {
        this._name = k;
    }

    public set description(k: string)
    {
        this._description = k;
    }

    public set image(k: PIXI.Texture)
    {
        this._image = k;
    }

    public set _Str_3473(k: number)
    {
        this._purchaseOfferId = k;
    }

    public set _Str_2415(k: string)
    {
        this._extraParam = k;
    }

    public set stuffData(k: IObjectData)
    {
        this._stuffData = k;
    }

    public set groupId(k: number)
    {
        this._groupId = k;
    }

    public set _Str_2481(k: number)
    {
        this._ownerId = k;
    }

    public set ownerName(k: string)
    {
        this._ownerName = k;
    }

    public get id(): number
    {
        return this._id;
    }

    public get category(): number
    {
        return this._category;
    }

    public get name(): string
    {
        return this._name;
    }

    public get description(): string
    {
        return this._description;
    }

    public get image(): PIXI.Texture
    {
        return this._image;
    }

    public get _Str_3473(): number
    {
        return this._purchaseOfferId;
    }

    public get _Str_2415(): string
    {
        return this._extraParam;
    }

    public get stuffData(): IObjectData
    {
        return this._stuffData;
    }

    public get groupId(): number
    {
        return this._groupId;
    }

    public get _Str_2481(): number
    {
        return this._ownerId;
    }

    public get ownerName(): string
    {
        return this._ownerName;
    }

    public get _Str_3693(): number
    {
        return this._rentOfferId;
    }

    public set _Str_3693(k: number)
    {
        this._rentOfferId = k;
    }

    public get _Str_6098(): boolean
    {
        return this._availableForBuildersClub;
    }

    public _Str_5479(k: RoomWidgetFurniInfostandUpdateEvent): void
    {
        this.id = k.id;
        this.category = k.category;
        this.name = k.name;
        this.description = k.description;
        this.image = k.image;
        this._Str_3473 = k._Str_3473;
        this._Str_2415 = k._Str_2415;
        this.stuffData = k.stuffData;
        this.groupId = k.groupId;
        this.ownerName = k.ownerName;
        this._Str_2481 = k.ownerId;
        this._Str_3693 = k._Str_3693;
        this._availableForBuildersClub = k._Str_6098;
    }
}