import { Component } from '@angular/core';
import { AlertGenericComponent } from '../generic/generic.component';

@Component({
    templateUrl: './generic-link.template.html'
})
export class AlertGenericLinkComponent extends AlertGenericComponent
{
    public link: string = '';
}