import { Directive, ElementRef, Input, NgZone, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BadgeImageReadyEvent, Nitro, NitroSprite, TextureUtils } from '@nitrots/nitro-renderer';

@Directive({
    selector: '[badge-image]'
})
export class BadgeImageDirective implements OnInit, OnChanges
{
    @Input()
    public badge: string = '';

    @Input()
    public isGroup: boolean = false;

    @Input()
    public asBackground: boolean = false;

    public needsUpdate: boolean = true;

    constructor(
        private elementRef: ElementRef<HTMLDivElement>,
        private _ngZone: NgZone)
    {
        this.onBadgeImageReadyEvent = this.onBadgeImageReadyEvent.bind(this);
    }

    public ngOnInit(): void
    {
        this.updateBadge();
    }

    public ngOnChanges(changes: SimpleChanges): void
    {
        const badgeChange = changes.badge;

        if(badgeChange)
        {
            if(badgeChange.previousValue !== badgeChange.currentValue) this.needsUpdate = true;
        }

        const groupChange = changes.isGroup;

        if(groupChange)
        {
            if(groupChange.previousValue !== groupChange.currentValue) this.needsUpdate = true;
        }

        if(this.needsUpdate) this.updateBadge();
    }

    public ngOnDestroy(): void
    {
        Nitro.instance.sessionDataManager.events.removeEventListener(BadgeImageReadyEvent.IMAGE_READY, this.onBadgeImageReadyEvent);
    }

    private onBadgeImageReadyEvent(event: BadgeImageReadyEvent): void
    {
        if(event.badgeId !== this.badge) return;

        const nitroSprite = new NitroSprite(event.image);

        this._ngZone.run(() => this.buildBadgeWithUrl(TextureUtils.generateImageUrl(nitroSprite)));

        Nitro.instance.sessionDataManager.events.removeEventListener(BadgeImageReadyEvent.IMAGE_READY, this.onBadgeImageReadyEvent);
    }

    private updateBadge(): void
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

            this._ngZone.run(() => this.buildBadgeWithUrl(TextureUtils.generateImageUrl(nitroSprite)));
        }
    }

    private buildBadgeWithUrl(imageUrl: string): void
    {
        this.needsUpdate = false;

        if(!imageUrl || !imageUrl.length) return;

        const element = this.elementRef.nativeElement;

        if(!element) return;

        if(this.asBackground)
        {
            element.style.backgroundImage = `url(${ imageUrl })`;
        }
        else
        {
            const existingImages = [ ...element.getElementsByClassName('badge-image') ];

            for(const existingElement of existingImages) existingElement.remove();

            const imageElement = document.createElement('img');

            imageElement.className = 'badge-image';

            imageElement.src = imageUrl;

            element.appendChild(imageElement);
        }
    }
}
