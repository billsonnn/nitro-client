import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared';
import { FloorPlanImportExportComponent } from './components/import-export/import-export.component';
import { FloorplanMainComponent } from './components/main/main.component';

@NgModule({
    imports: [
        SharedModule
    ],
    exports: [
        FloorplanMainComponent,
        FloorPlanImportExportComponent

    ],
    declarations: [
        FloorplanMainComponent,
        FloorPlanImportExportComponent
    ],
    entryComponents: [FloorPlanImportExportComponent]
})
export class FloorplanModule
{}
