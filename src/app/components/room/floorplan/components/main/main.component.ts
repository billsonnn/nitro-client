import {
    Component,
    ElementRef,
    Input,
    NgZone,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Application, Container, ParticleContainer } from 'pixi.js';
import { RoomBlockedTilesComposer } from '../../../../../../client/nitro/communication/messages/outgoing/room/mapping/RoomBlockedTilesComposer';
import { RoomDoorSettingsComposer } from '../../../../../../client/nitro/communication/messages/outgoing/room/mapping/RoomDoorSettingsComposer';
import { Nitro } from '../../../../../../client/nitro/Nitro';
import { RoomPreviewer } from '../../../../../../client/nitro/room/preview/RoomPreviewer';
import { SettingsService } from '../../../../../core/settings/service';
import { FloorPlanService } from '../../services/floorplan.service';
import { FloorPlanImportExportComponent } from '../import-export/import-export.component';

@Component({
    selector: 'nitro-floorplan-main-component',
    templateUrl: './main.template.html'
})

export class FloorplanMainComponent implements OnInit, OnChanges, OnDestroy
{
    @ViewChild('floorplanElement')
    public floorplanElement: ElementRef<HTMLDivElement>;

    @Input('visible')
    public visible: boolean = false;

    public minimize: boolean;

    private _app: Application;
    private _roomPreviewer: RoomPreviewer;
    private _importExportModal: NgbModalRef;

    public scaleX: string = '0.9';
    public scaleY: string = '0.9';
    public skewX: string = '1.11';
    public skewY: string = '-0.46';


    constructor(
        private _ngZone: NgZone,
        private floorPlanService: FloorPlanService,
        private _modalService: NgbModal,
        private _settingsService: SettingsService)
    {
        this.floorPlanService.component = this;

        this._clear();

    }

    public ngOnInit(): void
    {
        this._roomPreviewer = new RoomPreviewer(Nitro.instance.roomEngine, ++RoomPreviewer.PREVIEW_COUNTER);
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

    public ngOnDestroy(): void
    {
        if(this._roomPreviewer)
        {
            this._roomPreviewer.dispose();

            this._roomPreviewer = null;
        }
    }


    private _clear(): void
    {
        this.floorPlanService.clear();

        this._ngZone.runOutsideAngular(() =>
        {
            this._importExportModal = null;

            // if(this._app)
            // {
            //     this._app.destroy(true);
            //
            //     this._app = null;
            // }
        });
    }

    public close(): void
    {
        this._settingsService.floorPlanVisible = false;
    }

    public preview(mapString: string)
    {
        const { doorX, doorY, doorDirection, thicknessWall, thicknessFloor } = this.floorPlanService.floorMapSettings;
        this.init(mapString, this.floorPlanService.blockedTilesMap, doorX, doorY, doorDirection, thicknessWall, thicknessFloor);
    }

    public render() : void
    {
        if(this._app)
        {
            this._app.stage.removeChildren();
        }
        this._ngZone.runOutsideAngular(() =>
        {


        });
        this.floorPlanService.render();
    }

    public init(mapString: string, blockedTilesMap: boolean[][], doorX: number, doorY: number, doorDirection: number, thicknessWall: number, thicknessFloor: number)
    {
        console.log('INIT!!!!!');
        this._clear();

        //this._roomPreviewer.updatePreviewModel(mapString, 3, true);
        this.floorPlanService.floorMapSettings.heightMapString = mapString;
        this.floorPlanService.floorMapSettings.doorX = doorX;
        this.floorPlanService.floorMapSettings.doorY = doorY;
        this.floorPlanService.floorMapSettings.doorDirection = doorDirection;
        this.floorPlanService.blockedTilesMap = blockedTilesMap;

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


        this._ngZone.runOutsideAngular(() =>
        {
            this._buildApp(width, height);
            this.floorPlanService.renderTileMap({
                scaleX: this.scaleX,
                scaleY: this.scaleY,
                skewX: this.skewX,
                skewY: this.skewY
            });
        });

    }

    private _buildApp(width: number, height: number): void
    {
        if(!this._app)
        {

            this._app = new Application({
                width: 2086,
                height: 1124,
                backgroundColor: 0x2b2b2b,
                antialias: true,
                autoDensity: true,
                resolution: 2
            });



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
            this.floorplanElement.nativeElement.appendChild(this._app.view);

            this.floorplanElement.nativeElement.scrollTo(width / 3, 0);
        }
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
        this.floorPlanService.decrementHeight();
    }

    public incrementHeight(): void
    {
        this.floorPlanService.incrementHeight();

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

    public revertChanges(): void
    {
        this.floorPlanService.revertChanges();
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
        return Object.keys(this.floorPlanService.colorMap)
            .filter(key => key !== 'x')
            .reduce((obj, key) =>
            {
                obj[key] = this.floorPlanService.colorMap[key];
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
        return this.floorPlanService.wallHeight;
    }

    public get thicknessWall(): number
    {
        return this.floorPlanService.floorMapSettings.thicknessWall;
    }

    public set thicknessWall(thickness: number)
    {
        this.floorPlanService.floorMapSettings.thicknessWall = thickness;
    }

    public get thicknessFloor(): number
    {
        return this.floorPlanService.floorMapSettings.thicknessFloor;
    }

    public set thicknessFloor(tickness: number)
    {
        this.floorPlanService.floorMapSettings.thicknessFloor = tickness;
    }

    public get ableToRevertChanges(): boolean
    {
        return this.floorPlanService.changesMade;
    }

    public get app(): Application
    {
        return this._app;
    }

}
