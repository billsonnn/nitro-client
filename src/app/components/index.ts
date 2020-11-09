import { NgModule } from '@angular/core';
import { SharedModule } from '../shared';
import { AvatarEditorModule } from './avatareditor/avatareditor.module';
import { CatalogModule } from './catalog';
import { MainComponent } from './component';
import { HotelViewModule } from './hotelview';
import { InventoryModule } from './inventory';
import { NavigatorModule } from './navigator';
import { PurseModule } from './purse';
import { RoomModule } from './room/room.module';
import { ToolbarModule } from './toolbar';

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
        ToolbarModule
    ],
    exports: [
        MainComponent
    ],
    declarations: [
        MainComponent
    ]
})
export class ComponentsModule {} 