import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { Application, Container, Graphics } from 'pixi.js';
import { Nitro } from '../../../../../../client/nitro/Nitro';
import { RoomPreviewer } from '../../../../../../client/nitro/room/preview/RoomPreviewer';
import FloorMapTile from '../../common/FloorMapTile';

@Component({
    selector: 'nitro-floorplan-main-component',
    templateUrl: './main.template.html'
})

export class FloorplanMainComponent implements OnInit
{
    @ViewChild('floorplanElement')
    public floorplanElement: ElementRef<HTMLDivElement>;

    private _spriteMap: any[];
    private _heightMap: any[];
    
    private _doorX: number;
    private _doorY: number;
    private _originalMap: any[];
    private _doorDirection: number;
    private _wallHeight: number;
    private _currentModel: string;

    private _app: Application;
    private _container: Container;
    private _doorContainer: Container;
    private _colorMap: object;
    private _extraX: number;
    private _currentAction: string;
    private _currentHeight: string;
    private _highestX: number;
    private _highestY: number;
    private _isholding: boolean;
    private _coloredTilesCount: number;

    private _heightScheme: string = "x0123456789abcdefghijklmnopq";
    private _maxFloorLength: number = 64;
    private _tileSize: number = 18;

    private _roomPreviewer: RoomPreviewer;

    constructor(
        private _ngZone: NgZone)
    {
        this._spriteMap     = [];
        this._heightMap     = [];

        this._doorX = -1;
        this._doorY = -1;
        this._originalMap   = [];
        this._doorDirection = 0;
        this._wallHeight = 1;
        this._currentModel = null;
        
        this._app           = null;
        this._container     = null;
        this._doorContainer = null;
        this._colorMap      = [];
        this._extraX        = 0;
        this._currentAction     = 'set';
        this._currentHeight     = this._heightScheme[1];
        this._highestX          = 0;
        this._highestY          = 0;
        this._isholding     = false;
        this._coloredTilesCount = 0;
        
        this._roomPreviewer = new RoomPreviewer(Nitro.instance.roomEngine, ++RoomPreviewer.PREVIEW_COUNTER);
        this._loadColorMap();
    }

    ngOnInit(): void
    {
        this._doorX = 3;
        this._doorY = 5;

        const roomMapString = "xxxxxxxxxxxxx\rxxxxlllcccccx\rxxxx55555555x\rxxxx22222222x\rxxxxl00xxx22x\rxxx0000xxx22x\rxxxx000xxx22x\rxxxx000xxxppx\rxxxx000xxxppp\rxxxx000xxxppp\rxxxx000xxx2px\rxxxx000xxx2px\rxxxxh00xxx22x\rxxxxh00xxx22x\rxxxxxxxxxxxxx\rxxxxxxxxxxxxx";

        this._currentModel = roomMapString;
        this._heightMap = this._originalMap = this._readTileMapString(roomMapString);
    }

    ngAfterViewInit(): void
    {
        const width = this._tileSize * this._heightMap.length + 20;
        const height = (this._tileSize * this._heightMap.length) / 2 + 100;

        this._extraX = this._tileSize /2 * this._heightMap.length;

        this._buildApp(width, height);
        this._renderTileMap();
    }

    private _buildApp(width: number, height: number): void
    {
        this._app = new Application({
            width: width,
            height: height,
            backgroundColor: 0x000000,
            antialias: true,
            autoDensity: true
        });

        this.floorplanElement.nativeElement.append(this._app.view);
        this.floorplanElement.nativeElement.scrollTo(width/3, 0);

        this._container = new Container();
        this._doorContainer = new Container();

        this._app.stage.addChild(this._container);
        this._app.stage.addChild(this._doorContainer);

        this._app.view.addEventListener("mousedown", () => {
            this._isholding = true;
        });

        this._app.view.addEventListener("mouseup", () => {
            this._isholding = false;
        });

        this._app.view.addEventListener("mouseout", () => {
            this._isholding = false;
        });
    }

