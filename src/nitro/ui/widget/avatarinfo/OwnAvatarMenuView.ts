import { AvatarAction } from '../../../avatar/enum/AvatarAction';
import { RoomControllerLevel } from '../../../session/enum/RoomControllerLevel';
import { WindowTemplates } from '../../../window/WindowTemplates';
import { MouseEventType } from '../../MouseEventType';
import { IContextMenuParentWidget } from '../contextmenu/IContextMenuParentWidget';
import { AvatarExpressionEnum } from '../enums/AvatarExpressionEnum';
import { RoomWidgetAvatarExpressionMessage } from '../messages/RoomWidgetAvatarExpressionMessage';
import { RoomWidgetChangePostureMessage } from '../messages/RoomWidgetChangePostureMessage';
import { RoomWidgetDanceMessage } from '../messages/RoomWidgetDanceMessage';
import { RoomWidgetMessage } from '../messages/RoomWidgetMessage';
import { RoomWidgetRequestWidgetMessage } from '../messages/RoomWidgetRequestWidgetMessage';
import { RoomWidgetUserActionMessage } from '../messages/RoomWidgetUserActionMessage';
import { AvatarContextInfoButtonView } from './AvatarContextInfoButtonView';
import { AvatarInfoData } from './AvatarInfoData';
import { AvatarInfoWidget } from './AvatarInfoWidget';

export class OwnAvatarMenuView extends AvatarContextInfoButtonView
{
    private static MODE_NORMAL: number          = 0;
    private static MODE_CLUB_DANCES: number     = 1;
    private static MODE_NAME_CHANGE: number     = 2;
    private static MODE_EXPRESSIONS: number     = 3;
    private static MODE_SIGNS: number           = 4;
    private static MODE_CHANGE_LOOKS: number    = 5;

    private _avatarData: AvatarInfoData;
    private _mode: number;

    constructor(parent: IContextMenuParentWidget)
    {
        super(parent);

        this._avatarData    = null;
        this._mode          = OwnAvatarMenuView.MODE_NORMAL;

        this._Str_3403      = false;
    }

    public static setup(view: OwnAvatarMenuView, userId: number, userName: string, userType: number, roomIndex: number, avatarData: AvatarInfoData): void
    {
        view._avatarData = avatarData;

        if(view.widget.isDancing && view.widget._Str_6454) view._mode = OwnAvatarMenuView.MODE_CLUB_DANCES;

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

        this.buildButtons();
    }

    protected buildButtons(): void
    {
        super.buildButtons();

        const isRidingHorse = this.widget._Str_25831;

        switch(this._mode)
        {
            case OwnAvatarMenuView.MODE_NORMAL:
                this.addButton('decorate', (this._Str_22241() && (this._avatarData.roomControllerLevel >= RoomControllerLevel.GUEST) || (this._avatarData._Str_3246)));
                this.addButton('change_looks');
                this.addButton('dance_menu', (this.widget._Str_6454 && !isRidingHorse));
                this.addButton('dance', (!this.widget.isDancing && !this.widget._Str_6454 && !isRidingHorse));
                this.addButton('dance_stop', (this.widget.isDancing && !this.widget._Str_6454 && !isRidingHorse));
                this.addButton('expressions');
                this.addButton('signs');
                this.addButton('drop_hand_item', ((this._avatarData._Str_8826 > 0) && (this._avatarData._Str_8826 < 999999)));
                break;
            case OwnAvatarMenuView.MODE_CLUB_DANCES:
                this.addButton('dance_stop', this.widget.isDancing);
                this.addButton('dance_1');
                this.addButton('dance_2');
                this.addButton('dance_3');
                this.addButton('dance_4');
                this.addButton('back');
                break;
            case OwnAvatarMenuView.MODE_EXPRESSIONS:
                this.addButton('sit', (this.widget.getOwnPosture === AvatarAction.POSTURE_STAND));
                this.addButton('stand', this.widget.getCanStandUp);
                this.addButton('wave', !this.widget._Str_12708);
                this.addButton('laugh', (!this.widget._Str_12708 && this.widget._Str_7303));
                this.addButton('blow', (!this.widget._Str_12708 && this.widget._Str_7303));
                this.addButton('idle');
                this.addButton('back');
                break;
            case OwnAvatarMenuView.MODE_SIGNS:
                this.addButton('back');
                break;
        }
    }

