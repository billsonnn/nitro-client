import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { Container, Graphics, SCALE_MODES, Sprite } from 'pixi.js';
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
import FloorMapTile from '../common/FloorMapTile';
import { FloorplanMainComponent } from '../components/main/main.component';
import { AdvancedMap } from '../../../../../client/core/utils/AdvancedMap';

@Injectable()
export class FloorPlanService implements OnDestroy
{
    private _maxFloorLength: number = 64;
    private _tileSize: number = 18;
    private _colorMap: object = { 'x': '0x101010','0': '0x0065ff','1': '0x0091ff','2': '0x00bcff','3': '0x00e8ff','4': '0x00ffea','5': '0x00ffbf','6': '0x00ff93','7': '0x00ff68','8': '0x00ff3d','9': '0x19ff00','a': '0x44ff00','b': '0x70ff00','c': '0x9bff00','d': '0xf2ff00','e': '0xffe000','f': '0xffb500','g': '0xff8900','h': '0xff5e00','i': '0xff3200','j': '0xff0700','k': '0xff0023','l': '0xff007a','m': '0xff00a5','n': '0xff00d1','o': '0xff00fc','p': '0xd600ff','q': '0xaa00ff' };
    private _heightScheme: string = 'x0123456789abcdefghijklmnopq';

    private static readonly  COLOR_BLOCKED = '0x435e87';
    private static readonly COLOR_DOOR = '0xffffff';
    private _spriteMap: Sprite[][];
    public component: FloorplanMainComponent;

    private _messages: IMessageEvent[];

    private _model: string;
    private _doorX: number;
    private _doorY: number;
    private _doorDirection: number;
    private _blockedTilesMap: boolean[][];
    private _thicknessWall: number;
    private _thicknessFloor: number;
    private _coloredTilesCount: number;

    private _doorSettingsReceived: boolean;
    private _blockedTilesMapReceived: boolean;
    private _RoomThicknessReceived: boolean;

    private _floorMapSettings: FloorMapSettings;
    private __originalFloorMapSettings: FloorMapSettings;

    private _highestX: number;
    private _highestY: number;
    private _isHolding: boolean;
    private _currentAction: string;
    private _currentHeight: string;
    private _extraX: number;

    private _container: Container;

    private _changesMade: boolean;
    private _wallHeight: number;

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
        this._changesMade               = false;

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
        this._wallHeight = parser.wallHeight + 1;
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

        console.log('floor = ' + parser.thicknessFloor + ' will become ' + this.convertSettingnToNumber(parser.thicknessFloor));
        console.log('wall = ' + parser.thicknessWall + ' will become ' + this.convertSettingnToNumber(parser.thicknessWall));
        this._thicknessFloor            = this.convertSettingnToNumber(parser.thicknessFloor);
        this._thicknessWall             = this.convertSettingnToNumber(parser.thicknessWall);
        this._RoomThicknessReceived   = true;

