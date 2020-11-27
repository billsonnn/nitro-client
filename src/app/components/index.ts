import { NgModule } from '@angular/core';
import { SharedModule } from '../shared';
import { AvatarEditorModule } from './avatareditor/avatareditor.module';
import { CatalogModule } from './catalog';
import { MainComponent } from './component';
import { HotelViewModule } from './hotelview';
import { InventoryModule } from './inventory/inventory.module';
import { NavigatorModule } from './navigator/navigator.module';
import { PurseModule } from './purse';
import { RoomModule } from './room/room.module';
import { ToolbarModule } from './toolbar';
import { WiredModule } from './wired/wired.module';

@NgModule({
	imports: [
        SharedModule,
        AvatarEditorModule,
        CatalogModule,
        HotelViewModule,
        InventoryModule,
        NavigatorModule,
        PurseModule,
        RoomModule,
        ToolbarModule,
        WiredModule
    ],
    exports: [
        MainComponent
    ],
    declarations: [
        MainComponent
    ]
})
export class ComponentsModule {} 