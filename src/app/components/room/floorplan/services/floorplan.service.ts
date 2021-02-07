import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { IMessageEvent } from '../../../../../client/core/communication/messages/IMessageEvent';
import { RoomBlockedTilesEvent } from '../../../../../client/nitro/communication/messages/incoming/room/mapping/RoomBlockedTilesEvent';
import { RoomDoorEvent } from '../../../../../client/nitro/communication/messages/incoming/room/mapping/RoomDoorEvent';
import { RoomModelEvent } from '../../../../../client/nitro/communication/messages/incoming/room/mapping/RoomModelEvent';
import { RoomThicknessEvent } from '../../../../../client/nitro/communication/messages/incoming/room/mapping/RoomThicknessEvent';
import { RoomBlockedTilesComposer } from '../../../../../client/nitro/communication/messages/outgoing/room/mapping/RoomBlockedTilesComposer';
import { RoomDoorSettingsComposer } from '../../../../../client/nitro/communication/messages/outgoing/room/mapping/RoomDoorSettingsComposer';
import { RoomModelSaveComposer } from '../../../../../client/nitro/communication/messages/outgoing/room/mapping/RoomModelSaveComposer';
import { Nitro } from '../../../../../client/nitro/Nitro';
import FloorMapSettings from '../common/FloorMapSettings';
import { FloorplanMainComponent } from '../components/main/main.component';

@Injectable()
export class FloorPlanService implements OnDestroy
{
    public component: FloorplanMainComponent;
    
    private _messages: IMessageEvent[];

    private _model: string;
    private _doorX: number;
    private _doorY: number;
    private _doorDirection: number;
    private _blockedTilesMap: boolean[][];
    private _thicknessWall: number;
    private _thicknessFloor: number;

    private _doorSettingsReceived: boolean;
    private _blockedTilesMapReceived: boolean;
    private _RoomThicknessReceived: boolean;

    constructor(
        private _ngZone: NgZone)
    {
        this.component                  = null;
        this._messages                  = [];

        this._model                     = null;
        this._doorX                     = 0;
        this._doorY                     = 0;
        this._doorDirection             = 0;
        this._blockedTilesMap           = [];
        this._thicknessWall             = 0;
        this._thicknessFloor            = 0;
        
        this._doorSettingsReceived      = false;
        this._blockedTilesMapReceived   = false;
        this._RoomThicknessReceived     = false;

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
            this.unregisterMessages();

            this._messages = [
                new RoomModelEvent(this.onRoomModelEvent.bind(this)),
                new RoomDoorEvent(this.onRoomDoorEvent.bind(this)),
                new RoomBlockedTilesEvent(this.onRoomBlockedTilesEvent.bind(this)),
                new RoomThicknessEvent(this.onRoomThicknessEvent.bind(this))
            ];

            for(const message of this._messages) Nitro.instance.communication.registerMessageEvent(message);
        });
    }

    private unregisterMessages(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            if(this._messages && this._messages.length)
            {
                for(const message of this._messages) Nitro.instance.communication.removeMessageEvent(message);

                this._messages = [];
            }
        });
    }

    private onRoomModelEvent(event: RoomModelEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._model = parser.model;

        Nitro.instance.communication.connection.send(new RoomDoorSettingsComposer());
        Nitro.instance.communication.connection.send(new RoomBlockedTilesComposer());

        this.tryEmit();
    }

    private onRoomDoorEvent(event: RoomDoorEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._doorX                 = parser.x;
        this._doorY                 = parser.y;
        this._doorDirection         = parser.direction;
        this._doorSettingsReceived  = true;

        this.tryEmit();
    }

    private onRoomBlockedTilesEvent(event: RoomBlockedTilesEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._blockedTilesMap           = parser.blockedTilesMap;
        this._blockedTilesMapReceived   = true;
        
        this.tryEmit();
    }

    private onRoomThicknessEvent(event: RoomThicknessEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._thicknessFloor            = parser.thicknessFloor;
        this._thicknessWall             = parser.thicknessWall;
        this._RoomThicknessReceived   = true;

        this.tryEmit();
    }

    private tryEmit(): void
    {
        if(this._model && this._doorSettingsReceived && this._blockedTilesMapReceived)
        {
            this.component.init(this._model, this._blockedTilesMap, this._doorX, this._doorY, this._doorDirection, this._thicknessWall.toString(), this._thicknessFloor.toString());
        }
    }

    public importFloorPlan(model: string)
    {
        this.component.preview(model);
    }

    public save(settings: FloorMapSettings)
    {
        console.log(settings, parseInt(settings.thicknessWall),parseInt(settings.thicknessFloor) )
        Nitro.instance.communication.connection.send(new RoomModelSaveComposer(
            settings.heightMapString,
            settings.doorX,
            settings.doorY,
            settings.doorDirection,
            parseInt(settings.thicknessWall),
            parseInt(settings.thicknessFloor),
            settings.wallHeight
            ));
    }
}