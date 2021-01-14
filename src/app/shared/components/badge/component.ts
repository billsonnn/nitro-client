import { Component, Input } from '@angular/core';
import { Nitro } from '../../../../client/nitro/Nitro';

@Component({
    selector: 'nitro-badge',
    template: `
    <img [src]="badgeUrl" />`
})
export class BadgeComponent
{
    @Input()
    public badge: string = '';

    @Input()
    public hover?: boolean = true;

    public get badgeUrl(): string
    {
        return ((Nitro.instance.getConfiguration<string>('badge.asset.url')).replace('%badgename%', this.badge));
    }
}