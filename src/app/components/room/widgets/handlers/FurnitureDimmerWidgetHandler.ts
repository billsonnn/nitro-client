import { NitroEvent } from '../../../../../client/core/events/NitroEvent';
import { RoomEngineDimmerStateEvent } from '../../../../../client/nitro/room/events/RoomEngineDimmerStateEvent';
import { RoomEngineTriggerWidgetEvent } from '../../../../../client/nitro/room/events/RoomEngineTriggerWidgetEvent';
import { RoomControllerLevel } from '../../../../../client/nitro/session/enum/RoomControllerLevel';
import { RoomSessionDimmerPresetsEvent } from '../../../../../client/nitro/session/events/RoomSessionDimmerPresetsEvent';
import { IRoomWidgetHandler } from '../../../../../client/nitro/ui/IRoomWidgetHandler';
import { IRoomWidgetHandlerContainer } from '../../../../../client/nitro/ui/IRoomWidgetHandlerContainer';
import { RoomWidgetEnum } from '../../../../../client/nitro/ui/widget/enums/RoomWidgetEnum';
import { RoomWidgetUpdateEvent } from '../../../../../client/nitro/ui/widget/events/RoomWidgetUpdateEvent';
import { RoomWidgetMessage } from '../../../../../client/nitro/ui/widget/messages/RoomWidgetMessage';
import { RoomWidgetDimmerStateUpdateEvent } from '../events/RoomWidgetDimmerStateUpdateEvent';
import { RoomWidgetDimmerUpdateEvent } from '../events/RoomWidgetDimmerUpdateEvent';
import { RoomWidgetDimmerChangeStateMessage } from '../messages/RoomWidgetDimmerChangeStateMessage';
import { RoomWidgetDimmerPreviewMessage } from '../messages/RoomWidgetDimmerPreviewMessage';
import { RoomWidgetDimmerSavePresetMessage } from '../messages/RoomWidgetDimmerSavePresetMessage';
import { RoomWidgetFurniToWidgetMessage } from '../messages/RoomWidgetFurniToWidgetMessage';

export class FurnitureDimmerWidgetHandler implements IRoomWidgetHandler
{
    private _isDisposed: boolean = false;
    private _container: IRoomWidgetHandlerContainer = null;

    public dispose():void
    {
        this._isDisposed    = true;
        this._container     = null;
    }

    public processWidgetMessage(k: RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        switch(k.type)
        {
            case RoomWidgetFurniToWidgetMessage.REQUEST_DIMMER:
                if(this.canOpenWidget())
                {
                    this._container.roomSession.requestMoodlightSettings();
                }
                break;
            case RoomWidgetDimmerSavePresetMessage.RWSDPM_SAVE_PRESET:
                if(this.canOpenWidget())
                {
                    const _local_4 = (k as RoomWidgetDimmerSavePresetMessage);

                    //this._container.roomSession._Str_21317(_local_4._Str_25037, _local_4._Str_24446, _local_4.color, _local_4._Str_5123, _local_4.apply);
                }
                break;
            case RoomWidgetDimmerChangeStateMessage.RWCDSM_CHANGE_STATE:
                if(this.canOpenWidget())
                {
                    //this._container.roomSession._Str_20755();
                }
                break;
            case RoomWidgetDimmerPreviewMessage.RWDPM_PREVIEW_DIMMER_PRESET: {
                const roomId            = this._container.roomSession.roomId;
                const previewMessage    = (k as RoomWidgetDimmerPreviewMessage);

                if(!previewMessage || !this._container.roomEngine) return null;

                this._container.roomEngine._Str_17804(roomId, previewMessage.color, previewMessage._Str_5123, previewMessage._Str_11464);
                break;
            }
        }

        return null;
    }

    public processEvent(event: NitroEvent): void
    {

        switch(event.type)
        {
            case RoomSessionDimmerPresetsEvent.RSDPE_PRESETS: {

                const presetsEvent  = (event as RoomSessionDimmerPresetsEvent);
                const updateEvent   = new RoomWidgetDimmerUpdateEvent(RoomWidgetDimmerUpdateEvent.RWDUE_PRESETS);

                updateEvent.selectedPresetId = presetsEvent.selectedPresetId;

                let i = 0;

                while(i < presetsEvent._Str_10888)
                {
                    const _local_7 = presetsEvent._Str_14989(i);

                    if(_local_7) updateEvent.setPresetValues(_local_7.id, _local_7.type, _local_7.color, _local_7._Str_4272);

                    i++;
                }

                this._container.events.dispatchEvent(updateEvent);

                return;
            }
            case RoomEngineDimmerStateEvent.ROOM_COLOR: {
                const stateEvent = (event as RoomEngineDimmerStateEvent);

                this._container.events.dispatchEvent(new RoomWidgetDimmerStateUpdateEvent(stateEvent.state, stateEvent._Str_14686, stateEvent._Str_6815, stateEvent.color, stateEvent._Str_5123));
                return;
            }
            case RoomEngineTriggerWidgetEvent.REMOVE_DIMMER:
                this._container.events.dispatchEvent(new RoomWidgetDimmerUpdateEvent(RoomWidgetDimmerUpdateEvent.RWDUE_HIDE));
                return;
        }
    }

    public update():void
    {
    }

    private canOpenWidget(): boolean
    {
        return (this._container.roomSession.isRoomOwner || (this._container.roomSession.controllerLevel >= RoomControllerLevel.GUEST) || this._container.sessionDataManager.isModerator);
    }

    public get disposed(): boolean
    {
        return this._isDisposed;
    }

    public get type(): string
    {
        return RoomWidgetEnum.ROOM_DIMMER;
    }

    public set container(k: IRoomWidgetHandlerContainer)
    {
        this._container = k;
    }

    public get messageTypes(): string[]
    {
        return [
            RoomWidgetFurniToWidgetMessage.REQUEST_DIMMER,
            RoomWidgetDimmerSavePresetMessage.RWSDPM_SAVE_PRESET,
            RoomWidgetDimmerChangeStateMessage.RWCDSM_CHANGE_STATE,
            RoomWidgetDimmerPreviewMessage.RWDPM_PREVIEW_DIMMER_PRESET
        ];
    }

    public get eventTypes(): string[]
    {
        return [
            RoomSessionDimmerPresetsEvent.RSDPE_PRESETS,
            RoomEngineDimmerStateEvent.ROOM_COLOR,
            RoomEngineTriggerWidgetEvent.REMOVE_DIMMER
        ];
    }
}
