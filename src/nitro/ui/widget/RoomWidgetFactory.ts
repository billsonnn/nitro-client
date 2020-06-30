import { IRoomWidgetFactory } from '../IRoomWidgetFactory';
import { IRoomWidgetHandler } from '../IRoomWidgetHandler';
import { RoomUI } from '../RoomUI';
import { AvatarInfoWidget } from './avatarinfo/AvatarInfoWidget';
import { ChatInputWidget } from './chatinput/ChatInputWidget';
import { RoomWidgetEnum } from './enums/RoomWidgetEnum';
import { TrophyFurniWidget } from './furniture/trophy/TrophyFurniWidget';
import { InfoStandWidget } from './infostand/InfoStandWidget';
import { IRoomWidget } from './IRoomWidget';
import { RoomChatWidget } from './roomchat/RoomChatWidget';

export class RoomWidgetFactory implements IRoomWidgetFactory
{
    private _roomUI: RoomUI;

    constructor(roomUI: RoomUI)
    {
        this._roomUI = roomUI;
    }

    public dispose(): void
    {
        this._roomUI = null;
    }

    public createWidget(type: string, handler: IRoomWidgetHandler): IRoomWidget
    {
        const desktop = this._roomUI.getDesktop('hard_coded_room_id');

        switch(type)
        {
            case RoomWidgetEnum.AVATAR_INFO:
                return new AvatarInfoWidget(handler, this._roomUI.windowManager, desktop.layoutManager);
            case RoomWidgetEnum.CHAT_WIDGET:
                return new RoomChatWidget(handler, this._roomUI.windowManager, desktop.layoutManager);
            case RoomWidgetEnum.CHAT_INPUT_WIDGET:
                return new ChatInputWidget(handler, this._roomUI.windowManager, desktop.layoutManager, this._roomUI, desktop);
            case RoomWidgetEnum.INFOSTAND:
                return new InfoStandWidget(handler, this._roomUI.windowManager, desktop.layoutManager);
            case RoomWidgetEnum.FURNI_TROPHY_WIDGET:
                return new TrophyFurniWidget(handler, this._roomUI.windowManager, desktop.layoutManager);
        }

        return null;
    }
}