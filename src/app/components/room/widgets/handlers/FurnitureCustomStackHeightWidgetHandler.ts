﻿import { IMessageEvent } from '../../../../../client/core/communication/messages/IMessageEvent';
import { NitroEvent } from '../../../../../client/core/events/NitroEvent';
import { FurnitureStackHeightEvent } from '../../../../../client/nitro/communication/messages/incoming/room/furniture/FurnitureStackHeightEvent';
import { RoomEngineTriggerWidgetEvent } from '../../../../../client/nitro/room/events/RoomEngineTriggerWidgetEvent';
import { RoomControllerLevel } from '../../../../../client/nitro/session/enum/RoomControllerLevel';
import { IRoomWidgetHandler } from '../../../../../client/nitro/ui/IRoomWidgetHandler';
import { IRoomWidgetHandlerContainer } from '../../../../../client/nitro/ui/IRoomWidgetHandlerContainer';
import { RoomWidgetEnum } from '../../../../../client/nitro/ui/widget/enums/RoomWidgetEnum';
import { RoomWidgetUpdateEvent } from '../../../../../client/nitro/ui/widget/events/RoomWidgetUpdateEvent';
import { RoomWidgetMessage } from '../../../../../client/nitro/ui/widget/messages/RoomWidgetMessage';
import { IRoomObject } from '../../../../../client/room/object/IRoomObject';
import { CustomStackHeightComponent } from '../furniture/customstackheight/component';

export class FurnitureCustomStackHeightWidgetHandler implements IRoomWidgetHandler 
{
    private _container: IRoomWidgetHandlerContainer = null;
    private _widget: CustomStackHeightComponent     = null;
    private _lastFurniId: number                    = -1;
    private _messages: IMessageEvent[]              = [];

    public dispose(): void
    {
        this._container = null;
        this._widget = null;
    }

    public processWidgetMessage(k: RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        return null;
    }

    public processEvent(event: NitroEvent): void
    {
        if(!event) return;

        let widgetEvent: RoomEngineTriggerWidgetEvent = null;

        switch (event.type)
        {
            case RoomEngineTriggerWidgetEvent.OPEN_WIDGET:
                widgetEvent = (event as RoomEngineTriggerWidgetEvent);

                if(widgetEvent && this._container.roomEngine && this._widget)
                {
                    this._lastFurniId = widgetEvent.objectId;

                    const roomObject = this._container.roomEngine.getRoomObject(widgetEvent.roomId, widgetEvent.objectId, widgetEvent.category);

                    if(roomObject && this.canManipulateRoomObject(roomObject))
                    {
                        this._widget.open(this._lastFurniId, roomObject.getLocation().z);
                    }
                }

                return;
            case RoomEngineTriggerWidgetEvent.CLOSE_WIDGET:
                widgetEvent = (event as RoomEngineTriggerWidgetEvent);

                if(widgetEvent && this._container.roomEngine && this._widget)
                {
                    if(this._lastFurniId === widgetEvent.objectId) this._widget.hide();
                }

                return;
        }
    }

    public update(): void
    {
    }

    public get disposed(): boolean
    {
        return !!this._container;
    }

    public get type(): string
    {
        return RoomWidgetEnum.CUSTOM_STACK_HEIGHT;
    }

    public get container(): IRoomWidgetHandlerContainer
    {
        return this._container;
    }

    public set container(k: IRoomWidgetHandlerContainer)
    {
        if(k !== this._container)
        {
            if(this._container)
            {
                for(let message of this._messages) this._container.connection.removeMessageEvent(message);

                this._messages = [];
            }

            const message = new FurnitureStackHeightEvent(this.onFurnitureStackHeightEvent.bind(this));

            this._messages.push(message);

            k.connection.addMessageEvent(message);
        }

        this._container = k;
    }

    public get messageTypes(): string[]
    {
        return [];
    }

    public get eventTypes(): string[]
    {
        return [];
    }

    public get widget(): CustomStackHeightComponent
    {
        return this._widget;
    }

    public set widget(widget: CustomStackHeightComponent)
    {
        this._widget = widget;
    }

    private onFurnitureStackHeightEvent(event: FurnitureStackHeightEvent):void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        if(this._widget && this.canManipulateRoomObject()) this._widget.update(parser.furniId, parser.height);
    }

    private canManipulateRoomObject(roomObject: IRoomObject = null): boolean
    {
        const isRoomOwner           = this._container.roomSession.isRoomOwner;
        const hasControllerLevel    = (this._container.roomSession.controllerLevel >= RoomControllerLevel.GUEST);
        const isModerator           = this._container.sessionDataManager.isModerator;
        const isOwner               = (roomObject && this._container.isOwnerOfFurniture(roomObject));

        return (((isRoomOwner) || (isModerator)) || (hasControllerLevel)) || (isOwner);
    }
}