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
import FloorMapTile from '../common/FloorMapTile';

@Injectable()
export class FloorPlanService implements OnDestroy
{
    private _maxFloorLength: number = 64;


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

    private _floorMapSettings: FloorMapSettings;
    private __originalFloorMapSettings: FloorMapSettings;

    private _highestX: number;
    private _highestY: number;

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
        if(this.component && this.component.visible && this._model && this._doorSettingsReceived && this._blockedTilesMapReceived)
        {
            this.component.init(this._model, this._blockedTilesMap, this._doorX, this._doorY, this._doorDirection, this._thicknessWall, this._thicknessFloor);
        }
    }

    public importFloorPlan(model: string)
    {
        this.component.preview(model);
    }

    public save(settings: FloorMapSettings)
    {
        console.log(settings, settings.thicknessWall, settings.thicknessFloor);
        Nitro.instance.communication.connection.send(new RoomModelSaveComposer(
            settings.heightMapString,
            settings.doorX,
            settings.doorY,
            settings.doorDirection,
            settings.thicknessWall,
            settings.thicknessFloor,
            settings.wallHeight
        ));
    }

    public clear(): void
    {
        this._floorMapSettings = new FloorMapSettings();
        this.__originalFloorMapSettings = new FloorMapSettings();

        this._highestX          = 0;
        this._highestY          = 0;
    }

    public generateTileMapString(): string
    {
        const highestTile = this.floorMapSettings.heightMap[this._highestY][this._highestX];

        if(highestTile.height === 'x')
        {
            this._highestX = -1;
            this._highestY = -1;

            for(let y = this._maxFloorLength - 1; y >= 0; y--)
            {
                if(!this.floorMapSettings.heightMap[y]) continue;

                for(let x = this._maxFloorLength - 1; x >= 0; x--)
                {
                    if(!this.floorMapSettings.heightMap[y][x]) continue;

                    const tile = this.floorMapSettings.heightMap[y][x];

                    if(tile.height !== 'x')
                    {
                        if(x > this._highestX)
                            this._highestX = x;

                        if(y > this._highestY)
                            this._highestY = y;
                    }
                }
            }
        }

        const rows = [];

        for(let y = 0; y <= this._highestY; y++)
        {
            const row = [];

            for(let x = 0; x <= this._highestX; x++)
            {
                const tile = this.floorMapSettings.heightMap[y][x];

                row[x] = tile.height;
            }

            rows[y] = row.join('');
        }

        return rows.join('\r');
    }


    public readTileMapString(tileMapString: string): any[]
    {
        let roomMapStringSplit = tileMapString.split('\r');
        const roomMap = [];

        let y = 0, x = 0;
        while(y < roomMapStringSplit.length)
        {
            if(roomMapStringSplit[y].length === 0)
            {
                y--;
                roomMapStringSplit = roomMapStringSplit.splice(y, 1);
                continue;
            }

            const originalRow = roomMapStringSplit[y].split('');
            roomMap[y] = [];

            x = 0;
            while(x < originalRow.length)
            {
                let blocked = false;

                if(this._blockedTilesMap[y] && this._blockedTilesMap[y][x]) blocked = true;

                roomMap[y][x] = new FloorMapTile(originalRow[x], blocked);
                x++;
            }

            while(x < this._maxFloorLength)
            {
                roomMap[y][x] = new FloorMapTile('x', false);
                x++;
            }

            y++;
        }

        while(y < this._maxFloorLength)
        {
            roomMap[y] = [];

            x = 0;
            while(x < this._maxFloorLength)
            {
                roomMap[y][x] = new FloorMapTile('x', false);
                x++;
            }

            y++;
        }

        this._highestY = roomMapStringSplit.length - 1;
        this._highestX = roomMapStringSplit[this._highestY].length - 1;

        return roomMap;
    }


    public convertSettingnToNumber(value: number): number
    {
        switch(value)
        {
            case 0.25:
                return 0;
            case 0.5:
                return 1;
            case 2:
                return 3;
            default:
                return 2;
        }
    }

    public set floorMapSettings(settings: FloorMapSettings)
    {
        this._floorMapSettings = settings;
    }

    public get floorMapSettings(): FloorMapSettings
    {
        return this._floorMapSettings;
    }

    public set originalMapSettings(settings: FloorMapSettings)
    {
        this.__originalFloorMapSettings = settings;
    }

    public get originalMapSettings(): FloorMapSettings
    {
        return this.__originalFloorMapSettings;
    }

    public get highestY(): number
    {
        return this._highestY;
    }

    public set highestY(y: number)
    {
        this._highestY = y;
    }

    public get highestX(): number
    {
        return this._highestX;
    }

    public set highestX(x: number)
    {
        this._highestX = x;
    }

    public get maxTilesCount(): number
    {
        return this._maxFloorLength*this._maxFloorLength;
    }






}
