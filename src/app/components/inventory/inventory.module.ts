import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared';
import { InventoryBotsComponent } from './components/bots/bots.component';
import { InventoryFurnitureComponent } from './components/furniture/furniture.component';
import { InventoryMainComponent } from './components/main/main.component';
import { InventoryPetsComponent } from './components/pets/pets.component';
import { InventoryTradingComponent } from './components/trading/trading.component';
import { InventoryFurnitureService } from './services/furniture.service';
import { InventoryService } from './services/inventory.service';
import { InventoryTradingService } from './services/trading.service';

@NgModule({
	imports: [
        SharedModule
    ],
    exports: [
        InventoryBotsComponent,
        InventoryFurnitureComponent,
        InventoryMainComponent,
        InventoryPetsComponent,
        InventoryTradingComponent
    ],
    providers: [
        InventoryService,
        InventoryFurnitureService,
        InventoryTradingService
    ],
    declarations: [
        InventoryBotsComponent,
        InventoryFurnitureComponent,
        InventoryMainComponent,
        InventoryPetsComponent,
        InventoryTradingComponent
    ]
})
export class InventoryModule {}