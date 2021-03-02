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


    private _blockedTilesMap: boolean[][];

    private _app: Application;
    private _container: Container;




    private _heightScheme: string = 'x0123456789abcdefghijklmnopq';
    private _colorMap: object = {
        'x': '0x101010',
        '0': '0x0065ff',
        '1': '0x0091ff',
        '2': '0x00bcff',
        '3': '0x00e8ff',
        '4': '0x00ffea',
        '5': '0x00ffbf',
        '6': '0x00ff93',
        '7': '0x00ff68',
        '8': '0x00ff3d',
        '9': '0x19ff00',
        'a': '0x44ff00',
        'b': '0x70ff00',
        'c': '0x9bff00',
        'd': '0xf2ff00',
        'e': '0xffe000',
        'f': '0xffb500',
        'g': '0xff8900',
        'h': '0xff5e00',
        'i': '0xff3200',
        'j': '0xff0700',
        'k': '0xff0023',
        'l': '0xff007a',
        'm': '0xff00a5',
        'n': '0xff00d1',
        'o': '0xff00fc',
        'p': '0xd600ff',
        'q': '0xaa00ff'
    };


    private _roomPreviewer: RoomPreviewer;
    private _importExportModal: NgbModalRef;

    constructor(
        private _ngZone: NgZone,
        private floorPlanService: FloorPlanService,
        private _modalService: NgbModal,
        private _settingsService: SettingsService)
    {
        this.floorPlanService.component = this;

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

        this._blockedTilesMap = [];

        this.floorPlanService.clear();


        this._roomPreviewer = new RoomPreviewer(Nitro.instance.roomEngine, ++RoomPreviewer.PREVIEW_COUNTER);
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
        const { doorX, doorY, doorDirection, thicknessWall, thicknessFloor } = this.floorPlanService.floorMapSettings;
        this.init(mapString, this._blockedTilesMap, doorX, doorY, doorDirection, thicknessWall, thicknessFloor);
    }

    public init(mapString: string, blockedTilesMap: boolean[][], doorX: number, doorY: number, doorDirection: number, thicknessWall: number, thicknessFloor: number)
    {
        this._clear();

        this.floorPlanService.floorMapSettings.heightMapString = mapString;
        this.floorPlanService.floorMapSettings.doorX = doorX;
        this.floorPlanService.floorMapSettings.doorY = doorY;
        this.floorPlanService.floorMapSettings.doorDirection = doorDirection;
        this._blockedTilesMap = blockedTilesMap;
        this.floorPlanService.floorMapSettings.thicknessWall = thicknessWall;
        this.floorPlanService.floorMapSettings.thicknessFloor = thicknessFloor;

        this._ngZone.run(() =>
        {
            this.floorPlanService.floorMapSettings.doorDirection = doorDirection;
        });

        this.floorPlanService.floorMapSettings.heightMap = this.floorPlanService.readTileMapString(mapString);

        const tileSize = this.floorPlanService.tileSize;
        const width = tileSize * this.floorPlanService.floorMapSettings.heightMap.length + 20;
        const height = (tileSize * this.floorPlanService.floorMapSettings.heightMap.length) / 2 + 100;

        this.floorPlanService.extraX = tileSize / 2 * this.floorPlanService.floorMapSettings.heightMap.length;

        this.floorPlanService.originalMapSettings = this.floorPlanService.floorMapSettings;

        this._buildApp(width, height);
        this.floorPlanService.renderTileMap(this._container);
    }

    private _buildApp(width: number, height: number): void
    {
        console.log('building app');
        if(this._app && this._container && this.floorplanElement.nativeElement.children.length > 0)
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

        this.floorplanElement.nativeElement.scrollTo(width / 3, 0);

        this._app.view.addEventListener('mousedown', () =>
        {
            this.floorPlanService.isHolding = true;
        });

        this._app.view.addEventListener('mouseup', () =>
        {
            this.floorPlanService.isHolding = false;
        });

        this._app.view.addEventListener('mouseout', () =>
        {
            this.floorPlanService.isHolding = false;
        });

    }





    public changeAction(action: string): void
    {
        this.floorPlanService.currentAction = action;
    }

    public selectHeight(heightIndex: string): void
    {
        this.floorPlanService.currentHeight = heightIndex;
        this.changeAction('set');
    }

    public getColor(hex: string): string
    {
        return hex.replace('0x', '#');
    }

    public save(): void
    {
        this.floorPlanService.floorMapSettings.heightMapString = this.floorPlanService.generateTileMapString();

        this.floorPlanService.save(this.floorPlanService.floorMapSettings);
    }

    public decrementHeight(): void
    {
        const colorIndex = this._heightScheme.indexOf(this.floorPlanService.currentHeight);

        if(colorIndex === 1) return;

        this.selectHeight(this._heightScheme[colorIndex - 1]);
    }

    public incrementHeight(): void
    {
        const colorIndex = this._heightScheme.indexOf(this.floorPlanService.currentHeight);

        if(colorIndex === this._heightScheme.length - 1) return;

        this.selectHeight(this._heightScheme[colorIndex + 1]);
    }

    public decrementDoorDirection(): void
    {
        this.floorPlanService.decrementDoorDirection();
    }

    public incrementDoorDirection(): void
    {
        this.floorPlanService.incrementDoorDirection();
    }

    public decrementWallheight(): void
    {
        this.floorPlanService.decrementWallheight();
    }

    public incrementWallheight(): void
    {
        this.floorPlanService.incrementWallheight();
    }

    public openImportExport(): void
    {
        this.floorPlanService.floorMapSettings.heightMapString = this.floorPlanService.generateTileMapString();

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
        return this.floorPlanService.currentAction;
    }

    public get currentHeight(): string
    {
        return this.floorPlanService.currentHeight;
    }

    public get coloredTilesCount(): number
    {
        return this.floorPlanService.coloredTilesCount;
    }

    public get maxTilesCount(): number
    {
        return this.floorPlanService.maxTilesCount;
    }

    public get roomPreviewer(): RoomPreviewer
    {
        return this._roomPreviewer;
    }

    public get currentModel(): string
    {
        return this.floorPlanService.floorMapSettings.heightMapString;
    }

    public get doorDirection(): number
    {
        return this.floorPlanService.floorMapSettings.doorDirection;
    }

    public get wallHeight(): number
    {
        return this.floorPlanService.floorMapSettings.wallHeight;
    }

    public get thicknessWall(): number
    {
        return this.floorPlanService.floorMapSettings.thicknessWall;
    }

    public set thicknessWall(tickness: number)
    {
        this.floorPlanService.floorMapSettings.thicknessWall = tickness;
    }

    public get thicknessFloor(): number
    {
        return this.floorPlanService.floorMapSettings.thicknessFloor;
    }

    public set thicknessFloor(tickness: number)
    {
        this.floorPlanService.floorMapSettings.thicknessFloor = tickness;
    }
}
