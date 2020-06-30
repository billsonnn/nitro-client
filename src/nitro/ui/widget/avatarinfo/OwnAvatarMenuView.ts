﻿import { IContextMenuParentWidget } from '../contextmenu/IContextMenuParentWidget';
import { AvatarContextInfoButtonView } from './AvatarContextInfoButtonView';
import { AvatarInfoData } from './AvatarInfoData';

export class OwnAvatarMenuView extends AvatarContextInfoButtonView
{
    private _avatarData: AvatarInfoData;

    constructor(parent: IContextMenuParentWidget)
    {
        super(parent);

        this._avatarData = null;

        this._Str_3403 = false;
    }

    public static setup(view: OwnAvatarMenuView, userId: number, userName: string, userType: number, roomIndex: number, avatarData: AvatarInfoData): void
    {
        view._avatarData = avatarData;

        AvatarContextInfoButtonView.extendedSetup(view, userId, userName, userType, roomIndex, false);
    }
    
    public dispose(): void
    {
        this._avatarData = null;

        super.dispose();
    }
}