import { RoomObjectCategory } from '../../../room/object/RoomObjectCategory';
import { RoomObjectVariable } from '../../../room/object/RoomObjectVariable';
import { RoomControllerLevel } from '../../../session/enum/RoomControllerLevel';
import { WindowTemplates } from '../../../window/WindowTemplates';
import { MouseEventType } from '../../MouseEventType';
import { IContextMenuParentWidget } from '../contextmenu/IContextMenuParentWidget';
import { RoomWidgetMessage } from '../messages/RoomWidgetMessage';
import { RoomWidgetUserActionMessage } from '../messages/RoomWidgetUserActionMessage';
import { AvatarContextInfoButtonView } from './AvatarContextInfoButtonView';
import { AvatarInfoData } from './AvatarInfoData';
import { AvatarInfoWidget } from './AvatarInfoWidget';

export class AvatarMenuView extends AvatarContextInfoButtonView
{
    private static MODE_NORMAL: number          = 0;
    private static MODE_MODERATE: number        = 1;
    private static MODE_MODERATE_BAN: number    = 2;
    private static MODE_MODERATE_MUTE: number   = 3;
    private static MODE_AMBASSADOR: number      = 4;
    private static MODE_AMBASSADOR_MUTE: number = 5;

    private _avatarData: AvatarInfoData;
    private _mode: number;

    constructor(parent: IContextMenuParentWidget)
    {
        super(parent);

        this._avatarData    = null;
        this._mode          = AvatarMenuView.MODE_NORMAL;

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

    protected updateWindow(): void
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

        switch(this._mode)
        {
            case AvatarMenuView.MODE_NORMAL:
                this.addButton('add_friend');
                this.addButton('trade');
                this.addButton('whisper');
                this.addButton('respect');
                this.addButton('ignore');
                this.addButton('unignore');
                this.addButton('report');
                this.addButton('moderate');
                this.addButton('ambassador');

                const handler       = this.widget.handler;
                const roomObject    = handler.container.roomEngine.getRoomObject(handler.roomSession.roomId, handler.container.roomSession.ownRoomIndex, RoomObjectCategory.UNIT);
                
                if(roomObject)
                {
                    const carryId = (roomObject.model.getValue(RoomObjectVariable.FIGURE_CARRY_OBJECT) as number);

                    if((carryId > 0) && (carryId < 999999)) this.addButton('pass_handitem');
                }
                break;
            case AvatarMenuView.MODE_MODERATE:
                this.addButton('kick');
                this.addButton('mute');
                this.addButton('ban');
                this.addButton('give_rights');
                this.addButton('remove_rights');
                this.addButton('back');
                break;
            case AvatarMenuView.MODE_MODERATE_BAN:
                this.addButton('ban_hour');
                this.addButton('ban_day');
                this.addButton('ban_perm');
                this.addButton('back_moderate');
                break;
            case AvatarMenuView.MODE_MODERATE_MUTE:
                this.addButton('mute_2min');
                this.addButton('mute_5min');
                this.addButton('mute_10min');
                this.addButton('back_moderate');
                break;
            case AvatarMenuView.MODE_AMBASSADOR:
                this.addButton('ambassador_alert');
                this.addButton('ambassador_kick');
                this.addButton('ambassador_mute');
                this.addButton('back');
                break;
            case AvatarMenuView.MODE_AMBASSADOR_MUTE:
                this.addButton('ambassador_mute_2min');
                this.addButton('ambassador_mute_10min');
                this.addButton('ambassador_mute_60min');
                this.addButton('ambassador_mute_18hr');
                this.addButton('back_ambassador');
                break;
        }
    }

