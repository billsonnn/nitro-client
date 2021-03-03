import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { InventoryBadgesComponent } from './components/badges/badges.component';
import { InventoryBotsComponent } from './components/bots/bots.component';
import { InventoryFurnitureComponent } from './components/furniture/furniture.component';
import { InventoryMainComponent } from './components/main/main.component';
import { InventoryPetsComponent } from './components/pets/pets.component';
import { InventoryTradingComponent } from './components/trading/trading.component';
import { InventoryBadgeService } from './services/badge.service';
import { InventoryBotService } from './services/bot.service';
import { InventoryFurnitureService } from './services/furniture.service';
import { InventoryService } from './services/inventory.service';
import { InventoryTradingService } from './services/trading.service';

@NgModule({
    imports: [
        SharedModule
    ],
    exports: [
        InventoryBotsComponent,
        InventoryBadgesComponent,
        InventoryFurnitureComponent,
        InventoryMainComponent,
        InventoryPetsComponent,
        InventoryTradingComponent
    ],
    providers: [
        InventoryBadgeService,
        InventoryBotService,
        InventoryFurnitureService,
        InventoryService,
        InventoryTradingService
    ],
    declarations: [
        InventoryBotsComponent,
        InventoryBadgesComponent,
        InventoryFurnitureComponent,
        InventoryMainComponent,
        InventoryPetsComponent,
        InventoryTradingComponent
    ]
})
export class InventoryModule
{}
