import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AvatarImageComponent } from './components/avatarimage/component';
import { BadgeComponent } from './components/badge/component';
import { LoadingComponent } from './components/loading/component';
import { BringToTopDirective } from './directives/bringtotop/directive';
import { DraggableDirective } from './directives/draggable/directive';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule
	],
	exports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		AvatarImageComponent,
		BadgeComponent,
		LoadingComponent,
		DraggableDirective,
		BringToTopDirective
	],
	declarations: [
		AvatarImageComponent,
		BadgeComponent,
		LoadingComponent,
		DraggableDirective,
		BringToTopDirective
	]
})
export class SharedModule {}