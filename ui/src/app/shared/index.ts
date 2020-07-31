import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingComponent } from './components/loading/component';

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
		LoadingComponent
	],
	declarations: [
		LoadingComponent
	]
})
export class SharedModule {}