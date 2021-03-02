import { Component, ElementRef, Input, NgZone, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Application, Container, Graphics } from 'pixi.js';
import { Nitro } from '../../../../../../client/nitro/Nitro';
import { RoomPreviewer } from '../../../../../../client/nitro/room/preview/RoomPreviewer';
import FloorMapSettings from '../../common/FloorMapSettings';
import FloorMapTile from '../../common/FloorMapTile';
import { FloorPlanService } from '../../services/floorplan.service';
import { FloorPlanImportExportComponent } from '../import-export/import-export.component';
import { SettingsService } from '../../../../../core/settings/service';
import { RoomDoorSettingsComposer } from '../../../../../../client/nitro/communication/messages/outgoing/room/mapping/RoomDoorSettingsComposer';
import { RoomBlockedTilesComposer } from '../../../../../../client/nitro/communication/messages/outgoing/room/mapping/RoomBlockedTilesComposer';

@Component({
    selector: 'nitro-floorplan-main-component',
    templateUrl: './main.template.html'
})

export class FloorplanMainComponent implements OnInit, OnChanges
{
    @ViewChild('floorplanElement')
    public floorplanElement: ElementRef<HTMLDivElement>;

    @Input('visible')
    public visible: boolean = false;

    public minimize: boolean;

    private _spriteMap: Graphics[][];
    private _blockedTilesMap: boolean[][];

    private _app: Application;
    private _container: Container;
    private _extraX: number;
    private _currentAction: string;
    private _currentHeight: string;

    private _isHolding: boolean;
    private _coloredTilesCount: number;

    private _heightScheme: string = 'x0123456789abcdefghijklmnopq';
    private _colorMap: object = { 'x': '0x101010','0': '0x0065ff','1': '0x0091ff','2': '0x00bcff','3': '0x00e8ff','4': '0x00ffea','5': '0x00ffbf','6': '0x00ff93','7': '0x00ff68','8': '0x00ff3d','9': '0x19ff00','a': '0x44ff00','b': '0x70ff00','c': '0x9bff00','d': '0xf2ff00','e': '0xffe000','f': '0xffb500','g': '0xff8900','h': '0xff5e00','i': '0xff3200','j': '0xff0700','k': '0xff0023','l': '0xff007a','m': '0xff00a5','n': '0xff00d1','o': '0xff00fc','p': '0xd600ff','q': '0xaa00ff' };

    private _tileSize: number = 18;

    private _roomPreviewer: RoomPreviewer;
    private _importExportModal: NgbModalRef;

    constructor(
        private _ngZone: NgZone,
        private _floorPlanService: FloorPlanService,
        private _modalService: NgbModal,
        private _settingsService: SettingsService)
    {
        this._floorPlanService.component = this;

        this._clear();
    }

    ngOnInit(): void
    {
        /*const roomMapString = "xxxxxxxxxxxxx\rxxxxlllcccccx\rxxxx55555555x\rxxxx22222222x\rxxxxl00xxx22x\rxxx0000xxx22x\rxxxx000xxx22x\rxxxx000xxxppx\rxxxx000xxxppp\rxxxx000xxxppp\rxxxx000xxx2px\rxxxx000xxx2px\rxxxxh00xxx22x\rxxxxh00xxx22x\rxxxxxxxxxxxxx\rxxxxxxxxxxxxx";

        this.init(roomMapString, 3, 5);*/
    }

    ngAfterViewInit(): void
    {

    }

    public ngOnChanges(changes: SimpleChanges): void
    {
        const next = changes.visible.currentValue;
        if(next)
        {
            Nitro.instance.communication.connection.send(new RoomDoorSettingsComposer());
            Nitro.instance.communication.connection.send(new RoomBlockedTilesComposer());
        }
        else
        {
            this._clear();
        }
    }


