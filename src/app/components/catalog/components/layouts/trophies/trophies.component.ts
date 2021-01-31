import { Component, OnInit } from '@angular/core';
import { RenderTexture } from 'pixi.js';
import { AdvancedMap } from '../../../../../../client/core/utils/AdvancedMap';
import { CatalogClubOfferData } from '../../../../../../client/nitro/communication/messages/parser/catalog/utils/CatalogClubOfferData';
import { CatalogPageOfferData } from '../../../../../../client/nitro/communication/messages/parser/catalog/utils/CatalogPageOfferData';
import { Nitro } from '../../../../../../client/nitro/Nitro';
import { IGetImageListener } from '../../../../../../client/nitro/room/IGetImageListener';
import { TextureUtils } from '../../../../../../client/room/utils/TextureUtils';
import { Vector3d } from '../../../../../../client/room/utils/Vector3d';
import { CatalogLayout } from '../../../CatalogLayout';

@Component({
    templateUrl: './trophies.template.html'
})
export class CatalogLayoutTrophiesComponent extends CatalogLayout implements OnInit, IGetImageListener
{
    public static CODE: string = 'trophies';

    private _trophyOffers                       = new AdvancedMap<string, AdvancedMap<string, CatalogPageOfferData>>();
    private _vipOffers: CatalogClubOfferData[]  = [];

    private _imageUrl: string                   = null;


    public ngOnInit(): void
    {
        const offers = this.activePage.offers;

        if(offers && offers.length)
        {
            for(const offer of offers)
            {
                if(!offer) continue;

                const local4 = this._Str_23368(offer.localizationId);
                const local5 = this._Str_19039(offer.localizationId);

                let existing = this._trophyOffers.getValue(local4);

                if(!existing)
                {
                    existing = new AdvancedMap();

                    this._trophyOffers.add(local4, existing);
                }

                existing.add(local5, offer);
            }
        }

        const firstOffer    = this._trophyOffers.getWithIndex(0);
        const product       = (firstOffer && firstOffer.getWithIndex(0));

        if(product) this.selectOffer(product);
    }

    public selectOffer(offer: CatalogPageOfferData): void
    {
        if(!offer) return;

        const product = offer.products[0];

        if(!product) return;

        const imageResult = Nitro.instance.roomEngine.getFurnitureFloorImage(product.furniClassId, new Vector3d(2, 0, 0), 64, this, 0, product.extraParam);

        if(imageResult)
        {
            const image = imageResult.getImage();

            if(image) this._imageUrl = image.src;
        }
    }

    public imageReady(id: number, texture: RenderTexture, image?: HTMLImageElement): void
    {
        if(texture)
        {
            const imageUrl = TextureUtils.generateImageUrl(texture);

            if(imageUrl)
            {
                this._ngZone.run(() => this._imageUrl = imageUrl);
            }
        }
    }

    public imageFailed(id: number): void
    {
        console.log('failed');
    }

    private _Str_23368(k: string): string
    {
        const local2 = this._Str_19039(k);

        if(local2.length > 0) return k.slice(0, ((k.length - 1) - local2.length));

        return k;
    }

    private _Str_19039(k: string): string
    {
        const indexTrophy = k.indexOf('prizetrophy_2011_');

        if(indexTrophy != -1) return '';

        const lastUnderscoreIndex = k.lastIndexOf('_') + 1;

        if(lastUnderscoreIndex <= 0) return '';

        const local4 = k.substr(lastUnderscoreIndex);

        if(local4.length > 1 || (local4 != 'g' && local4 != 's' && local4 != 'b')) return '';

        return local4;

    }

    public getText(): string
    {

        return '';
    }

    public get imageUrl(): string
    {
        return this._imageUrl;
    }
}
