import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
        ComponentsModule,
        BrowserModule,
        BrowserAnimationsModule
    ],
    declarations: [
        AppMainComponent
    ],
    bootstrap: [ AppMainComponent ]
})
export class AppModule 
{}