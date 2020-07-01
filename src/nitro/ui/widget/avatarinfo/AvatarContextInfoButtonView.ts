﻿import { RoomObjectType } from '../../../room/object/RoomObjectType';
import { ButtonMenuView } from '../contextmenu/ButtonMenuView';
import { ContextInfoView } from '../contextmenu/ContextInfoView';
import { IContextMenuParentWidget } from '../contextmenu/IContextMenuParentWidget';

export class AvatarContextInfoButtonView extends ButtonMenuView
{
    protected _userId: number;
    protected _userName: string;
    protected _roomIndex: number;
    protected _userType: number;
    protected _Str_3947: boolean;

    constructor(k: IContextMenuParentWidget)
    {
        super(k);
    }

    public static extendedSetup(view: AvatarContextInfoButtonView, userId: number, userName: string, userType: number, roomIndex: number, _arg_6: boolean = false, _arg_7: boolean = false):void
    {
        view._userId       = userId;
        view._userName     = userName;
        view._roomIndex    = roomIndex;
        view._userType     = userType;
        view._Str_3947     = _arg_6;
        view._Str_3403     = _arg_7;

        ContextInfoView.render(view);
    }

    protected updateWindow():void
    {
        if(!this._parent || !this._parent.windowManager) return;

        if(!this._window)
        {
            const view = {};

            this._window = this._parent.windowManager.renderElement(this.getAvatarInfoWidgetView(), view);

            if(!this._window) return;
        }

        const nameElement = (this._window.getElementsByClassName('avatar-info-name')[0] as HTMLElement);

        if(nameElement)
        {
            nameElement.innerText = this._userName;
        }

        this.activeView = this._window;
    }

    protected getOffset(k: PIXI.Rectangle): number
    {
        let height: number = -(this._activeView.offsetHeight);

        if((this._userType === RoomObjectType.USER) || (this._userType === RoomObjectType.BOT) || (this._userType === RoomObjectType.RENTABLE_BOT))
        {
            height = (height + ((k.height > 50) ? 25 : 0));
        }
        else
        {
            height = (height - 4);
        }

        return height;
    }

    private getAvatarInfoWidgetView(): string
    {
        return this._parent.windowManager.getTemplate('avatar_info_view');
    }

    public get userId(): number
    {
        return this._userId;
    }

    public get roomIndex(): number
    {
        return this._roomIndex;
    }

    public get userType(): number
    {
        return this._userType;
    }

    public get userName(): string
    {
        return this._userName;
    }

    public get _Str_4330(): boolean
    {
        return this._Str_3947;
    }
}