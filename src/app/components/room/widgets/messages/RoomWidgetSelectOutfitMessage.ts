import { RoomWidgetMessage } from '../../../../../client/nitro/ui/widget/messages/RoomWidgetMessage';

export class RoomWidgetSelectOutfitMessage extends RoomWidgetMessage
{
    public static SELECT_OUTFIT: string = 'select_outfit';

    private _outfitId: number;

    constructor(k: number)
    {
        super(RoomWidgetSelectOutfitMessage.SELECT_OUTFIT);

        this._outfitId = k;
    }

    public get _Str_26349(): number
    {
        return this._outfitId;
    }
}