        this.tryEmit();
    }

    private tryEmit(): void
    {
        if(this.component && this.component.visible && this._model && this._doorSettingsReceived && this._blockedTilesMapReceived)
        {
            this._ngZone.run(() => this.component.init(this._model, this._blockedTilesMap, this._doorX, this._doorY, this._doorDirection, this._thicknessWall, this._thicknessFloor));
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
            this.convertNumbersForSaving(settings.thicknessWall),
            this.convertNumbersForSaving(settings.thicknessFloor),
            (this._wallHeight - 1)
        ));
    }

    private convertNumbersForSaving(value: number): number
    {
        value = parseInt(value.toString());
        switch(value)
        {
            case 0:
                return -2;
            case 1:
                return -1;
            case 3:
                return 1;
            default:
                return 0;

        }
    }

    public clear(): void
    {
        this._floorMapSettings = new FloorMapSettings();
        this.__originalFloorMapSettings = new FloorMapSettings();

        this._extraX            = 0;
        this._highestX          = 0;
        this._highestY          = 0;
        this._coloredTilesCount = 0;
        this._spriteMap         = [];
        this._isHolding         = false;
        this._blockedTilesMap   = [];
        this._changesMade       = false;

        this._currentAction = 'set';
        this._currentHeight = this._heightScheme[1];
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
                const blocked = this._blockedTilesMap[y] && this._blockedTilesMap[y][x];
                if(blocked)
                {
                    //  debugger;
                }
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
        console.log('highest X: ' + this._highestX + ', highestY: ' + this._highestY);
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

    public renderTileMap(): void
    {
        for(let y = 0; y < this.floorMapSettings.heightMap.length; y++)
        {
            this._spriteMap[y] = [];

            for(let x = 0; x < this.floorMapSettings.heightMap[y].length; x++)
            {
                const tile = this.floorMapSettings.heightMap[y][x];

                let isDoor = false;

                if(x === this.floorMapSettings.doorX && y === this.floorMapSettings.doorY) isDoor = true;

                const positionX = x * this._tileSize / 2 - y * this._tileSize / 2 + this._extraX;
                const positionY = x * this._tileSize / 4 + y * this._tileSize / 4 + y;

                let color = this._colorMap[tile.height];

                if(tile.height !== 'x')
                {
                    this._ngZone.run(() =>
                    {
                        this.increaseColoredTilesCount();
                    });
                }

                if(tile.blocked)
                {
                    color = FloorPlanService.COLOR_BLOCKED;
                }

                if(isDoor)
                {
                    color = FloorPlanService.COLOR_DOOR;
                }

                this._ngZone.runOutsideAngular(() =>  this._spriteMap[y][x] = this._container.addChild(this._renderIsometricTile(x, y, positionX, positionY, color)));

            }
        }
    }

    private _baseGraphic: Graphics = null;
    private _renderIsometricTile(x: number, y: number, posX: number, posY: number, color: number): Sprite
    {
        if(!this._baseGraphic)
        {
            const tile = new Graphics();

            tile.beginFill(0xffffff);
            tile.lineStyle(1, 0x000000, 1, 0);
            tile.drawRect(0, 0, this._tileSize, this._tileSize);
            tile.endFill();

            tile.setTransform(posX, posY + this._tileSize * 0.5, 1, 1, 0, 1.1, -0.5, 0, 0);

            tile.tint = color;
            tile.interactive = true;
            this._baseGraphic = tile;
        }

        const texture = this.component.app.renderer.generateTexture(this._baseGraphic, SCALE_MODES.NEAREST, 16);
        return new Sprite(texture);




        // this._cacheGraphics.add(color, tile);
        // }
        // else
        // {
        //     tile = this._cacheGraphics.getValue(color).clone();
        //     tile.setTransform(posX, posY + this._tileSize * 0.5, 1, 1, 0, 1.1, -0.5, 0, 0);
        //     tile.tint = color;
        //
        // }
        // return tile;
        // if(!FloorPlanService.baseGraphic)
        // {
        //     const tile = new Graphics();
        //
        //     tile.beginFill(0xffffff);
        //     tile.lineStyle(1, 0x000000, 1, 0);
        //     tile.drawRect(0, 0, this._tileSize, this._tileSize);
        //     tile.endFill();
        //     // tile.cacheAsBitmap = true;
        //     tile.setTransform(posX, posY + this._tileSize * 0.5, 1, 1, 0, 1.1, -0.5, 0, 0);
        //
        //     tile.tint = color;
        //     tile.interactive = true;
        //
        //     FloorPlanService.baseGraphic = tile;
        // }


        // const texture = this.component.app.renderer.generateTexture(FloorPlanService.baseGraphic, SCALE_MODES.NEAREST, 1);
        // const spriteTile = new Sprite(texture);
        //
        // return spriteTile;

        // tile.on('mousedown', () =>
        // {
        //     this._handleTileClick(x, y);
        // });
        //
        // tile.on('mouseover', () =>
        // {
        //     if(this._isHolding)
        //         this._handleTileClick(x, y);
        // });

        // return tile;
    }

    private _handleTileClick(x: number, y: number): void
    {
        const tile = this.floorMapSettings.heightMap[y][x];
        const heightIndex = this._heightScheme.indexOf(tile.height);


        let futureHeightIndex = 0;

        switch(this._currentAction)
        {
            case 'door':
                this._setDoor(x,y);
                return;
            case 'up':
                futureHeightIndex = heightIndex + 1;
                break;
            case 'down':
                futureHeightIndex = heightIndex - 1;
                break;
            case 'set':
                futureHeightIndex = this._heightScheme.indexOf(this._currentHeight);
                break;
            case 'unset':
                futureHeightIndex = 0;
                break;
        }

        if(futureHeightIndex === -1) return;

        if(heightIndex === futureHeightIndex) return;

        if(futureHeightIndex > 0)
        {
            if(x > this.highestX) this.highestX = x;

            if(y > this.highestY) this.highestY = y;
        }

        const newHeight = this._heightScheme[futureHeightIndex];

        if(!newHeight) return;

        if(tile.blocked) return;

        this.floorMapSettings.heightMap[y][x].height = newHeight;

        this._changesMade = true;

        this._ngZone.run(() =>
        {
            if(newHeight === 'x')
            {
                this.decreaseColoredTilesCount();
            }
            else
            {
                this.increaseColoredTilesCount();
            }
        });

        let isDoor = false;

        if(x === this.floorMapSettings.doorX && y === this.floorMapSettings.doorY) isDoor = true;

        if(!isDoor)
            this.setTint(y,x,newHeight);

    }

    private setTint(y,x, height)
    {
        this._spriteMap[y][x].tint = this._colorMap[height];
    }
    public revertChanges(): void
    {
        this._floorMapSettings = JSON.parse(JSON.stringify(this.__originalFloorMapSettings));
        this._spriteMap.forEach((y, index) =>
        {
            y.forEach((x, indexX) =>
            {
                const floormap = this.floorMapSettings.heightMap[index][indexX];

                let color = this._colorMap[ floormap.height];
                if(floormap.blocked)
                {
                    color = FloorPlanService.COLOR_BLOCKED;
                }
                if(indexX === this.floorMapSettings.doorX && index === this.floorMapSettings.doorY)
                {
                    color = FloorPlanService.COLOR_DOOR;
                }

                x.tint = color;
            });
        });

        this._changesMade = false;
    }
    private _setDoor(x: number, y: number): void
    {
        if(x === this.floorMapSettings.doorX && y === this.floorMapSettings.doorY) return;

        if(!this.floorMapSettings.heightMap[this.floorMapSettings.doorY] ||
            !this._spriteMap[this.floorMapSettings.doorY] ||
            !this.floorMapSettings.heightMap[y] ||
            !this._spriteMap[y]) return;

        const tile = this.floorMapSettings.heightMap[this.floorMapSettings.doorY][this.floorMapSettings.doorX];
        const sprite = this._spriteMap[this.floorMapSettings.doorY][this.floorMapSettings.doorX];
        const futureTile = this.floorMapSettings.heightMap[y][x];
        const futureSprite = this._spriteMap[y][x];

        if(!tile || !sprite || !futureTile || !futureSprite) return;

        if(futureTile.height === 'x') return;

        if(tile.blocked)
        {
            sprite.tint = 0x435e87;
        }
        else
        {
            sprite.tint = this._colorMap[tile.height];
        }

        futureSprite.tint = 0xffffff;
        this.floorMapSettings.doorX = x;
        this.floorMapSettings.doorY = y;
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
        this.__originalFloorMapSettings = JSON.parse(JSON.stringify(settings));
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


    public decrementDoorDirection(): void
    {
        if(this.floorMapSettings.doorDirection === 0)
            this.floorMapSettings.doorDirection = 7;
        else
            this.floorMapSettings.doorDirection--;
    }

    public incrementDoorDirection(): void
    {
        if(this.floorMapSettings.doorDirection === 7)
            this.floorMapSettings.doorDirection = 0;
        else
            this.floorMapSettings.doorDirection++;
    }

    public decrementWallheight(): void
    {
        if(this.wallHeight === 1)
            this.wallHeight = 16;
        else
            this.wallHeight--;
    }

    public incrementWallheight(): void
    {
        if(this.wallHeight === 16)
            this.wallHeight = 1;
        else
            this.wallHeight++;
    }

    public increaseColoredTilesCount(): void
    {
        this._coloredTilesCount++;
    }
    public decreaseColoredTilesCount(): void
    {
        this._coloredTilesCount--;
    }

    public get coloredTilesCount(): number
    {
        return this._coloredTilesCount;
    }

    public get isHolding(): boolean
    {
        return this._isHolding;
    }

    public set isHolding(holding: boolean)
    {
        this._isHolding = holding;
    }

    public get tileSize(): number
    {
        return this._tileSize;
    }

    public get currentAction(): string
    {
        return this._currentAction;
    }

    public set currentAction(action: string)
    {
        this._currentAction = action;
    }

    public get currentHeight(): string
    {
        return this._currentHeight;
    }

    public set currentHeight(height: string)
    {
        this._currentHeight = height;
    }

    public get extraX(): number
    {
        return this._extraX;
    }

    public set extraX(x: number)
    {
        this._extraX = x;
    }

    public get colorMap(): object
    {
        return this._colorMap;
    }

    public get blockedTilesMap(): boolean[][]
    {
        return this._blockedTilesMap;
    }

    public set blockedTilesMap(tiles: boolean[][])
    {
        this._blockedTilesMap = tiles;
    }

    public decrementHeight(): void
    {
        const colorIndex = this._heightScheme.indexOf(this.currentHeight);

        if(colorIndex === 1) return;

        this.selectHeight(this._heightScheme[colorIndex - 1]);
    }


    public selectHeight(heightIndex: string): void
    {
        this.currentHeight = heightIndex;
        this.currentAction = 'set';
    }

    public incrementHeight(): void
    {
        const colorIndex = this._heightScheme.indexOf(this.currentHeight);

        if(colorIndex === this._heightScheme.length - 1) return;

        this.selectHeight(this._heightScheme[colorIndex + 1]);
    }

    public get changesMade(): boolean
    {
        return this._changesMade;
    }



    public set container(container: Container)
    {
        this._container = container;
    }

    public get wallHeight(): number
    {
        return this._wallHeight;
    }

    public set wallHeight(height: number)
    {
        this._wallHeight = height;
    }
}
