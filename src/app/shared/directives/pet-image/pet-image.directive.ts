import { Directive, ElementRef, Input, NgZone, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AdvancedMap } from 'nitro-renderer/src/core/utils/AdvancedMap';
import { PetFigureData } from 'nitro-renderer/src/nitro/avatar/pets/PetFigureData';
import { Nitro } from 'nitro-renderer/src/nitro/Nitro';
import { IGetImageListener } from 'nitro-renderer/src/nitro/room/IGetImageListener';
import { ImageResult } from 'nitro-renderer/src/nitro/room/ImageResult';
import { TextureUtils } from 'nitro-renderer/src/room/utils/TextureUtils';
import { Vector3d } from 'nitro-renderer/src/room/utils/Vector3d';
import { RenderTexture } from 'pixi.js';

@Directive({
    selector: '[pet-image]'
})
export class PetImageDirective implements OnInit, OnChanges, IGetImageListener
{
    private static MAX_CACHE_SIZE: number = 10;

    @Input()
    public petFigureData: PetFigureData = null;

    @Input()
    public headOnly: boolean = false;

    @Input()
    public direction: number = 0;

    @Input()
    public scale: number = 1;

    @Input()
    public asBackground: boolean = false;

    @Input()
    public typeId: number = null;

    @Input()
    public paletteId: number =null;

    @Input()
    public color: number  = 0xFFFFFF;

    private _petImageCache: AdvancedMap<string, string> = new AdvancedMap();

    public petUrl: string	= null;
    public disposed: boolean	= false;
    public needsUpdate: boolean	= true;

    constructor(
        private _elementRef: ElementRef<HTMLDivElement>,
        private _ngZone: NgZone)
    {}

    public ngOnInit(): void
    {
        if(this.needsUpdate) this.buildImage();
    }

    public ngOnChanges(changes: SimpleChanges): void
    {
        const figureChange = changes.petFigureData;

        if(figureChange)
        {
            if(figureChange.previousValue !== figureChange.currentValue) this.needsUpdate = true;
        }

        const headOnlyChange = changes.headOnly;

        if(headOnlyChange)
        {
            if(headOnlyChange.previousValue !== headOnlyChange.currentValue) this.needsUpdate = true;
        }

        const directionChange = changes.direction;

        if(directionChange)
        {
            if(directionChange.previousValue !== directionChange.currentValue) this.needsUpdate = true;
        }

        if(this.needsUpdate) this.buildImage();
    }

    public dispose(): void
    {
        if(this.disposed) return;
    }

    private buildImage(): void
    {
        this.needsUpdate = false;

        const imageUrl = this.getPetImageUrl();
        if(!imageUrl || !imageUrl.length) return;

        const element = this._elementRef.nativeElement;

        if(!element) return;

        if(this.asBackground)
        {
            element.style.backgroundImage = `url(${ imageUrl })`;
        }
        else
        {
            const existingImages = element.getElementsByClassName('pet-image');

            let i = existingImages.length;

            while(i < 0)
            {
                const imageElement = (existingImages[i] as HTMLImageElement);

                imageElement.remove();

                i--;
            }

            const imageElement = document.createElement('img');

            imageElement.className = `pet-image scale-${ this.scale }`;

            imageElement.src = imageUrl;
        }
    }

    private getPetImageUrl(): string
    {
        const build = this.getPetBuildString();

        let existing = this._petImageCache.getValue(build);

        if(existing && existing.length) return existing;

        let imageResult: ImageResult = null;

        const typeId = this.petFigureData ? this.petFigureData.typeId : this.typeId;
        const paletteId = this.petFigureData ? this.petFigureData.paletteId : this.paletteId;
        const color = this.petFigureData ? this.petFigureData.color : this.color;

        this._ngZone.runOutsideAngular(() =>
        {

            imageResult = Nitro.instance.roomEngine.getRoomObjectPetImage(typeId, paletteId, color, new Vector3d((this.direction * 45)), 64, this, this.headOnly, 0, null, 'std');

            if(imageResult)
            {
                const image = imageResult.getImage();

                if(image) existing = image.src;
            }
        });

        if(existing)
        {
            this.putInCache(build, existing);

            return existing;
        }

        return null;
    }

    public imageReady(id: number, texture: RenderTexture, image: HTMLImageElement): void
    {
        let url: string = null;

        if(image)
        {
            url = image.src;
        }

        else if(texture)
        {
            url = TextureUtils.generateImageUrl(texture);
        }

        if(url && url.length) this.putInCache(this.getPetBuildString(), url);

        this.buildImage();
    }

    public imageFailed(id: number): void
    {
        return;
    }

    private putInCache(build: string, url: string): void
    {
        if(this._petImageCache.length === PetImageDirective.MAX_CACHE_SIZE) this._petImageCache.remove(this._petImageCache.getKey(0));

        this._petImageCache.remove(build);
        this._petImageCache.add(build, url);
    }

    public getPetBuildString(): string
    {
        if(!this.petFigureData) return '';


        return (`${ this.petFigureData.figureString }:${ this.headOnly }:${ this.direction }`);
    }
}