    protected handleMouseEvent(event: MouseEvent): void
    {
        if(!event || !this._window || this.disposed) return;

        let message: RoomWidgetMessage  = null;
        let messageType: string         = null;
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
                        case 'moderate':
                            hideMenu = false;
                            this.setMode(AvatarMenuView.MODE_MODERATE);
                            break;
                        case 'ban':
                            hideMenu = false;
                            this.setMode(AvatarMenuView.MODE_MODERATE_BAN);
                            break;
                        case 'mute':
                            hideMenu = false;
                            this.setMode(AvatarMenuView.MODE_MODERATE_MUTE);
                            break;
                        case 'ambassador':
                            hideMenu = false;
                            this.setMode(AvatarMenuView.MODE_AMBASSADOR);
                            break;
                        case 'ambassador_mute':
                            hideMenu = false;
                            this.setMode(AvatarMenuView.MODE_AMBASSADOR_MUTE);
                            break;
                        case 'back_moderate':
                            hideMenu = false;
                            this.setMode(AvatarMenuView.MODE_MODERATE);
                            break;
                        case 'back_ambassador':
                            hideMenu = false;
                            this.setMode(AvatarMenuView.MODE_AMBASSADOR);
                            break;
                        case 'back':
                            hideMenu = false;
                            this.setMode(AvatarMenuView.MODE_NORMAL);
                            break;
                        case 'whisper':
                            messageType = RoomWidgetUserActionMessage.RWUAM_WHISPER_USER;
                            break;
                        case 'friend':
                            this._avatarData.canBeAskedForAFriend = false;
                            messageType = RoomWidgetUserActionMessage.RWUAM_SEND_FRIEND_REQUEST;
                            break;
                        case 'respect':
                            // this._data._Str_3577--;
                            // _local_6 = this._data._Str_3577;
                            // this.widget.localizations.registerParameter('infostand.button.respect', 'count', _local_6.toString());
                            // _Str_2304('respect', (this._data._Str_3577 > 0));
                            // messageType = RoomWidgetUserActionMessage.RWUAM_RESPECT_USER;
                            // if (_local_6 > 0)
                            // {
                            //     _local_3 = false;
                            // }
                            break;
                        case 'ignore':
                            this._avatarData._Str_3655 = true;
                            messageType = RoomWidgetUserActionMessage.RWUAM_IGNORE_USER;
                            break;
                        case 'unignore':
                            this._avatarData._Str_3655 = false;
                            messageType = RoomWidgetUserActionMessage.RWUAM_UNIGNORE_USER;
                            break;
                        case 'kick':
                            messageType = RoomWidgetUserActionMessage.RWUAM_KICK_USER;
                            break;
                        case 'ban_hour':
                            messageType = RoomWidgetUserActionMessage.RWUAM_BAN_USER_HOUR;
                            break;
                        case 'ban_day':
                            messageType = RoomWidgetUserActionMessage.RWUAM_BAN_USER_DAY;
                            break;
                        case 'perm_ban':
                            messageType = RoomWidgetUserActionMessage.RWUAM_BAN_USER_PERM;
                            break;
                        case 'mute_2min':
                            messageType = RoomWidgetUserActionMessage.MUTE_USER_2MIN;
                            break;
                        case 'mute_5min':
                            messageType = RoomWidgetUserActionMessage.MUTE_USER_5MIN;
                            break;
                        case 'mute_10min':
                            messageType = RoomWidgetUserActionMessage.MUTE_USER_10MIN;
                            break;
                        case 'give_rights':
                            this._avatarData.roomControllerLevel = RoomControllerLevel.GUEST;
                            messageType = RoomWidgetUserActionMessage.RWUAM_GIVE_RIGHTS;
                            break;
                        case 'remove_rights':
                            this._avatarData.roomControllerLevel = RoomControllerLevel.NONE;
                            messageType = RoomWidgetUserActionMessage.RWUAM_TAKE_RIGHTS;
                            break;
                        case 'trade':
                            messageType = RoomWidgetUserActionMessage.RWUAM_START_TRADING;
                            break;
                        case 'report':
                            messageType = RoomWidgetUserActionMessage.RWUAM_REPORT_CFH_OTHER;
                            break;
                        case 'pass_handitem':
                            messageType = RoomWidgetUserActionMessage.RWUAM_PASS_CARRY_ITEM;
                            break;
                        case 'ambassador_alert':
                            messageType = RoomWidgetUserActionMessage.RWUAM_AMBASSADOR_ALERT_USER;
                            break;
                        case 'ambassador_kick':
                            messageType = RoomWidgetUserActionMessage.RWUAM_AMBASSADOR_KICK_USER;
                            break;
                        case 'ambassador_mute_2min':
                            messageType = RoomWidgetUserActionMessage.AMBASSADOR_MUTE_USER_2MIN;
                            break;
                        case 'ambassador_mute_10min':
                            messageType = RoomWidgetUserActionMessage.AMBASSADOR_MUTE_USER_10MIN;
                            break;
                        case 'ambassador_mute_60min':
                            messageType = RoomWidgetUserActionMessage.AMBASSADOR_MUTE_USER_60MIN;
                            break;
                        case 'ambassador_mute_18hour':
                            messageType = RoomWidgetUserActionMessage.AMBASSADOR_MUTE_USER_18HOUR;
                            break;
                        default:
                            super.handleMouseEvent(event);
                            return;
                    }
                }
            }

            if(messageType)
            {
                message = new RoomWidgetUserActionMessage(messageType, this._userId);
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

    protected getTemplate(): string
    {
        return this._parent.windowManager.getTemplate(WindowTemplates.CONTEXT_MENU_AVATAR_VIEW);
    }

    private get widget(): AvatarInfoWidget
    {
        return this._parent as AvatarInfoWidget;
    }
}