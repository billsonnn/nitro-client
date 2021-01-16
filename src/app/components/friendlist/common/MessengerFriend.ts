import { FriendParser } from '../../../../client/nitro/communication/messages/incoming/friendlist/FriendParser';

export class MessengerFriend
{
    private _id: number;
    private _name: string;
    private _gender: number;
    private _online: boolean;
    private _followingAllowed: boolean;
    private _figure: string;
    private _categoryId: number;
    private _motto: string;
    private _realName: string;
    private _lastAccess: string;
    private _persistedMessageUser: boolean;
    private _vipMember: boolean;
    private _pocketHabboUser: boolean;
    private _relationshipStatus: number;

    public populate(data: FriendParser): boolean
    {
        if(!data) return false;

        this._id                    = data.id;
        this._name                  = data.name;
        this._gender                = data.gender;
        this._online                = data.online;
        this._followingAllowed      = data.followingAllowed;
        this._figure                = data.figure;
        this._categoryId            = data.categoryId;
        this._motto                 = data.motto;
        this._realName              = data.realName;
        this._lastAccess            = data.lastAccess;
        this._persistedMessageUser  = data.persistedMessageUser;
        this._vipMember             = data.vipMember;
        this._pocketHabboUser       = data.pocketHabboUser;
        this._relationshipStatus    = data.relationshipStatus;

        return true;
    }

    public get id(): number
    {
        return this._id;
    }

    public get name(): string
    {
        return this._name;
    }

    public get gender(): number
    {
        return this._gender;
    }

    public get online(): boolean
    {
        return this._online;
    }

    public get followingAllowed(): boolean
    {
        return this._followingAllowed;
    }

    public get figure(): string
    {
        return this._figure;
    }

    public get categoryId(): number
    {
        return this._categoryId;
    }

    public get motto(): string
    {
        return this._motto;
    }

    public get lastAccess(): string
    {
        return this._lastAccess;
    }

    public get realName(): string
    {
        return this._realName;
    }

    public get persistedMessageUser(): boolean
    {
        return this._persistedMessageUser;
    }

    public get vipMember(): boolean
    {
        return this._vipMember;
    }

    public get pocketHabboUser(): boolean
    {
        return this._pocketHabboUser;
    }

    public get relationshipStatus(): number
    {
        return this._relationshipStatus;
    }
}