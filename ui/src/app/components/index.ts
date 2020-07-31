import { NgModule } from '@angular/core';
import { SharedModule } from '../shared';
import { MainComponent } from './component';
import { HotelViewModule } from './hotelview';
import { RoomModule } from './room';

@NgModule({
	imports: [
        SharedModule,
        HotelViewModule,
        RoomModule
    ],
    exports: [
        MainComponent
    ],
    declarations: [
        MainComponent
    ]
})
export class ComponentsModule {} 