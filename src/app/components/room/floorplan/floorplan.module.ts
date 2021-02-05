import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared';
import { FloorplanMainComponent } from './components/main/main.component';

@NgModule({
    imports: [
        SharedModule
    ],
    exports: [
        FloorplanMainComponent,

    ],
    declarations: [
        FloorplanMainComponent,
    ]
})
export class FloorplanModule
{}
