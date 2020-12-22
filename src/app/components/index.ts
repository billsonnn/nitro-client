import { NgModule } from '@angular/core';
import { SharedModule } from '../shared';
import { AlertModule } from './alert/alert.module';
import { AvatarEditorModule } from './avatareditor/avatareditor.module';
import { CallForHelpModule } from './call-for-help/call-for-help.module';
import { CatalogModule } from './catalog/catalog.module';
import { MainComponent } from './component';
import { HabbopediaModule } from './habbopedia/habbopedia.module';
import { HotelViewModule } from './hotelview';
import { InventoryModule } from './inventory/inventory.module';
import { NavigatorModule } from './navigator/navigator.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PurseModule } from './purse/purse.module';
import { RoomModule } from './room/room.module';
import { ToolbarModule } from './toolbar/toolbar.module';
import { WiredModule } from './wired/wired.module';

@NgModule({
	imports: [
        SharedModule,
        AlertModule,
        AvatarEditorModule,
        CallForHelpModule,
        CatalogModule,
        HabbopediaModule,
        HotelViewModule,
        InventoryModule,
        NavigatorModule,
        NotificationsModule,
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