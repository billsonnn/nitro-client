import { IMessageDataWrapper } from '../../../../../../core/communication/messages/IMessageDataWrapper';

export class NavigatorSearchResultRoom
{
    private static THUMBNAIL_BITMASK: number           = 1;
    private static GROUPDATA_BITMASK: number           = 2;
    private static ROOMAD_BITMASK: number              = 4;
    private static SHOWOWNER_BITMASK: number           = 8;
    private static ALLOWPETS_BITMASK: number           = 16;
    private static DISPLAYROOMENTRYAD_BITMASK: number  = 32;

    private _flatId: number;
    private _roomName: string;
    private _showOwner: boolean;
    private _ownerId: number;
    private _ownerName: string;
    private _doorMode: number;
    private _userCount: number;
    private _maxUserCount: number;
    private _description: string;
    private _tradeMode: number;
    private _score: number;
    private _ranking: number;
    private _categoryId: number;
    private _nStars: number;
    private _habboGroupId: number = 0;
    private _groupName: string = "";
    private _groupBadgeCode: string = "";
    private _tags: string[];
    private _allowPets: boolean;
    private _displayRoomEntryAd: boolean;
    private _roomAdName: string = "";
    private _roomAdDescription: string = "";
    private _roomAdExpiresInMin: number = 0;
    private _allInRoomMuted: boolean;
    private _canMute: boolean;
    private _disposed: boolean;
    private _officialRoomPicRef: string = null;

    constructor(wrapper: IMessageDataWrapper)
    {
        if(!wrapper) throw new Error('invalid_wrapper');

        this.flush();
        this.parse(wrapper);
    }

    public flush(): boolean
    {
        this._flatId                = -1;
        this._roomName              = null;
        this._ownerId               = -1;
        this._ownerName             = null;
        this._doorMode              = 0;
        this._userCount             = 0;
        this._maxUserCount          = 0;
        this._description           = null;
        this._tradeMode             = 0;
        this._score                 = 0;
        this._ranking               = 0;
        this._categoryId            = -1;
        this._tags                  = [];
        this._officialRoomPicRef    = null;
        this._habboGroupId          = -1;
        this._groupName             = null;
        this._groupBadgeCode        = null;
        this._roomAdName            = null;
        this._roomAdDescription     = null;
        this._roomAdExpiresInMin    = 0;
        this._showOwner             = false;
        this._allowPets             = false;
        this._displayRoomEntryAd    = false;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._flatId        = wrapper.readInt();
        this._roomName      = wrapper.readString();
        this._ownerId       = wrapper.readInt();
        this._ownerName     = wrapper.readString();
        this._doorMode      = wrapper.readInt();
        this._userCount     = wrapper.readInt();
        this._maxUserCount  = wrapper.readInt();
        this._description   = wrapper.readString();
        this._tradeMode     = wrapper.readInt();
        this._score         = wrapper.readInt();
        this._ranking       = wrapper.readInt();
        this._categoryId    = wrapper.readInt();

        let totalTags = wrapper.readInt();

        while (totalTags > 0)
        {
            this._tags.push(wrapper.readString());

            totalTags--;
        }

        const bitmask = wrapper.readInt();

        if((bitmask & NavigatorSearchResultRoom.THUMBNAIL_BITMASK) > 0) this._officialRoomPicRef = wrapper.readString();

        if ((bitmask & NavigatorSearchResultRoom.GROUPDATA_BITMASK) > 0)
        {
            this._habboGroupId      = wrapper.readInt();
            this._groupName         = wrapper.readString();
            this._groupBadgeCode    = wrapper.readString();
        }

        if((bitmask & NavigatorSearchResultRoom.ROOMAD_BITMASK) > 0)
        {
            this._roomAdName            = wrapper.readString();
            this._roomAdDescription     = wrapper.readString();
            this._roomAdExpiresInMin    = wrapper.readInt();
        }

        this._showOwner             = ((bitmask & NavigatorSearchResultRoom.SHOWOWNER_BITMASK) > 0);
        this._allowPets             = ((bitmask & NavigatorSearchResultRoom.ALLOWPETS_BITMASK) > 0);
        this._displayRoomEntryAd    = ((bitmask & NavigatorSearchResultRoom.DISPLAYROOMENTRYAD_BITMASK) > 0);

        return true;
    }

    public get roomId(): number
    {
        return this._flatId;
    }

    public get roomName(): string
    {
        return this._roomName;
    }

    public get ownerId(): number
    {
        return this._ownerId;
    }

    public get ownerName(): string
    {
        return this._ownerName;
    }

    public get doorMode(): number
    {
        return this._doorMode;
    }

    public get userCount(): number
    {
        return this._userCount;
    }

    public get maxUserCount(): number
    {
        return this._maxUserCount;
    }

    public get description(): string
    {
        return this._description;
    }

    public get tradeMode(): number
    {
        return this._tradeMode;
    }

    public get score(): number
    {
        return this._score;
    }

    public get ranking(): number
    {
        return this._ranking;
    }

    public get categoryId(): number
    {
        return this._categoryId;
    }

    public get tags(): string[]
    {
        return this._tags;
    }

    public get officialRoomPicRef(): string
    {
        return this._officialRoomPicRef;
    }

    public get habboGroupId(): number
    {
        return this._habboGroupId;
    }

    public get groupName(): string
    {
        return this._groupName;
    }

    public get groupBadgeCode(): string
    {
        return this._groupBadgeCode;
    }

    public get roomAdName(): string
    {
        return this._roomAdName;
    }

    public get roomAdDescription(): string
    {
        return this._roomAdDescription;
    }

    public get roomAdExpiresInMin(): number
    {
        return this._roomAdExpiresInMin;
    }

    public get showOwner(): boolean
    {
        return this._showOwner;
    }

    public get allowPets(): boolean
    {
        return this._allowPets;
    }

    public get displayRoomEntryAd(): boolean
    {
        return this._displayRoomEntryAd;
    }
}