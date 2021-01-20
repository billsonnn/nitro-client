import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbDropdownModule, NgbModalModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { NgxPaginationModule } from 'ngx-pagination';
import { PerfectScrollbarConfigInterface, PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { ToastrModule } from 'ngx-toastr';
import { AvatarImageComponent } from './components/avatarimage/component';
import { BadgeComponent } from './components/badge/component';
import { LoadingComponent } from './components/loading/component';
import { RoomPreviewComponent } from './components/roompreview/component';
import { BringToTopDirective } from './directives/bringtotop/directive';
import { DraggableDirective } from './directives/draggable/directive';
import { FormatShortPipe } from './pipes/formatShort';
import { EscapeHtmlPipe } from './pipes/keep-html.pipe';
import { TranslatePipe } from './pipes/translate';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ToastrModule.forRoot(),
        NgbDropdownModule,
        NgbTooltipModule,
        NgbModalModule,
        NgxPaginationModule,
        NgxSliderModule,
        PerfectScrollbarModule,
        MDBBootstrapModule.forRoot()
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ToastrModule,
        NgbDropdownModule,
        NgbTooltipModule,
        NgbModalModule,
        NgxPaginationModule,
        NgxSliderModule,
        PerfectScrollbarModule,
        MDBBootstrapModule,
        AvatarImageComponent,
        BadgeComponent,
        LoadingComponent,
        RoomPreviewComponent,
        DraggableDirective,
        BringToTopDirective,
        EscapeHtmlPipe,
        TranslatePipe,
        FormatShortPipe
    ],
    providers: [
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        }
    ],
    declarations: [
        AvatarImageComponent,
        BadgeComponent,
        LoadingComponent,
        RoomPreviewComponent,
        DraggableDirective,
        BringToTopDirective,
        EscapeHtmlPipe,
        TranslatePipe,
        FormatShortPipe
    ]
})
export class SharedModule 
{}