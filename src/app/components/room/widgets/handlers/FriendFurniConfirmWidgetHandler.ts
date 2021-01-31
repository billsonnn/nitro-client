import { NitroEvent } from '../../../../../client/core/events/NitroEvent';
import { RoomObjectVariable } from '../../../../../client/nitro/room/object/RoomObjectVariable';
import { IRoomWidgetHandler } from '../../../../../client/nitro/ui/IRoomWidgetHandler';
import { IRoomWidgetHandlerContainer } from '../../../../../client/nitro/ui/IRoomWidgetHandlerContainer';
import { RoomWidgetEnum } from '../../../../../client/nitro/ui/widget/enums/RoomWidgetEnum';
import { RoomWidgetUpdateEvent } from '../../../../../client/nitro/ui/widget/events/RoomWidgetUpdateEvent';
import { RoomWidgetMessage } from '../../../../../client/nitro/ui/widget/messages/RoomWidgetMessage';
import { RoomWidgetTrophyUpdateEvent } from '../events/RoomWidgetTrophyUpdateEvent';
import { RoomWidgetFurniToWidgetMessage } from '../messages/RoomWidgetFurniToWidgetMessage';
import { LoveLockStartConfirmComposer } from '../../../../../client/nitro/communication/messages/outgoing/room/furniture/logic/LoveLockStartConfirmComposer';
import { RoomInfoEvent } from '../../../../../client/nitro/communication/messages/incoming/room/data/RoomInfoEvent';
import { IMessageEvent } from '../../../../../client/core/communication/messages/IMessageEvent';
import { LoveLockFurniStartEvent } from '../../../../../client/nitro/communication/messages/incoming/room/furniture/LoveLockFurniStartEvent';
import { LoveLockFurniFriendConfirmedEvent } from '../../../../../client/nitro/communication/messages/incoming/room/furniture/LoveLockFurniFriendConfirmedEvent';
import { LoveLockFurniFinishedEvent } from '../../../../../client/nitro/communication/messages/incoming/room/furniture/LoveLockFurniFinishedEvent';

export class FriendFurniConfirmWidgetHandler implements IRoomWidgetHandler
{
    private _container: IRoomWidgetHandlerContainer = null;
    private _disposed: boolean = false;
    private _messages: IMessageEvent[];
    // private _widget:FriendFurniConfirmWidget;

    constructor()
    {
    }

    public dispose(): void
    {
        this._container = null;
        this._disposed = true;
    }

    public processEvent(event: NitroEvent): void
    {
        debugger;
        return;
    }

    public processWidgetMessage(message: RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        return null;
    }

    public _Str_17138(furniId: number, confirmed: boolean): void
    {
        if(this._container == null || this._disposed) {
            return;
        }
        this._container.connection.send(new LoveLockStartConfirmComposer(furniId, confirmed));
    }

    public update(): void
    {
    }

    public get disposed(): boolean
    {
        return this._disposed;
    }

    public get type(): string
    {
        return '';
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
            this._messages = [
                new LoveLockFurniStartEvent(this.onLoveLockFurniStartEvent.bind(this)),
                new LoveLockFurniFriendConfirmedEvent(this.onLoveLockFurniFriendConfirmedEvent.bind(this)),
                new LoveLockFurniFinishedEvent(this.onLoveLockFurniFinishedEvent.bind(this))
            ];

            for(const message of this._messages) container.connection.addMessageEvent(message);
        }
    }

    public startConfirmation(furniId: number, confirmed: boolean): void
    {
        debugger;
        this._container.connection.send(new LoveLockStartConfirmComposer(furniId, confirmed));
    }

    private onLoveLockFurniStartEvent(event: LoveLockFurniStartEvent)
    {
        debugger;
        // do things
    }

    private onLoveLockFurniFinishedEvent(event: LoveLockFurniFinishedEvent)
    {
        debugger;
        // do things
    }

    private onLoveLockFurniFriendConfirmedEvent(event: LoveLockFurniFriendConfirmedEvent)
    {
        debugger;
        // do things
    }

    public get messageTypes(): string[]
    {
        return [ ];
    }

    public get eventTypes(): string[]
    {
        return [ ];
    }
}
