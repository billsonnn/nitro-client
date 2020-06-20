import { NitroEvent } from '../../../core/events/NitroEvent';
import { IRoomWidgetHandler } from '../IRoomWidgetHandler';
import { IRoomWidgetHandlerContainer } from '../IRoomWidgetHandlerContainer';
import { RoomWidgetEnum } from '../widget/enums/RoomWidgetEnum';
import { RoomWidgetUpdateEvent } from '../widget/events/RoomWidgetUpdateEvent';
import { RoomWidgetConversionPointMessage } from '../widget/messages/RoomWidgetConversionPointMessage';
import { RoomWidgetMessage } from '../widget/messages/RoomWidgetMessage';

export class ConversionPointWidgetHandler implements IRoomWidgetHandler
{
    private _isDisposed: boolean = false;
    private _container:IRoomWidgetHandlerContainer = null;

    public get disposed(): boolean
    {
        return this._isDisposed;
    }

    public get type(): string
    {
        return RoomWidgetEnum.CONVERSION_TRACKING;
    }

    public set container(k: IRoomWidgetHandlerContainer)
    {
        this._container = k;
    }

    public dispose(): void
    {
        this._isDisposed = true;
        this._container = null;
    }

    public get messageTypes(): string[]
    {
        return [RoomWidgetConversionPointMessage.RWCPM_CONVERSION_POINT];
    }

    public processWidgetMessage(k:RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        switch (k.type)
        {
            case RoomWidgetConversionPointMessage.RWCPM_CONVERSION_POINT:
                const _local_2 = (k as RoomWidgetConversionPointMessage);
                if (_local_2 == null)
                {
                    return null;
                }
                //this._container.roomSession._Str_21689(_local_2.category, _local_2._Str_23854, _local_2.action, _local_2._Str_22656, _local_2._Str_24399);
                break;
        }

        return null;
    }

    public get eventTypes(): string[]
    {
        return [];
    }

    public processEvent(k: NitroEvent): void
    {
    }

    public update(): void
    {
    }
}