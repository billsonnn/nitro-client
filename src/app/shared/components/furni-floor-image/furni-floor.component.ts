import { Component, Input, NgZone, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { RenderTexture } from 'pixi.js';
import { Nitro } from '../../../../client/nitro/Nitro';
import { IGetImageListener } from '../../../../client/nitro/room/IGetImageListener';
import { TextureUtils } from '../../../../client/room/utils/TextureUtils';
import { Vector3d } from '../../../../client/room/utils/Vector3d';

@Component({
    selector: '[nitro-furni-floor-image]',
    template: `
    <img *ngIf="imageUrl" class="d-block" [src]="imageUrl" />`
})
export class FurniFloorImageComponent implements OnInit, OnChanges, IGetImageListener
{
    @Input()
    public spriteId = -1;

    @Input()
    public direction: Vector3d = new Vector3d(0);

    @Input()
    public extras = '';

    @Input()
    public backgroundColor = 0;

    public imageUrl: string     = null;
    public needsUpdate: boolean = true;

    constructor(private _ngZone: NgZone)
    {}

    public ngOnInit(): void
    {
        if(this.needsUpdate) this.buildImage();
    }

    public ngOnChanges(changes: SimpleChanges): void
    {
        const spriteIdChange = changes.spriteId;

        if(spriteIdChange)
        {
            if(spriteIdChange.previousValue !== spriteIdChange.currentValue) this.needsUpdate = true;
        }

        const extrasChange = changes.extras;

        if(extrasChange)
        {
            if(extrasChange.previousValue !== extrasChange.currentValue) this.needsUpdate = true;
        }

        const directionChange = changes.direction;

        if(directionChange)
        {
            if(directionChange.previousValue !== directionChange.currentValue) this.needsUpdate = true;
        }

        if(this.needsUpdate) this.buildImage();
    }

    private buildImage(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            this.needsUpdate = false;

            const imageResult = Nitro.instance.roomEngine.getFurnitureFloorImage(this.spriteId, this.direction, 64, this, this.backgroundColor, this.extras);

            if(imageResult)
            {
                const image = imageResult.getImage();
                if(image) this._ngZone.run(() => (this.imageUrl = image.src));
            }
        });
    }

    public imageReady(id: number, texture: RenderTexture, image: HTMLImageElement): void
    {
        if(!texture) return;

        if(image)
        {
            this._ngZone.run(() => this.imageUrl = image.src);

            return;
        }

        if(texture)
        {
            const imageUrl = TextureUtils.generateImageUrl(texture);
            if(imageUrl) this._ngZone.run(() => this.imageUrl = imageUrl);
        }
    }

    public imageFailed(id: number): void
    {

        return;
    }
}
