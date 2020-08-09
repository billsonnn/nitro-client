import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared';
import { CatalogComponent } from './component';

@NgModule({
	imports: [
        SharedModule
    ],
    exports: [
        CatalogComponent
    ],
    providers: [
    ],
    declarations: [
        CatalogComponent
    ]
})
export class CatalogModule {}