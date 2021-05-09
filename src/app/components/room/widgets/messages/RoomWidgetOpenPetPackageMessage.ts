import { RoomWidgetMessage } from 'nitro-renderer/src/nitro/ui/widget/messages/RoomWidgetMessage';

export class RoomWidgetOpenPetPackageMessage extends RoomWidgetMessage
{
    public static RWOPPM_OPEN_PET_PACKAGE: string = 'RWOPPM_OPEN_PET_PACKAGE';

    private _objectId: number;
    private _name: string;

    constructor(k: string, _arg_2: number, _arg_3: string)
    {
        super(k);

        this._objectId = _arg_2;
        this._name = _arg_3;
    }

    public get _Str_1577(): number
    {
        return this._objectId;
    }

    public get name(): string
    {
        return this._name;
    }
}
