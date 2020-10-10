import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared';
import { InventoryComponent } from './component';
import { InventoryFurnitureComponent } from './furniture/component';
import { InventoryFurnitureService } from './furniture/service';
import { InventoryService } from './service';
import { InventoryTradingComponent } from './trading/component';
import { InventoryTradingService } from './trading/service';

@NgModule({
	imports: [
        SharedModule
    ],
    exports: [
        InventoryComponent,
        InventoryFurnitureComponent,
        InventoryTradingComponent
    ],
    providers: [
        InventoryService,
        InventoryFurnitureService,
        InventoryTradingService
    ],
    declarations: [
        InventoryComponent,
        InventoryFurnitureComponent,
        InventoryTradingComponent
    ]
})
export class InventoryModule {}