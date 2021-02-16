import GroupBadgePart from './GroupBadgePart';

export default class GroupSettings
{
    private _name: string;
    private _description: string;
    private _roomId: string;

    private _badgeParts: Map<number, GroupBadgePart>;
    private _colorA: number;
    private _colorB: number;
    
    constructor()
    {
        this._name = '';
        this._description = '';
        this._roomId = '0';

        this._badgeParts = new Map();
        this._badgeParts.set(0, new GroupBadgePart(true));
        this._badgeParts.set(1, new GroupBadgePart(false));
        this._badgeParts.set(2, new GroupBadgePart(false));
        this._badgeParts.set(3, new GroupBadgePart(false));
        this._badgeParts.set(4, new GroupBadgePart(false));
    }

    public getBadgePart(id: number): GroupBadgePart
    {
        return this._badgeParts.get(id);
    }
    
    public setPartsColor(color: number): void
    {
        this._badgeParts.forEach((symbol) => {
            symbol.color = color;
        });
    }

    public get name(): string
    {
        return this._name;
    }

    public set name(name: string)
    {
        this._name = name;
    }

    public get description(): string
    {
        return this._description;
    }

    public set description(description: string)
    {
        this._description = description;
    }

    public get roomId(): string
    {
        return this._roomId;
    }

    public set roomId(id: string)
    {
        this._roomId = id;
    }

    public get badgeParts(): Map<number, GroupBadgePart>
    {
        return this._badgeParts;
    }

    public get colorA(): number
    {
        return this._colorA;
    }

    public set colorA(id: number)
    {
        this._colorA = id;
    }

    public get colorB(): number
    {
        return this._colorB;
    }

    public set colorB(id: number)
    {
        this._colorB = id;
    }
}
