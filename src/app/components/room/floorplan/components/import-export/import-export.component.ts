import { Component, Input, NgZone } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FloorPlanService } from '../../services/floorplan.service';

@Component({
    selector: '[nitro-floorplan-import-export-component]',
    templateUrl: './import-export.template.html'
})
export class FloorPlanImportExportComponent
{
    private _map: string = null;
    private _backupMap: string = null;

    public fontSize: string = '12';
    public letterSpacing: string = '3';

    constructor(
        private _activeModal: NgbActiveModal,
        private _floorPlanService: FloorPlanService,
        private _ngZone: NgZone)
    {}
    
    public revert(): void
    {
        this._ngZone.run(() => {
            this._map = this._backupMap;
        });
    }

    public preview(): void
    {
        this._floorPlanService.importFloorPlan(this._map);
        this.close();
    }

    public close(): void
    {
        this._activeModal.close();
    }

    @Input() public set map(map: string)
    {
        this._map = map;

        if(!this._backupMap) this._backupMap = map.replace(/\r\n|\r|\n/g, '\r').toLowerCase();
    }

    public get map(): string
    {
        return this._map;
    }
}