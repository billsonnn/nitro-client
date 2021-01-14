import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared';
import { ToolbarMainComponent } from './components/main/main.component';

@NgModule({
    imports: [
        SharedModule
    ],
    exports: [
        ToolbarMainComponent
    ],
    providers: [
    ],
    declarations: [
        ToolbarMainComponent
    ]
})
export class ToolbarModule 
{}