    protected handleMouseEvent(event: MouseEvent): void
    {
        if(!event || !this._window || this.disposed) return;

        let message: RoomWidgetMessage  = null;
        let hideMenu: boolean           = false;

        if(event.type === MouseEventType.MOUSE_CLICK)
        {
            hideMenu = true;

            const target = (event.target as HTMLElement);

            if(target)
            {
                const tag = target.getAttribute('data-tag');

                if(tag && (tag !== ''))
                {
                    switch(tag)
                    {
                        case 'decorate':
                            break;
                        case 'change_looks':
                            break;
                        case 'expressions':
                            hideMenu = false;
                            this.setMode(OwnAvatarMenuView.MODE_EXPRESSIONS);
                            break;
                        case 'sit':
                            message = new RoomWidgetChangePostureMessage(RoomWidgetChangePostureMessage._Str_2016);
                            break;
                        case 'stand':
                            message = new RoomWidgetChangePostureMessage(RoomWidgetChangePostureMessage._Str_1553);
                            break;
                        case 'wave':
                            message = new RoomWidgetAvatarExpressionMessage(AvatarExpressionEnum._Str_6268);
                            break;
                        case 'blow':
                            message = new RoomWidgetAvatarExpressionMessage(AvatarExpressionEnum._Str_5579);
                            break;
                        case 'laugh':
                            message = new RoomWidgetAvatarExpressionMessage(AvatarExpressionEnum._Str_7336);
                            break;
                        case 'idle':
                            message = new RoomWidgetAvatarExpressionMessage(AvatarExpressionEnum._Str_6989);
                            break;
                        case 'dance_menu':
                            hideMenu = false;
                            this.setMode(OwnAvatarMenuView.MODE_CLUB_DANCES);
                            break;
                        case 'dance':
                            message = new RoomWidgetDanceMessage(1);
                            break;
                        case 'dance_stop':
                            message = new RoomWidgetDanceMessage(0);
                            break;
                        case 'dance_1':
                        case 'dance_2':
                        case 'dance_3':
                        case 'dance_4':
                            message = new RoomWidgetDanceMessage(parseInt(tag.charAt((tag.length - 1))));
                            break;
                        case 'effects':
                            message = new RoomWidgetRequestWidgetMessage(RoomWidgetRequestWidgetMessage.RWRWM_EFFECTS);
                            break;
                        case 'signs':
                            hideMenu = false;
                            this.setMode(OwnAvatarMenuView.MODE_SIGNS);
                            break;
                        case 'back':
                            hideMenu = false;
                            this.setMode(OwnAvatarMenuView.MODE_NORMAL);
                            break;
                        case 'more':
                            hideMenu = false;
                            //this.widget._Str_13909 = false;
                            this.setMode(OwnAvatarMenuView.MODE_NORMAL);
                            break;
                        case 'drop_hand_item':
                            message = new RoomWidgetUserActionMessage(RoomWidgetUserActionMessage.RWUAM_DROP_CARRY_ITEM, this.userId);
                            break;
                        default:
                            super.handleMouseEvent(event);
                            return;
                    }
                }
            }

            if(message)
            {
                this._parent.messageListener.processWidgetMessage(message);
            }
        }
        else
        {
            super.handleMouseEvent(event);
        }

        if(hideMenu)
        {
            this._parent.removeView(this, false);
        }
    }

    private setMode(mode: number): void
    {
        this._mode = mode;

        this.buildButtons();
    }

    private _Str_22241(): boolean
    {
        return this.widget._Str_6454;
    }

    protected getTemplate(): string
    {
        return this._parent.windowManager.getTemplate(WindowTemplates.CONTEXT_MENU_OWN_AVATAR_VIEW);
    }

    private get widget(): AvatarInfoWidget
    {
        return this._parent as AvatarInfoWidget;
    }
}