    private _clear(): void
    {
        this._spriteMap         = [];
        this._blockedTilesMap   = [];

        this._floorPlanService.clear();


        this._extraX            = 0;
        this._currentAction     = 'set';
        this._currentHeight     = this._heightScheme[1];

        this._isHolding         = false;
        this._coloredTilesCount = 0;

        this._roomPreviewer     = new RoomPreviewer(Nitro.instance.roomEngine, ++RoomPreviewer.PREVIEW_COUNTER);
        this._importExportModal = null;
        //
        // if(this._app && this._container)
        // {
        //     for(let i = this._container.children.length - 1; i >= 0; i--)
        //     {
        //         this._container.removeChild(this._container.children[i]);
        //     }
        // }
        this._container = null;
        this._app && this._app.destroy();
        this._app = null;
    }

    public close(): void
    {
        this._settingsService.floorPlanVisible = false;
    }

    public preview(mapString: string)
    {
        const { doorX, doorY, doorDirection, thicknessWall, thicknessFloor } = this._floorPlanService.floorMapSettings;
        this.init(mapString, this._blockedTilesMap, doorX, doorY, doorDirection, thicknessWall, thicknessFloor);
    }

    public init(mapString: string, blockedTilesMap: boolean[][], doorX: number, doorY: number, doorDirection: number, thicknessWall: number, thicknessFloor: number)
    {
        this._clear();

        this._floorPlanService.floorMapSettings.heightMapString   = mapString;
        this._floorPlanService.floorMapSettings.doorX             = doorX;
        this._floorPlanService.floorMapSettings.doorY             = doorY;
        this._floorPlanService.floorMapSettings.doorDirection     = doorDirection;
        this._blockedTilesMap                    = blockedTilesMap;
        this._floorPlanService.floorMapSettings.thicknessWall     = thicknessWall;
        this._floorPlanService.floorMapSettings.thicknessFloor    = thicknessFloor;

        this._ngZone.run(() =>
        {
            this._floorPlanService.floorMapSettings.doorDirection = doorDirection;
        });

        this._floorPlanService.floorMapSettings.heightMap = this._floorPlanService.readTileMapString(mapString);

        const width = this._tileSize * this._floorPlanService.floorMapSettings.heightMap.length + 20;
        const height = (this._tileSize * this._floorPlanService.floorMapSettings.heightMap.length) / 2 + 100;

        this._extraX = this._tileSize /2 * this._floorPlanService.floorMapSettings.heightMap.length;

        this._floorPlanService.originalMapSettings = this._floorPlanService.floorMapSettings;

        this._buildApp(width, height);
        this._renderTileMap();
    }

    private _buildApp(width: number, height: number): void
    {
        console.log('building app');
        if(this._app &&  this._container && this.floorplanElement.nativeElement.children.length > 0)
        {
            for(let i = this._container.children.length - 1; i >= 0; i--)
            {
                console.log('removing at index ' + i);
                // this._container.removeChild(this._container.children[i]);
                // this.floorplanElement.nativeElement.removeChild(this.floorplanElement.nativeElement.children[i]);
            }
        }
        else
        {
            this._app = new Application({
                width: width,
                height: height,
                backgroundColor: 0x2b2b2b,
                antialias: true,
                autoDensity: true
            });


            for(let i = 0; i < this.floorplanElement.nativeElement.children.length; i++)
            {
                console.log('removing at index ' + i);
                //this._container.removeChild(this._container.children[i]);
                this.floorplanElement.nativeElement.removeChild(this.floorplanElement.nativeElement.children[i]);
            }

            // if(this.floorplanElement.nativeElement.children.length == 0)
            // {
            this.floorplanElement.nativeElement.append(this._app.view);
            // }
            if(!this._container)
            {
                this._container = new Container();

                this._app.stage.addChild(this._container);
            }
        }

        this.floorplanElement.nativeElement.scrollTo(width/3, 0);

        this._app.view.addEventListener('mousedown', () =>
        {
            this._isHolding = true;
        });

        this._app.view.addEventListener('mouseup', () =>
        {
            this._isHolding = false;
        });

        this._app.view.addEventListener('mouseout', () =>
        {
            this._isHolding = false;
        });

    }

