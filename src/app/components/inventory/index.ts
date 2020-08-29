import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared';
import { InventoryComponent } from './component';
import { InventoryFurniComponent } from './furni/component';
import { InventoryService } from './services/inventory.service';

@NgModule({
	imports: [
        SharedModule
    ],
    exports: [
        InventoryComponent,
        InventoryFurniComponent
    ],
    providers: [
        InventoryService
    ],
    declarations: [
        InventoryComponent,
        InventoryFurniComponent
    ]
})
export class InventoryModule {}