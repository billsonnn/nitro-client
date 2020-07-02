import { WindowTemplates } from '../../../window/WindowTemplates';
import { IContextMenuParentWidget } from '../contextmenu/IContextMenuParentWidget';
import { AvatarContextInfoButtonView } from './AvatarContextInfoButtonView';
import { AvatarInfoData } from './AvatarInfoData';

export class AvatarMenuView extends AvatarContextInfoButtonView
{
    protected _avatarData: AvatarInfoData;

    constructor(parent: IContextMenuParentWidget)
    {
        super(parent);

        this._avatarData = null;

        this._Str_3403 = false;
    }

    public static setup(view: AvatarMenuView, userId: number, userName: string, userType: number, roomIndex: number, avatarData: AvatarInfoData):void
    {
        view._avatarData = avatarData;

        AvatarContextInfoButtonView.extendedSetup(view, userId, userName, userType, roomIndex, false);
    }

    public dispose(): void
    {
        this._avatarData = null;

        super.dispose();
    }

    protected updateWindow():void
    {
        if(!this._parent || !this._parent.windowManager) return;

        if(!this._window)
        {
            const view = {
                username: this._userName
            };

            this._window = this._parent.windowManager.renderElement(this.getTemplate(), view);

            if(!this._window) return;
        }

        this.activeView = this._window;
    }

    protected getTemplate(): string
    {
        return this._parent.windowManager.getTemplate(WindowTemplates.CONTEXT_MENU_AVATAR_VIEW);
    }
}