import { NgModule } from '@angular/core';
import { SharedModule } from '../shared';
import { AvatarEditorModule } from './avatareditor/avatareditor.module';
import { CatalogModule } from './catalog/catalog.module';
import { MainComponent } from './component';
import { HotelViewModule } from './hotelview';
import { InventoryModule } from './inventory/inventory.module';
import { NavigatorModule } from './navigator/navigator.module';
import { PurseModule } from './purse/purse.module';
import { RoomModule } from './room/room.module';
import { ToolbarModule } from './toolbar/toolbar.module';
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