    private _readTileMapString(tileMapString: string): any[]
    {
        let roomMapStringSplit = tileMapString.split("\r");
        let roomMap = [];

        let y = 0, x = 0;
        while(y < roomMapStringSplit.length)
        {
            const originalRow = roomMapStringSplit[y].split("");
            roomMap[y] = [];

            x = 0;
            while(x < roomMapStringSplit[x].length)
            {
                roomMap[y][x] = new FloorMapTile(originalRow[x]);
                x++;
            }

            while(x < this._maxFloorLength)
            {
                roomMap[y][x] = new FloorMapTile('x');
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
                roomMap[y][x] = new FloorMapTile('x');
                x++;
            }
            
            y++;
        }

        this._highestY = roomMapStringSplit.length - 1;
        this._highestX = roomMapStringSplit[this._highestY].length - 1;

        return roomMap;
    }

    private _generateTileMapString(): string
    {
        firstFor:
        for(let y = this._highestY; y >= 0; y--)
        {
            for(let x = this._highestX; x >= 0; x--)
            {
                const tile = this._heightMap[y][x];

                if(tile.height !== 'x')
                {
                    this._highestX = x;
                    this._highestY = y;

                    break firstFor;
                }
            }
        }

        let rows = [];

        for(let y = 0; y <= this._highestY; y++)
        {
            let row = [];

            for(let x = 0; x <= this._highestX; x++)
            {
                const tile = this._heightMap[y][x];

                row[x] = tile.height;
            }

            rows[y] = row.join("");
        }

        return rows.join("\\r");
    }

    private _renderTileMap(): void
    {
        for(var y = 0; y < this._heightMap.length; y++)
        {
            this._spriteMap[y] = [];

            for(var x = 0; x < this._heightMap[y].length; x++)
            {
                const tile = this._heightMap[y][x];

                let isDoor = false;

                if(x === this._doorX && y === this._doorY) isDoor = true;
                
                let positionX = x * this._tileSize / 2 - y * this._tileSize / 2 + this._extraX;
                let positionY = x * this._tileSize / 4 + y * this._tileSize / 4 + y * 1;

                let color = this._colorMap[tile.height];

                if(tile.height !== 'x') this._coloredTilesCount++;

                if(isDoor)
                {
                    color = '0xffffff';
                }

                this._spriteMap[y][x] = this._container.addChild(this._renderIsometricTile(x, y, positionX, positionY, color));
            }
        }
    }

    private _renderIsometricTile(x: number, y: number, posX: number, posY: number, color: number): Graphics
    {
        var tile = new Graphics();

        tile.beginFill(0xffffff);
        tile.lineStyle(1, 0x000000, 1, 0);
        tile.drawRect(0, 0, this._tileSize, this._tileSize);
        tile.endFill();
        tile.setTransform(posX, posY + this._tileSize * 0.5, 1, 1, 0, 1.1, -0.5, 0, 0);

        tile.tint = color;
        tile.interactive = true;

        tile.on('mousedown', () => {
            this._handleTileClick(x, y);
        });

        tile.on('mouseover', () => {
            if(this._isholding)
                this._handleTileClick(x, y);
        });

        return tile;
    }

    private _setDoor(x: number, y: number): void
    {
        if(x === this._doorX && y === this._doorY) return;
        
        if(!this._heightMap[this._doorY] || !this._spriteMap[this._doorY] || !this._heightMap[y] || !this._spriteMap[y]) return;

        const tile = this._heightMap[this._doorY][this._doorX];
        const sprite = this._spriteMap[this._doorY][this._doorX];
        const futureTile = this._heightMap[y][x];
        const futureSprite = this._spriteMap[y][x];

        if(!tile || !sprite || !futureTile || !futureSprite) return;

        if(futureTile.height === 'x') return;

        sprite.tint = this._colorMap[tile.height];
        futureSprite.tint = 0xffffff;
        this._doorX = x;
        this._doorY = y;
    }

