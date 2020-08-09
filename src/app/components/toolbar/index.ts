import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared';
import { ToolbarComponent } from './component';

@NgModule({
	imports: [
        SharedModule
    ],
    exports: [
        ToolbarComponent
    ],
    providers: [
    ],
    declarations: [
        ToolbarComponent
    ]
})
export class ToolbarModule {}