import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { NgbDropdownModule, NgbModalModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarConfigInterface, PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { ToastrModule } from 'ngx-toastr';
import { AlertToastComponent } from './components/alerts/alert/component';
import { ConfirmToastComponent } from './components/alerts/confirm/component';
import { AvatarImageComponent } from './components/avatarimage/component';
import { BadgeComponent } from './components/badge/component';
import { FurnitureGridComponent } from './components/furnituregrid/component';
import { LoadingComponent } from './components/loading/component';
import { RoomPreviewComponent } from './components/roompreview/component';
import { BringToTopDirective } from './directives/bringtotop/directive';
import { DraggableDirective } from './directives/draggable/directive';
import { TranslatePipe } from './pipes/translate';
import { AlertService } from './services/alert/service';

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
		NgxSliderModule,
		PickerModule,
		EmojiModule,
		PerfectScrollbarModule
	],
	exports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		ToastrModule,
		NgbDropdownModule,
		NgbTooltipModule,
		NgbModalModule,
		NgxSliderModule,
		PickerModule,
		EmojiModule,
		PerfectScrollbarModule,
		AvatarImageComponent,
		BadgeComponent,
		FurnitureGridComponent,
		LoadingComponent,
		RoomPreviewComponent,
		DraggableDirective,
		BringToTopDirective,
		TranslatePipe
	],
	providers: [
		AlertService,
		{
			provide: PERFECT_SCROLLBAR_CONFIG,
			useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
		}
	],
	declarations: [
		AlertToastComponent,
		ConfirmToastComponent,
		AvatarImageComponent,
		BadgeComponent,
		FurnitureGridComponent,
		LoadingComponent,
		RoomPreviewComponent,
		DraggableDirective,
		BringToTopDirective,
		TranslatePipe
	],
	entryComponents: [ ConfirmToastComponent, AlertToastComponent ]
})
export class SharedModule {}