    private _handleTileClick(x: number, y: number): void
    {
        const tile = this._heightMap[y][x];
        let heightIndex = this._heightScheme.indexOf(tile.height);
        
        if(this._currentAction === 'door')
        {
            this._setDoor(x, y);
            return;
        }

        let futureHeightIndex = 0;

        switch(this._currentAction)
        {
            case 'up': futureHeightIndex = heightIndex + 1; break;
            case 'down': futureHeightIndex = heightIndex - 1; break;
            case 'set': futureHeightIndex = this._heightScheme.indexOf(this._currentHeight); break;
            case 'unset': futureHeightIndex = 0; break;
        }

        if(futureHeightIndex === -1) return;

        if(heightIndex === futureHeightIndex) return;

        if(futureHeightIndex > 0)
        {
            if(x > this._highestX) this._highestX = x;
            if(y > this._highestY) this._highestY = y;
        }

        const newHeight = this._heightScheme[futureHeightIndex];

        if(!newHeight) return;

        this._heightMap[y][x].height = newHeight;

        if(newHeight === 'x')
        {
            this._coloredTilesCount--;
        }
        else
        {
            this._coloredTilesCount++;
        }

        let isDoor = false;

        if(x === this._doorX && y === this._doorY) isDoor = true;

        if(!isDoor)
            this._spriteMap[y][x].tint = this._colorMap[newHeight];
    }

    private _loadColorMap(): void
    {
        this._colorMap = {
            "x": "0x101010",
            "0": "0x0065ff",
            "1": "0x0091ff",
            "2": "0x00bcff",
            "3": "0x00e8ff",
            "4": "0x00ffea",
            "5": "0x00ffbf",
            "6": "0x00ff93",
            "7": "0x00ff68",
            "8": "0x00ff3d",
            "9": "0x19ff00",
            "a": "0x44ff00",
            "b": "0x70ff00",
            "c": "0x9bff00",
            "d": "0xf2ff00",
            "e": "0xffe000",
            "f": "0xffb500",
            "g": "0xff8900",
            "h": "0xff5e00",
            "i": "0xff3200",
            "j": "0xff0700",
            "k": "0xff0023",
            "l": "0xff007a",
            "m": "0xff00a5",
            "n": "0xff00d1",
            "o": "0xff00fc",
            "p": "0xd600ff",
            "q": "0xaa00ff"
            };
    }

    public changeAction(action: string): void
    {
        this._currentAction = action;
    }

    public selectHeight(heightIndex: string): void
    {
        this._currentHeight = heightIndex;
    }

    public getColor(hex: string): string
    {
        return hex.replace("0x", "#");
    }

    public save(): void
    {
        this._currentModel = this._generateTileMapString();
    }

    public decrementHeight(): void
    {
        const colorIndex = this._heightScheme.indexOf(this._currentHeight);

        if(colorIndex === 1) return;

        this._currentHeight = this._heightScheme[colorIndex - 1];
    }

    public incrementHeight(): void
    {
        const colorIndex = this._heightScheme.indexOf(this._currentHeight);

        if(colorIndex === this._heightScheme.length - 1) return;

        this._currentHeight = this._heightScheme[colorIndex + 1];
    }

    public decrementDoorDirection(): void
    {
        if(this._doorDirection === 0)
            this._doorDirection = 7;
        else
            this._doorDirection--;
    }

    public incrementDoorDirection(): void
    {
        if(this._doorDirection === 7)
            this._doorDirection = 0;
        else
            this._doorDirection++;
    }

    public decrementWallheight(): void
    {
        if(this._wallHeight === 1)
            this._wallHeight = 16;
        else
            this._wallHeight--;
    }

    public incrementWallheight(): void
    {
        if(this._wallHeight === 16)
            this._wallHeight = 1;
        else
            this._wallHeight++;
    }

    public get colorMap(): object
    {
        return Object.keys(this._colorMap)
        .filter(key => key !== 'x')
        .reduce((obj, key) => {
          obj[key] = this._colorMap[key];
          return obj;
        }, {});
    }

    public get currentAction(): string
    {
        return this._currentAction;
    }

    public get currentHeight(): string
    {
        return this._currentHeight;
    }

    public get coloredTilesCount(): number
    {
        return this._coloredTilesCount;
    }

    public get maxTilesCount(): number
    {
        return this._maxFloorLength*this._maxFloorLength;
    }

    public get roomPreviewer(): RoomPreviewer
    {
        return this._roomPreviewer;
    }

    public get currentModel(): string
    {
        return this._currentModel;
    }

    public get doorDirection(): number
    {
        return this._doorDirection;
    }

    public get wallHeight(): number
    {
        return this._wallHeight;
    }
}
