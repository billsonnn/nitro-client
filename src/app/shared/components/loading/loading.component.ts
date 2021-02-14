import { Component, Input } from '@angular/core';

@Component({
    selector: 'nitro-loading',
    templateUrl: './loading.template.html'
})
export class LoadingComponent
{
	@Input()
	public message?: string = '';

	@Input()
	public percentage?: number = 0;

	@Input()
	public hideProgress?: boolean = false;
}
