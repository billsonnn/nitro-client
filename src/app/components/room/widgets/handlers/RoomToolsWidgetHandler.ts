import { IMessageEvent } from '../../../../../client/core/communication/messages/IMessageEvent';
import { NitroEvent } from '../../../../../client/core/events/NitroEvent';
import { RoomInfoEvent } from '../../../../../client/nitro/communication/messages/incoming/room/data/RoomInfoEvent';
import { Nitro } from '../../../../../client/nitro/Nitro';
import { IRoomWidgetHandler } from '../../../../../client/nitro/ui/IRoomWidgetHandler';
import { IRoomWidgetHandlerContainer } from '../../../../../client/nitro/ui/IRoomWidgetHandlerContainer';
import { RoomWidgetEnum } from '../../../../../client/nitro/ui/widget/enums/RoomWidgetEnum';
import { RoomWidgetUpdateEvent } from '../../../../../client/nitro/ui/widget/events/RoomWidgetUpdateEvent';
import { RoomWidgetMessage } from '../../../../../client/nitro/ui/widget/messages/RoomWidgetMessage';
import { RoomToolsMainComponent } from '../roomtools/main/main.component';

export class RoomToolsWidgetHandler implements IRoomWidgetHandler
{
    private _container: IRoomWidgetHandlerContainer;
    private _widget: RoomToolsMainComponent;
    private _messages: IMessageEvent[];

    private _disposed: boolean;

    constructor()
    {
        this._container  = null;
        this._widget     = null;
        this._messages   = [];
        this._disposed   = false;
        Nitro.instance.communication.registerMessageEvent(new RoomInfoEvent(this.onRoomInfoEvent.bind(this)));
    }

    public set widget(widget: RoomToolsMainComponent)
    {
        this._widget = widget;
    }

    public get widget(): RoomToolsMainComponent
    {
        return this._widget;
    }

    public dispose(): void
    {
        if(this._disposed) return;

        this._container  = null;
        this._widget     = null;
        this._messages   = [];
        this._disposed   = false;
    }

    public update(): void
    {
    }

    public processWidgetMessage(message: RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        return null;
    }

    public processEvent(event: NitroEvent): void
    {
        if(!event || this._disposed) return;
    }

    private onRoomInfoEvent(event: RoomInfoEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        const roomData = parser.data;

        if(!roomData) return;

        const roomOwner = parser.staffPick || parser.data.officialRoomPicRef ?
            Nitro.instance.localization.getValue('room.tool.public.room')
            : Nitro.instance.localization.getValue('room.tool.room.owner.prefix') + ' ' + roomData.ownerName;

        this._widget.loadRoomData(roomData.roomId, roomData.roomName, roomOwner);
    }

    public get type(): string
    {
        return RoomWidgetEnum.ROOM_TOOLS;
    }

    public get messageTypes(): string[]
    {
        return [ ];
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
        if(container !== this._container)
        {
            if(this._container)
            {
                for(const message of this._messages) this._container.connection.removeMessageEvent(message);

                this._messages = [];
            }
        }

        this._container = container;

        if(this._container)
        {
            this._messages = [ new RoomInfoEvent(this.onRoomInfoEvent.bind(this)) ];

            for(const message of this._messages) container.connection.addMessageEvent(message);
        }
    }

    public get disposed(): boolean
    {
        return this._disposed;
    }
}
