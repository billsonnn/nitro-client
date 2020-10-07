import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared';
import { NavigatorComponent } from './component';
import { NavigatorSearchComponent } from './search/component';
import { NavigatorSearchResultComponent } from './search/result/component';
import { NavigatorSearchResultItemComponent } from './search/result/item/component';
import { NavigatorService } from './service';

@NgModule({
	imports: [
        SharedModule
    ],
    exports: [
        NavigatorComponent,
        NavigatorSearchComponent,
        NavigatorSearchResultComponent,
        NavigatorSearchResultItemComponent
    ],
    providers: [
        NavigatorService
    ],
    declarations: [
        NavigatorComponent,
        NavigatorSearchComponent,
        NavigatorSearchResultComponent,
        NavigatorSearchResultItemComponent
    ]
})
export class NavigatorModule {}