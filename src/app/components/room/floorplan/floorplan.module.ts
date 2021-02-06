import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared';
import { FloorPlanImportExportComponent } from './components/import-export/import-export.component';
import { FloorplanMainComponent } from './components/main/main.component';
import { FloorPlanService } from './services/floorplan.service';

@NgModule({
    imports: [
        SharedModule
    ],
    exports: [
        FloorplanMainComponent,
        FloorPlanImportExportComponent

    ],
    providers: [
        FloorPlanService
    ],
    declarations: [
        FloorplanMainComponent,
        FloorPlanImportExportComponent
    ],
    entryComponents: [FloorPlanImportExportComponent]
})
export class FloorplanModule
{}
