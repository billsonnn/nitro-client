import { NitroEvent } from '../../../core/events/NitroEvent';
import { RoomGeometry } from '../../../room/utils/RoomGeometry';
import { Vector3d } from '../../../room/utils/Vector3d';
import { Nitro } from '../../Nitro';
import { RoomZoomEvent } from '../../room/events/RoomZoomEvent';
import { IRoomWidgetHandler } from '../IRoomWidgetHandler';
import { IRoomWidgetHandlerContainer } from '../IRoomWidgetHandlerContainer';
import { ChatInputWidget } from '../widget/chatinput/ChatInputWidget';
import { RoomWidgetEnum } from '../widget/enums/RoomWidgetEnum';
import { RoomWidgetUpdateEvent } from '../widget/events/RoomWidgetUpdateEvent';
import { RoomWidgetChatMessage } from '../widget/messages/RoomWidgetChatMessage';
import { RoomWidgetChatSelectAvatarMessage } from '../widget/messages/RoomWidgetChatSelectAvatarMessage';
import { RoomWidgetChatTypingMessage } from '../widget/messages/RoomWidgetChatTypingMessage';
import { RoomWidgetMessage } from '../widget/messages/RoomWidgetMessage';

export class ChatInputWidgetHandler implements IRoomWidgetHandler
{
    private static TIME_BETWEEN_SPIN: number = 10;

    private _container: IRoomWidgetHandlerContainer;
    private _mouseToggle: boolean;
    private _widget: ChatInputWidget;

    private _isSpinning: boolean;
    private _lastSpin: number;
    private _isOpposite: boolean;

    private _disposed: boolean;

    constructor()
    {
        this._container     = null;
        this._mouseToggle   = true;
        this._widget        = null;

        this._isSpinning    = false;
        this._lastSpin      = -1;
        this._isOpposite    = false;

        this._disposed      = false;
    }

    public dispose(): void
    {
        if(this._disposed) return;

        this._container     = null;
        this._widget        = null;
        this._disposed      = true;
    }

    public update(): void
    {
        if(this._isSpinning)
        {
            if(this._lastSpin)
            {
                if((Nitro.instance.time - this._lastSpin) >= ChatInputWidgetHandler.TIME_BETWEEN_SPIN)
                {
                    this._lastSpin = Nitro.instance.time;

                    const geometry = (this._container.roomEngine.getRoomInstanceGeometry(this._container.roomEngine.activeRoomId) as RoomGeometry);

                    if(geometry)
                    {
                        const currentLocation   = geometry.location;
                        const currentDirection  = geometry.direction;

                        let nextDirectionX = currentDirection.x;
                        let nextLocationX  = 1;

                        nextDirectionX++;

                        if(nextDirectionX === 361)
                        {
                            nextDirectionX = -360;
                        }

                        if(nextDirectionX < 0) nextLocationX = -1;

                        let nextDirectionY  = currentDirection.y;
                        let nextLocationY   = 0;

                        // nextDirectionY++;

                        // if(nextDirectionY === 361)
                        // {
                        //     nextDirectionY = -360;
                        // }

                        // if(nextDirectionY < 0) nextLocationY = -1;

                        geometry.direction = new Vector3d(nextDirectionX, nextDirectionY, currentDirection.z);

                        geometry.adjustLocation(new Vector3d(nextLocationX, nextLocationY), 0);

                        //if(Math.abs(geometry.direction.x) === Math.abs(360)) this._isOpposite = !this._isOpposite;
                        //geometry.adjustLocation(new Vector3d(1), 0);
                    }
                }
            }
        }
    }

    public processWidgetMessage(message: RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        if(!message || this.disposed) return null;

        let widgetMessage: RoomWidgetMessage = null;

        switch(message.type)
        {
            case RoomWidgetChatTypingMessage.TYPING_STATUS:
                let typingMessage = (message as RoomWidgetChatTypingMessage);

                this._container.roomSession.sendChatTypingMessage(typingMessage.isTyping);
                break;
            case RoomWidgetChatMessage.MESSAGE_CHAT:
                let chatMessage = (message as RoomWidgetChatMessage);

                if(chatMessage.text === '') return null;

                let text    = chatMessage.text;
                let parts   = chatMessage.text.split(' ');

                if(parts.length > 0)
                {
                    let firstPart   = parts[0];
                    let secondPart  = '';

                    if(parts.length > 1) secondPart = parts[1];

                    if((firstPart.charAt(0) === ':') && (secondPart === 'x'))
                    {
                        const selectedAvatarId = this._container.roomEngine.selectedAvatarId;

                        if(selectedAvatarId > -1)
                        {
                            const userData = this._container.roomSession.userDataManager.getUserDataByIndex(selectedAvatarId);

                            if(userData)
                            {
                                secondPart  = userData.name;
                                text        = chatMessage.text.replace(' x', (' ' + userData.name));
                            }
                        }
                    }

                    switch(firstPart.toLowerCase())
                    {
                        case ':zoom':
                            this._container.roomEngine.events.dispatchEvent(new RoomZoomEvent(this._container.roomEngine.activeRoomId, parseInt(secondPart)));
                            return null;
                        case ':spinroom':
                            this._isSpinning = !this._isSpinning;
                            return null;
                    }
                }

                let styleId = chatMessage.styleId;

                if(this._container && this._container.roomSession)
                {
                    switch(chatMessage.chatType)
                    {
                        case RoomWidgetChatMessage.CHAT_DEFAULT:
                            this._container.roomSession.sendChatMessage(text, styleId);
                            break;
                        case RoomWidgetChatMessage.CHAT_SHOUT:
                            this._container.roomSession.sendShoutMessage(text, styleId);
                            break;
                        case RoomWidgetChatMessage.CHAT_WHISPER:
                            this._container.roomSession.sendWhisperMessage(chatMessage.recipientName, text, styleId);
                            break;
                    }
                }
                break;
            case RoomWidgetChatSelectAvatarMessage.MESSAGE_SELECT_AVATAR:
                widgetMessage = message;
                break;
        }

        return null;
    }

    public processEvent(event: NitroEvent): void
    {
        if(!event || this._disposed) return;
    }

    public get type(): string
    {
        return RoomWidgetEnum.CHAT_INPUT_WIDGET;
    }

    public get messageTypes(): string[]
    {
        return [ RoomWidgetChatTypingMessage.TYPING_STATUS, RoomWidgetChatMessage.MESSAGE_CHAT, RoomWidgetChatSelectAvatarMessage.MESSAGE_SELECT_AVATAR ];
    }

    public get eventTypes(): string[]
    {
        return [ ];
    }

    public get container(): IRoomWidgetHandlerContainer
    {
        return this._container;
    }

    public set container(container: IRoomWidgetHandlerContainer)
    {
        this._container = container;
    }

    public get widget(): ChatInputWidget
    {
        return this._widget;
    }

    public set widget(widget: ChatInputWidget)
    {
        this._widget = widget;
    }

    public get disposed(): boolean
    {
        return this._disposed;
    }
}