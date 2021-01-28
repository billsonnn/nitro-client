import { NitroEvent } from '../../../../../client/core/events/NitroEvent';
import { Nitro } from '../../../../../client/nitro/Nitro';
import { RoomObjectCategory } from '../../../../../client/nitro/room/object/RoomObjectCategory';
import { RoomObjectVariable } from '../../../../../client/nitro/room/object/RoomObjectVariable';
import { IRoomWidgetHandler } from '../../../../../client/nitro/ui/IRoomWidgetHandler';
import { IRoomWidgetHandlerContainer } from '../../../../../client/nitro/ui/IRoomWidgetHandlerContainer';
import { RoomWidgetEnum } from '../../../../../client/nitro/ui/widget/enums/RoomWidgetEnum';
import { RoomWidgetUpdateEvent } from '../../../../../client/nitro/ui/widget/events/RoomWidgetUpdateEvent';
import { RoomWidgetMessage } from '../../../../../client/nitro/ui/widget/messages/RoomWidgetMessage';
import * as sorting from '../../../../../utils/sorting';
import { RoomObjectItem } from '../events/RoomObjectItem';
import { RoomWidgetChooserContentEvent } from '../events/RoomWidgetChooserContentEvent';
import { RoomWidgetRequestWidgetMessage } from '../messages/RoomWidgetRequestWidgetMessage';
import { RoomWidgetRoomObjectMessage } from '../messages/RoomWidgetRoomObjectMessage';
import { RoomWidgetFurniToWidgetMessage } from '../messages/RoomWidgetFurniToWidgetMessage';
import { RoomWidgetStickieSendUpdateMessage } from '../messages/RoomWidgetStickieSendUpdateMessage';
import { RoomWidgetStickieDataUpdateEvent } from '../events/RoomWidgetStickieDataUpdateEvent';

export class FurnitureStickieHandler implements IRoomWidgetHandler
{
    private _isDisposed: boolean = false;
    private _container: IRoomWidgetHandlerContainer = null;

    public dispose(): void
    {
        this._isDisposed = true;
        this._container = null;
    }

    public processWidgetMessage(k: RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        if(!k) return null;

        switch(k.type)
        {
            case RoomWidgetFurniToWidgetMessage.REQUEST_STICKIE: {

                const event = <RoomWidgetFurniToWidgetMessage>k;
                if(!event) return null;

                const furni = this._container.roomEngine.getRoomObject(event.roomId, event.objectId, event.category);
                if(!furni) return null;

                const model = furni.model;
                if(!model) return null;

                const local7 = <string>model.getValue(RoomObjectVariable.FURNITURE_ITEMDATA);
                if(local7.length < 6) return null;

                let local8 = null;
                let local9 = '';
                if(local7.indexOf(' ' ) > 0)
                {
                    local8 = local7.slice(0, local7.indexOf(' '));
                    local9 = local7.slice((local7.indexOf(' ') + 1), local7.length);
                }
                else
                {
                    local8 = local7;
                }

                // TODO: is this level? god mode?

                const local10 = this._container.roomSession.isRoomOwner || this._container.sessionDataManager.securityLevel == 5;
                this._container.events.dispatchEvent(new RoomWidgetStickieDataUpdateEvent(RoomWidgetStickieDataUpdateEvent.RWSDUE_STICKIE_DATA, event.objectId, furni.type, local9, local8, local10));

            }
                break;
            case RoomWidgetStickieSendUpdateMessage.SEND_UPDATE: {
                const event = <RoomWidgetStickieSendUpdateMessage>k;
                if(!event) return null;

                this._container.roomEngine.modifyRoomObjectData(event.objectId, RoomObjectCategory.WALL, event.colorHex, event.text);
            }
                break;
            case RoomWidgetStickieSendUpdateMessage.SEND_DELETE: {
                const event = <RoomWidgetStickieSendUpdateMessage>k;
                if(!event) return null;

                this._container.roomEngine.deleteRoomObject(event.objectId, RoomObjectCategory.WALL);
            }
                break;
        }

        return null;
    }


    public processEvent(event: NitroEvent): void
    {
        return;
    }

    public update(): void
    {
    }


    public get disposed(): boolean
    {
        return this._isDisposed;
    }

    public get type(): string
    {
        return RoomWidgetEnum.FURNI_STICKIE_WIDGET;
    }

    public set container(k: IRoomWidgetHandlerContainer)
    {
        this._container = k;
    }

    public get messageTypes(): string[]
    {
        return [
            RoomWidgetFurniToWidgetMessage.REQUEST_STICKIE,
            RoomWidgetStickieSendUpdateMessage.SEND_DELETE,
            RoomWidgetStickieSendUpdateMessage.SEND_UPDATE
        ];
    }

    public get eventTypes(): string[]
    {
        return [];
    }
}
