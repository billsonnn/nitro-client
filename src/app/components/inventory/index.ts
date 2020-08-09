import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared';
import { InventoryComponent } from './component';

@NgModule({
	imports: [
        SharedModule
    ],
    exports: [
        InventoryComponent
    ],
    providers: [
    ],
    declarations: [
        InventoryComponent
    ]
})
export class InventoryModule {}