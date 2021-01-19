import { NgModule } from '@angular/core';
import { ComponentsModule } from './components';
import { AppMainComponent } from './components/main/main.component';
import { CoreModule } from './core';
import { SecurityModule } from './security';
import { SharedModule } from './shared';

@NgModule({
    imports: [
        SharedModule,
        CoreModule,
        SecurityModule,
        ComponentsModule
    ],
    declarations: [
        AppMainComponent
    ],
    bootstrap: [ AppMainComponent ]
})
export class AppModule 
{}