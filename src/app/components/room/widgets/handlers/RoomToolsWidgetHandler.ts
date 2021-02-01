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
import { INitroCommunicationManager } from '../../../../../client/nitro/communication/INitroCommunicationManager';
import { RoomZoomEvent } from '../../../../../client/nitro/room/events/RoomZoomEvent';
import { RoomWidgetZoomToggleMessage } from '../messages/RoomWidgetZoomToggleMessage';
import { RoomDataParser } from '../../../../../client/nitro/communication/messages/parser/room/data/RoomDataParser';
import { RoomLikeRoomComposer } from '../../../../../client/nitro/communication/messages/outgoing/room/action/RoomLikeRoomComposer';

export class RoomToolsWidgetHandler implements IRoomWidgetHandler
{
    private _container: IRoomWidgetHandlerContainer; // private var _container:IRoomWidgetHandlerContainer;
    private _communicationManager: INitroCommunicationManager; // private var _communicationManager:IHabboCommunicationManager;
    private _widget: RoomToolsMainComponent; //private var _widget:RoomToolsWidget;
    private _messages: IMessageEvent[]; //private var _communicationManagerMessageEvents:Vector.<IMessageEvent>;
    // Dont need IHabboNavigator;
    private _disposed: boolean; //private var _disposed:Boolean;
    private _zoomed: boolean = false;

    constructor()
    {
        this._communicationManager = Nitro.instance.communication;
        this._container = null;
        this._widget = null;
        this._messages = [];
        this._disposed = false;

        this.onRoomInfoEvent = this.onRoomInfoEvent.bind(this);
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

        this._communicationManager = null;
        this._widget     = null;

        for(const message of this._messages)
        {
            this._container.connection.removeMessageEvent(message);
        }
        this._container  = null;


        this._messages = [];

        this._disposed   = true;
    }

    public update(): void
    {
    }

    public processWidgetMessage(message: RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        if(message instanceof RoomWidgetZoomToggleMessage)
        {
            this._container.roomEngine.events.dispatchEvent(new RoomZoomEvent(this._container.roomEngine.activeRoomId, this._zoomed ? 1 : 0, false));
            this._zoomed = !this._zoomed;

        }
        return null;
    }

    public processEvent(event: NitroEvent): void
    {
        if(!event || this._disposed) return;
    }

    // _Str_4428
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

        this._widget.loadRoomData(roomData, roomOwner);
        this._widget._Str_22970(roomData);
        this._widget._Str_23696(roomData.roomId);
    }

    public rateRoom(): void
    {
        if(!this._container) return;

        this._container.connection.send(new RoomLikeRoomComposer(1));
    }

    // Done
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

        this._container = container;

        if(this._container)
        {
            this._messages = [ new RoomInfoEvent(this.onRoomInfoEvent) ];

            for(const message of this._messages)
            {
                container.connection.addMessageEvent(message);
            }
        }
    }

    public get disposed(): boolean
    {
        return this._disposed;
    }
}