    private _renderTileMap(): void
    {
        for(let y = 0; y < this._floorPlanService.floorMapSettings.heightMap.length; y++)
        {
            this._spriteMap[y] = [];

            for(let x = 0; x < this._floorPlanService.floorMapSettings.heightMap[y].length; x++)
            {
                const tile = this._floorPlanService.floorMapSettings.heightMap[y][x];

                let isDoor = false;

                if(x === this._floorPlanService.floorMapSettings.doorX && y === this._floorPlanService.floorMapSettings.doorY) isDoor = true;

                const positionX = x * this._tileSize / 2 - y * this._tileSize / 2 + this._extraX;
                const positionY = x * this._tileSize / 4 + y * this._tileSize / 4 + y;

                let color = this._colorMap[tile.height];

                if(tile.height !== 'x')
                {
                    this._ngZone.run(() =>
                    {
                        this._coloredTilesCount++;
                    });
                }

                if(tile.blocked)
                {
                    color = '0x435e87';
                }

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
        const tile = new Graphics();

        tile.beginFill(0xffffff);
        tile.lineStyle(1, 0x000000, 1, 0);
        tile.drawRect(0, 0, this._tileSize, this._tileSize);
        tile.endFill();
        tile.setTransform(posX, posY + this._tileSize * 0.5, 1, 1, 0, 1.1, -0.5, 0, 0);

        tile.tint = color;
        tile.interactive = true;

        tile.on('mousedown', () =>
        {
            this._handleTileClick(x, y);
        });

        tile.on('mouseover', () =>
        {
            if(this._isHolding)
                this._handleTileClick(x, y);
        });

        return tile;
    }

    private _setDoor(x: number, y: number): void
    {
        if(x === this._floorPlanService.floorMapSettings.doorX && y === this._floorPlanService.floorMapSettings.doorY) return;

        if(!this._floorPlanService.floorMapSettings.heightMap[this._floorPlanService.floorMapSettings.doorY] ||
            !this._spriteMap[this._floorPlanService.floorMapSettings.doorY] ||
            !this._floorPlanService.floorMapSettings.heightMap[y] ||
            !this._spriteMap[y]) return;

        const tile = this._floorPlanService.floorMapSettings.heightMap[this._floorPlanService.floorMapSettings.doorY][this._floorPlanService.floorMapSettings.doorX];
        const sprite = this._floorPlanService.floorMapSettings[this._floorPlanService.floorMapSettings.doorY][this._floorPlanService.floorMapSettings.doorX];
        const futureTile = this._floorPlanService.floorMapSettings.heightMap[y][x];
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
        this._floorPlanService.floorMapSettings.doorX = x;
        this._floorPlanService.floorMapSettings.doorY = y;
    }

    private _handleTileClick(x: number, y: number): void
    {
        const tile = this._floorPlanService.floorMapSettings.heightMap[y][x];
        const heightIndex = this._heightScheme.indexOf(tile.height);

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
            if(x > this._floorPlanService.highestX) this._floorPlanService.highestX = x;

            if(y > this._floorPlanService.highestY) this._floorPlanService.highestY = y;
        }

        const newHeight = this._heightScheme[futureHeightIndex];

        if(!newHeight) return;

        if(newHeight === 'x' && tile.blocked) return;

        this._floorPlanService.floorMapSettings.heightMap[y][x].height = newHeight;

        this._ngZone.run(() =>
        {
            if(newHeight === 'x')
            {
                this._coloredTilesCount--;
            }
            else
            {
                this._coloredTilesCount++;
            }
        });

        let isDoor = false;

        if(x === this._floorPlanService.floorMapSettings.doorX && y === this._floorPlanService.floorMapSettings.doorY) isDoor = true;

        if(!isDoor)
            this._spriteMap[y][x].tint = this._colorMap[newHeight];
    }

    public changeAction(action: string): void
    {
        this._currentAction = action;
    }

    public selectHeight(heightIndex: string): void
    {
        this._currentHeight = heightIndex;
        this.changeAction('set');
    }

    public getColor(hex: string): string
    {
        return hex.replace('0x', '#');
    }

    public save(): void
    {
        this._floorPlanService.floorMapSettings.heightMapString = this._floorPlanService.generateTileMapString();

        this._floorPlanService.save(this._floorPlanService.floorMapSettings);
    }

    public decrementHeight(): void
    {
        const colorIndex = this._heightScheme.indexOf(this._currentHeight);

        if(colorIndex === 1) return;

        this.selectHeight(this._heightScheme[colorIndex - 1]);
    }

    public incrementHeight(): void
    {
        const colorIndex = this._heightScheme.indexOf(this._currentHeight);

        if(colorIndex === this._heightScheme.length - 1) return;

        this.selectHeight(this._heightScheme[colorIndex + 1]);
    }

    public decrementDoorDirection(): void
    {
        if(this._floorPlanService.floorMapSettings.doorDirection === 0)
            this._floorPlanService.floorMapSettings.doorDirection = 7;
        else
            this._floorPlanService.floorMapSettings.doorDirection--;
    }

    public incrementDoorDirection(): void
    {
        if(this._floorPlanService.floorMapSettings.doorDirection === 7)
            this._floorPlanService.floorMapSettings.doorDirection = 0;
        else
            this._floorPlanService.floorMapSettings.doorDirection++;
    }

    public decrementWallheight(): void
    {
        if(this._floorPlanService.floorMapSettings.wallHeight === 1)
            this._floorPlanService.floorMapSettings.wallHeight = 16;
        else
            this._floorPlanService.floorMapSettings.wallHeight--;
    }

    public incrementWallheight(): void
    {
        if(this._floorPlanService.floorMapSettings.wallHeight === 16)
            this._floorPlanService.floorMapSettings.wallHeight = 1;
        else
            this._floorPlanService.floorMapSettings.wallHeight++;
    }

    public openImportExport(): void
    {
        this._floorPlanService.floorMapSettings.heightMapString = this._floorPlanService.generateTileMapString();

        let modal = this._importExportModal;

        if(!modal)
        {
            modal = this._importExportModal = this._modalService.open(FloorPlanImportExportComponent, {
                backdrop: 'static',
                centered: true,
                keyboard: false
            });

            modal.result.then(() => (this._importExportModal = null));
        }

        this._importExportModal = modal;

        if(this._importExportModal)
        {
            const instance = (modal.componentInstance as FloorPlanImportExportComponent);

            if(instance)
            {
                instance.map = this.currentModel;
            }
        }
    }

    public toggleEditor(): void
    {
        this.minimize = !this.minimize;
    }

    public livePreview(): void
    {
        this.toggleEditor();
    }

    public get colorMap(): object
    {
        return Object.keys(this._colorMap)
            .filter(key => key !== 'x')
            .reduce((obj, key) =>
            {
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
        return this._floorPlanService.maxTilesCount;
    }

    public get roomPreviewer(): RoomPreviewer
    {
        return this._roomPreviewer;
    }

    public get currentModel(): string
    {
        return this._floorPlanService.floorMapSettings.heightMapString;
    }

    public get doorDirection(): number
    {
        return this._floorPlanService.floorMapSettings.doorDirection;
    }

    public get wallHeight(): number
    {
        return this._floorPlanService.floorMapSettings.wallHeight;
    }

    public get thicknessWall(): number
    {
        return this._floorPlanService.floorMapSettings.thicknessWall;
    }

    public set thicknessWall(tickness: number)
    {
        this._floorPlanService.floorMapSettings.thicknessWall = tickness;
    }
    public get thicknessFloor(): number
    {
        return this._floorPlanService.floorMapSettings.thicknessFloor;
    }

    public set thicknessFloor(tickness: number)
    {
        this._floorPlanService.floorMapSettings.thicknessFloor = tickness;
    }
}
