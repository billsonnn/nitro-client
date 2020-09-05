import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared';
import { InventoryComponent } from './component';
import { InventoryFurniComponent } from './furni/component';
import { InventoryFurniGridComponent } from './furni/grid/component';
import { InventoryFurniGridItemComponent } from './furni/grid/griditem/component';
import { InventoryFurniSearchComponent } from './furni/search/component';
import { InventoryFurniService } from './services/inventory.furni.service';
import { InventoryService } from './services/inventory.service';

@NgModule({
	imports: [
        SharedModule
    ],
    exports: [
        InventoryComponent,
        InventoryFurniComponent,
        InventoryFurniGridComponent,
        InventoryFurniGridItemComponent,
        InventoryFurniSearchComponent
    ],
    providers: [
        InventoryService,
        InventoryFurniService
    ],
    declarations: [
        InventoryComponent,
        InventoryFurniComponent,
        InventoryFurniGridComponent,
        InventoryFurniGridItemComponent,
        InventoryFurniSearchComponent
    ]
})
export class InventoryModule {}