import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared';
import { PurseCurrencyComponent } from './components/currency/currency.component';
import { PurseMainComponent } from './components/main/main.component';
import { PurseService } from './services/purse.service';

@NgModule({
	imports: [
        SharedModule
    ],
    exports: [
        PurseMainComponent,
        PurseCurrencyComponent
    ],
    providers: [
        PurseService
    ],
    declarations: [
        PurseMainComponent,
        PurseCurrencyComponent
    ]
})
export class PurseModule {}