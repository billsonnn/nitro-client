import { ContextInfoView } from '../contextmenu/ContextInfoView';
import { IContextMenuParentWidget } from '../contextmenu/IContextMenuParentWidget';

export class AvatarContextInfoView extends ContextInfoView
{
    protected _userId: number;
    protected _userName: string;
    protected _roomIndex: number;
    protected _Str_3947: boolean;
    protected _userType: number;

    constructor(k: IContextMenuParentWidget)
    {
        super(k);
    }

    protected static extendedSetup(view: AvatarContextInfoView, userId: number, userName: string, userType: number, roomIndex: number, _arg_6: boolean = false):void
    {
        view._userId    = userId;
        view._userName  = userName;
        view._roomIndex = roomIndex;
        view._userType  = userType;
        view._Str_3947  = _arg_6;

        ContextInfoView.render(view);
    }


    public get userId(): number
    {
        return this._userId;
    }

    public get _Str_2908(): number
    {
        return this._roomIndex;
    }

    public get _Str_2707(): number
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

    // protected updateWindow():void
    // {
    //     if(((!(this._Str_2268)) || (!(this._Str_2268.windowManager)))) return;

    //     if(!this._window)
    //     {
    //         const view = {};

    //         this._window = this._Str_2268.windowManager.renderElement(this.getAvatarInfoWidgetTemplate(), view);

    //         if(!this._window) return;
    //     }

    //     const nameContainer = (this._window.getElementsByClassName('name')[0] as HTMLElement);

    //     if(nameContainer) nameContainer.innerText = this._userName;

    //     const changeNameContainer = (this._window.getElementsByClassName('change-name')[0] as HTMLElement);

    //     if(changeNameContainer) changeNameContainer.style.visibility = 'hidden';

    //     this._window.style.height = (39 + 'px');

    //     this.activeView = this._window;
    // }

    // protected getOffset(k: PIXI.Rectangle): number
    // {
    //     var _local_2: number = -(this._Str_3007.offsetHeight);
    //     if (((this._roomIndex == RoomObjectType.USER) || (this._roomIndex == RoomObjectType.BOT)))
    //     {
    //         _local_2 = (_local_2 + ((k.height > 50) ? 25 : 0));
    //     }
    //     else
    //     {
    //         _local_2 = (_local_2 - 4);
    //     }

    //     return _local_2;
    // }

    // private getAvatarInfoWidgetTemplate(): string
    // {
    //     return `
    //     <div class='>
    //     </div>`;
    // }
}