import { IConnection } from '../../../core/communication/connections/IConnection';
import { NitroEvent } from '../../../core/events/NitroEvent';
import { AvatarFigurePartType } from '../../avatar/enum/AvatarFigurePartType';
import { AvatarScaleType } from '../../avatar/enum/AvatarScaleType';
import { AvatarSetType } from '../../avatar/enum/AvatarSetType';
import { IAvatarImageListener } from '../../avatar/IAvatarImageListener';
import { RoomObjectCategory } from '../../room/object/RoomObjectCategory';
import { RoomObjectType } from '../../room/object/RoomObjectType';
import { RoomSessionChatEvent } from '../../session/events/RoomSessionChatEvent';
import { IRoomWidgetHandler } from '../IRoomWidgetHandler';
import { IRoomWidgetHandlerContainer } from '../IRoomWidgetHandlerContainer';
import { RoomWidgetEnum } from '../widget/enums/RoomWidgetEnum';
import { SystemChatStyleEnum } from '../widget/enums/SystemChatStyleEnum';
import { RoomWidgetChatUpdateEvent } from '../widget/events/RoomWidgetChatUpdateEvent';
import { RoomWidgetUpdateEvent } from '../widget/events/RoomWidgetUpdateEvent';
import { RoomWidgetMessage } from '../widget/messages/RoomWidgetMessage';
import { RoomChatWidget } from '../widget/roomchat/RoomChatWidget';

export class ChatWidgetHandler implements IRoomWidgetHandler, IAvatarImageListener
{
    private _container: IRoomWidgetHandlerContainer;
    private _widget: RoomChatWidget;

    private _connection: IConnection;

    private _avatarColorCache: Map<string, number>;
    private _avatarImageCache: Map<string, PIXI.Texture>;

    private _disposed: boolean;

    constructor()
    {
        this._container         = null;
        this._widget            = null;

        this._connection        = null;

        this._avatarColorCache  = new Map();
        this._avatarImageCache  = new Map();

        this._disposed          = false;
    }

    public dispose(): void
    {
        if(this._disposed) return;

        this._container = null;
        this._widget    = null;
        this._disposed  = true;
    }

    public update(): void
    {

    }

    public processWidgetMessage(message: RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        if(!message || this._disposed) return null;

        switch(message.type)
        {

        }

        return null;
    }

    public processEvent(event: NitroEvent): void
    {
        if(!event || this._disposed) return;

        switch(event.type)
        {
            case RoomSessionChatEvent.CHAT_EVENT:
                const chatEvent = (event as RoomSessionChatEvent);

                const roomObject = this._container.roomEngine.getRoomObject(chatEvent.session.roomId, chatEvent.objectId, RoomObjectCategory.UNIT);

                if(roomObject)
                {
                    const roomGeometry = this._container.roomEngine.getRoomInstanceGeometry(chatEvent.session.roomId, this._container.getFirstCanvasId());

                    if(roomGeometry)
                    {
                        let x   = 0;
                        let y   = 0;

                        const objectLocation    = roomObject.getLocation();
                        const screenPoint       = roomGeometry.getScreenPoint(objectLocation);

                        if(screenPoint)
                        {
                            x = screenPoint.x;
                            y = screenPoint.y;

                            const canvasOffset = this._container.roomEngine.getRoomInstanceRenderingCanvasOffset(chatEvent.session.roomId, this._container.getFirstCanvasId());

                            if(canvasOffset)
                            {
                                x += canvasOffset.x;
                                y += canvasOffset.y;
                            }
                        }

                        const userData = this._container.roomSession.userData.getUserDataByIndex(chatEvent.objectId);

                        let username    = '';
                        let avatarColor = 0;
                        let texture     = null;
                        let chatType    = chatEvent.chatType;
                        let styleId     = chatEvent.style;
                        let userType    = 0;


                        if(userData)
                        {
                            userType = userData.type;

                            const figure = userData.figure;

                            switch(userType)
                            {
                                case RoomObjectType.PET:
                                    break;
                                case RoomObjectType.USER:
                                    texture = this.getUserImage(figure);
                                    break;
                                case RoomObjectType.RENTABLE_BOT:
                                case RoomObjectType.BOT:
                                    styleId = SystemChatStyleEnum.BOT;
                                    break;

                            }

                            avatarColor = this._avatarColorCache.get(figure);
                            username    = userData.name;
                        }

                        const text = chatEvent.message;

                        if(chatType === RoomSessionChatEvent._Str_8971)
                        {
                            // generic hand item
                            console.log('hand item chat');
                        }

                        if(chatType === RoomSessionChatEvent._Str_8909)
                        {
                            console.log('mute timeout chat');
                        }

                        if(((chatType === RoomSessionChatEvent._Str_6065) || (chatType === RoomSessionChatEvent._Str_5998)) || (chatType === RoomSessionChatEvent._Str_5904))
                        {
                            console.log('pet revived chat');

                            if(chatType === RoomSessionChatEvent._Str_5998)
                            {
                                console.log('pet fertilized chat');
                            }
                            else
                            {
                                if(chatType === RoomSessionChatEvent._Str_5904)
                                {
                                    console.log('pet seed fertilized chat');
                                }
                            }
                        }

                        if(this._container && this._container.events) this._container.events.dispatchEvent(new RoomWidgetChatUpdateEvent(RoomWidgetChatUpdateEvent.RWCUE_EVENT_CHAT, userData.roomIndex, text, username, RoomObjectCategory.UNIT, userType, 0, x, y, texture, avatarColor, chatEvent.session.roomId, chatType, styleId, []));

                    }
                }

                return;
        }
    }

    public getUserImage(figure: string): PIXI.Texture
    {
        let existing = this._avatarImageCache.get(figure);

        if(!existing)
        {
            const avatarImage = this._container.avatarRenderManager.createAvatarImage(figure, AvatarScaleType.LARGE, null, this);

            if(avatarImage)
            {
                existing = avatarImage.getCroppedImage(AvatarSetType.HEAD, 0.5);

                const color = avatarImage._Str_867(AvatarFigurePartType.CHEST);

                if(color) this._avatarColorCache.set(figure, color._Str_915);

                avatarImage.dispose();
            }

            if(existing) this._avatarImageCache.set(figure, existing);
        }

        return existing;
    }

    public resetFigure(figure: string): void
    {

    }

    public get type(): string
    {
        return RoomWidgetEnum.CHAT_WIDGET;
    }

    public get messageTypes(): string[]
    {
        return [ ];
    }

    public get eventTypes(): string[]
    {
        return [ RoomSessionChatEvent.CHAT_EVENT ];
    }

    public get container(): IRoomWidgetHandlerContainer
    {
        return this._container;
    }

    public set container(container: IRoomWidgetHandlerContainer)
    {
        this._container = container;
    }

    public get widget(): RoomChatWidget
    {
        return this._widget;
    }

    public set widget(widget: RoomChatWidget)
    {
        this._widget = widget;
    }

    public get connection(): IConnection
    {
        return this._connection;
    }

    public set connection(connection: IConnection)
    {
        this._connection = connection;
    }

    public get disposed(): boolean
    {
        return this._disposed;
    }
}