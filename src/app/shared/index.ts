import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbDropdownModule, NgbModalModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxBootstrapSliderModule } from 'ngx-bootstrap-slider';
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
		NgxBootstrapSliderModule
	],
	exports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		NgbDropdownModule,
		NgbTooltipModule,
		NgbModalModule,
		NgxBootstrapSliderModule,
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
		AlertService
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