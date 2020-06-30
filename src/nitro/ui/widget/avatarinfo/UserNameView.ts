import { AvatarContextInfoView } from './AvatarContextInfoView';
import { AvatarInfoWidget } from './AvatarInfoWidget';

export class UserNameView extends AvatarContextInfoView
{
    private _objectId: number;

    constructor(k: AvatarInfoWidget)
    {
        super(k);
    }

    public static setup(view: UserNameView, userId: number, userName: string, _arg_4: number, _arg_5: number, objectId: number, fadeDelay: number = 8000):void
    {
        view._objectId         = objectId;
        view._fadeStartDelay   = fadeDelay;

        AvatarContextInfoView.extendedSetup(view, userId, userName, _arg_4, _arg_5, false);
    }

    public get objectId(): number
    {
        return this._objectId;
    }
}