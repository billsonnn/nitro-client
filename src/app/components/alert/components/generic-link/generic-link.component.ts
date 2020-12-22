import { Component } from '@angular/core';
import { AlertGenericComponent } from '../generic/generic.component';

@Component({
    templateUrl: './generic-link.template.html'
})
export class AlertGenericLinkComponent extends AlertGenericComponent
{
    public link: string = '';

    public openLink(): void
    {
        window.open(this.link, '_blank');
    }

    public get hasLink(): boolean
    {
        return (this.link.length > 0);
    }
}