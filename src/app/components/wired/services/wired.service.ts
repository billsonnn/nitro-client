import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { IMessageEvent } from '../../../../client/core/communication/messages/IMessageEvent';
import { DesktopViewEvent } from '../../../../client/nitro/communication/messages/incoming/desktop/DesktopViewEvent';
import { WiredFurniActionEvent } from '../../../../client/nitro/communication/messages/incoming/roomevents/WiredFurniActionEvent';
import { WiredFurniConditionEvent } from '../../../../client/nitro/communication/messages/incoming/roomevents/WiredFurniConditionEvent';
import { WiredFurniTriggerEvent } from '../../../../client/nitro/communication/messages/incoming/roomevents/WiredFurniTriggerEvent';
import { WiredOpenEvent } from '../../../../client/nitro/communication/messages/incoming/roomevents/WiredOpenEvent';
import { WiredRewardResultMessageEvent } from '../../../../client/nitro/communication/messages/incoming/roomevents/WiredRewardResultMessageEvent';
import { WiredSaveSuccessEvent } from '../../../../client/nitro/communication/messages/incoming/roomevents/WiredSaveSuccessEvent';
import { WiredValidationErrorEvent } from '../../../../client/nitro/communication/messages/incoming/roomevents/WiredValidationErrorEvent';
import { Nitro } from '../../../../client/nitro/Nitro';
import { IRoomEngineServices } from '../../../../client/nitro/room/IRoomEngineServices';
import { RoomSessionEvent } from '../../../../client/nitro/session/events/RoomSessionEvent';
import { IRoomSession } from '../../../../client/nitro/session/IRoomSession';
import { SettingsService } from '../../../core/settings/service';
import { WiredMainComponent } from '../components/main/main.component';

@Injectable()
export class WiredService implements OnDestroy
{
    private _component: WiredMainComponent;
    private _roomSession: IRoomSession;

    private _messages: IMessageEvent[] = [];

    constructor(
        private _settingsService: SettingsService,
        private _ngZone: NgZone)
    {
        this._component     = null;
        this._roomSession   = null;

        this.registerMessages();
    }

    public ngOnDestroy(): void
    {
        this.unregisterMessages();
    }

    private registerMessages(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            Nitro.instance.roomSessionManager.events.addEventListener(RoomSessionEvent.CREATED, this.onRoomSessionEvent.bind(this));
            Nitro.instance.roomSessionManager.events.addEventListener(RoomSessionEvent.STARTED, this.onRoomSessionEvent.bind(this));
            Nitro.instance.roomSessionManager.events.addEventListener(RoomSessionEvent.ENDED, this.onRoomSessionEvent.bind(this));

            this._messages = [
                new WiredFurniActionEvent(this.onWiredFurniActionEvent.bind(this)),
                new WiredFurniConditionEvent(this.onWiredFurniConditionEvent.bind(this)),
                new WiredFurniTriggerEvent(this.onWiredFurniTriggerEvent.bind(this)),
                new WiredOpenEvent(this.onWiredOpenEvent.bind(this)),
                new WiredRewardResultMessageEvent(this.onWiredRewardResultMessageEvent.bind(this)),
                new WiredSaveSuccessEvent(this.onWiredSaveSuccessEvent.bind(this)),
                new WiredValidationErrorEvent(this.onWiredValidationErrorEvent.bind(this)),
                new DesktopViewEvent(this.onDesktopViewEvent.bind(this)),
            ];

            for(let message of this._messages) Nitro.instance.communication.registerMessageEvent(message);
        });
    }

    public unregisterMessages(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            Nitro.instance.roomSessionManager.events.removeEventListener(RoomSessionEvent.CREATED, this.onRoomSessionEvent.bind(this));
            Nitro.instance.roomSessionManager.events.removeEventListener(RoomSessionEvent.STARTED, this.onRoomSessionEvent.bind(this));
            Nitro.instance.roomSessionManager.events.removeEventListener(RoomSessionEvent.ENDED, this.onRoomSessionEvent.bind(this));

            for(let message of this._messages) Nitro.instance.communication.removeMessageEvent(message);

            this._messages = [];
        });
    }

    private onRoomSessionEvent(event: RoomSessionEvent): void
    {
        if(!event) return;

        switch(event.type)
		{
			case RoomSessionEvent.CREATED:
            case RoomSessionEvent.STARTED:
                this._roomSession = event.session;
                return;
            case RoomSessionEvent.ENDED:
                this._roomSession = null;

                this._ngZone.run(() => (this._component && this._component.close()));
				return;
        }
    }

    private onWiredFurniActionEvent(event: WiredFurniActionEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        console.log(parser);
    }

    private onWiredFurniConditionEvent(event: WiredFurniConditionEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._ngZone.run(() => this._component.setupTrigger(parser.definition));
    }

    private onWiredFurniTriggerEvent(event: WiredFurniTriggerEvent): void
    {
        if(!event || !this._component) return;

        const parser = event.getParser();

        if(!parser) return;

        this._ngZone.run(() => this._component.setupTrigger(parser.definition));
    }

    private onWiredOpenEvent(event: WiredOpenEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        console.log(parser);
    }

    private onWiredRewardResultMessageEvent(event: WiredRewardResultMessageEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        console.log(parser);
    }

    private onWiredSaveSuccessEvent(event: WiredSaveSuccessEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._ngZone.run(() => (this._component && this._component.close()));
    }

    private onWiredValidationErrorEvent(event: WiredValidationErrorEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        console.log(parser);
    }

    private onDesktopViewEvent(event: DesktopViewEvent): void
    {
        if(!event) return;

        this._ngZone.run(() => (this._component && this._component.close()));
    }

    public selectFurniture(objectId: number, type: string):void
    {
        const roomEngine = (<unknown> Nitro.instance.roomEngine as IRoomEngineServices);

        const selectedData = roomEngine.getSelectedRoomObjectData(this.roomId);

        if(selectedData && (selectedData.id === -(objectId)))
        {
            roomEngine.setPlacedRoomObjectData(this.roomId, null);

            return;
        }

        (this._component && this._component.toggleFurniSelected(objectId, type));
    }

    public get component(): WiredMainComponent
    {
        return this._component;
    }

    public set component(component: WiredMainComponent)
    {
        this._component = component;
    }

    public get roomId(): number
    {
        return (this._roomSession ? this._roomSession.roomId : 0);
    }
}