import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BadgeImageReadyEvent, Nitro, NitroSprite, TextureUtils } from '@nitrots/nitro-renderer';

@Component({
    selector: 'nitro-badge',
    template: `
    <img [src]="badgeUrl" image-placeholder />`
})
export class BadgeComponent implements OnInit, OnDestroy
{
    @Input()
    public badge: string = '';

    @Input()
    public isGroup?: boolean = false;

    @Input()
    public hover?: boolean = true;

    public badgeUrl: string = null;

    constructor()
    {
        this.onBadgeImageReadyEvent = this.onBadgeImageReadyEvent.bind(this);
    }

    public ngOnInit(): void
    {
        if(!this.badge || !this.badge.length) return;

        const existing = (this.isGroup) ? Nitro.instance.sessionDataManager.loadGroupBadgeImage(this.badge) : Nitro.instance.sessionDataManager.loadBadgeImage(this.badge);

        if(!existing)
        {
            Nitro.instance.sessionDataManager.events.addEventListener(BadgeImageReadyEvent.IMAGE_READY, this.onBadgeImageReadyEvent);
        }
        else
        {
            const image = (this.isGroup) ? Nitro.instance.sessionDataManager.getGroupBadgeImage(this.badge) : Nitro.instance.sessionDataManager.getBadgeImage(this.badge);
            const nitroSprite = new NitroSprite(image);

            this.badgeUrl = TextureUtils.generateImageUrl(nitroSprite);
        }
    }

    public ngOnDestroy(): void
    {
        Nitro.instance.sessionDataManager.events.removeEventListener(BadgeImageReadyEvent.IMAGE_READY, this.onBadgeImageReadyEvent);
    }

    private onBadgeImageReadyEvent(event: BadgeImageReadyEvent): void
    {
        if(event.badgeId !== this.badge) return;

        const nitroSprite = new NitroSprite(event.image);

        this.badgeUrl = TextureUtils.generateImageUrl(nitroSprite);

        Nitro.instance.sessionDataManager.events.removeEventListener(BadgeImageReadyEvent.IMAGE_READY, this.onBadgeImageReadyEvent);
    }
}
