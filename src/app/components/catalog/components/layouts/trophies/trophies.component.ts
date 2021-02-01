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
import { CatalogProductOfferData } from '../../../../../../client/nitro/communication/messages/parser/catalog/utils/CatalogProductOfferData';


@Component({
    templateUrl: './trophies.template.html'
})
export class CatalogLayoutTrophiesComponent extends CatalogLayout implements OnInit, IGetImageListener
{
    public static CODE: string = 'trophies';

    public textPages: string[]                          = [];

    private _trophyOffers                               = new AdvancedMap<string, AdvancedMap<string, CatalogPageOfferData>>();
    public currentTrophyOffer: CatalogPageOfferData          = null;

    private _imageUrl: string                           = null;

    private _currentTrophy: CatalogProductOfferData        = null;
    private _availableColorsForCurrentTrophy: string[] = null;
    private _currentIndex: number                       = 0;
    private readonly _orderOfColors = ['g','s','b'];
    public enteredText: string = '';


    public ngOnInit(): void
    {
        const offers = this.activePage.offers;

        this.textPages = this.activePage.localization.texts.filter(item => item && item.length > 0);


        if(offers && offers.length)
        {
            for(const offer of offers)
            {
                if(!offer) continue;

                const local4 = this.getTrophyNameWithoutColors(offer.localizationId);
                const trophyColorCharacter = this.getTrophyColorCharacter(offer.localizationId);

                let existing = this._trophyOffers.getValue(local4);

                if(!existing)
                {
                    existing = new AdvancedMap();

                    this._trophyOffers.add(local4, existing);
                }

                existing.add(trophyColorCharacter, offer);
            }
        }

        this.selectOfferByIndex(this._currentIndex);

    }

    private selectOfferByIndex(index: number): void
    {
        const firstOffer    = this._trophyOffers.getWithIndex(this._currentIndex);
        if(firstOffer) this.selectOffer(firstOffer);
    }

    private selectOffer(availaleOffers: AdvancedMap<string, CatalogPageOfferData>): void
    {

        if(!availaleOffers) return;

        let firstAvailableTrophyColor:CatalogPageOfferData = null;
        const availableColorsForTrophy:string[] = [];
        this._orderOfColors.map((color) =>
        {
            const colorIsAvailableForTrophy = availaleOffers.getValue(color);
            if(colorIsAvailableForTrophy) {
                availableColorsForTrophy.push(color);
            }
            if(!firstAvailableTrophyColor)
            {
                firstAvailableTrophyColor = colorIsAvailableForTrophy;
            }
        });

        if(!firstAvailableTrophyColor) firstAvailableTrophyColor = availaleOffers.getWithIndex(0); // Some trophies don't have a color. We want to show then either way.

        if(!firstAvailableTrophyColor) return;
        this.currentTrophyOffer = firstAvailableTrophyColor;
        const product = firstAvailableTrophyColor.products[0];

        if(!product) return;

        const imageResult = Nitro.instance.roomEngine.getFurnitureFloorImage(product.furniClassId, new Vector3d(2, 0, 0), 64, this, 0, product.extraParam);

        if(imageResult)
        {
            const image = imageResult.getImage();

            if(image) this._imageUrl = image.src;
        }


        this._currentTrophy = product;
        this._availableColorsForCurrentTrophy = availableColorsForTrophy;

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

    public handleButton(button: string)
    {

        switch(button)
        {
            case 'next':
                if((this._trophyOffers.length -1) == (this._currentIndex))
                {
                    this._currentIndex = 0;
                }
                else
                {
                    this._currentIndex++;
                }
                break;
            case 'previous':
                if(this._currentIndex == 0)
                {
                    this._currentIndex = this._trophyOffers.length -1;
                }
                else
                {
                    this._currentIndex--;
                }
                break;
        }

        this.selectOfferByIndex(this._currentIndex);
    }

    public imageFailed(id: number): void
    {
        console.log('failed');
    }

    public hasMultipleOffers(): boolean
    {
        return this._trophyOffers && this._trophyOffers.length > 0;
    }

    public trophyHasColor(color: string): boolean
    {
        return this._availableColorsForCurrentTrophy.indexOf(color) > -1;
    }

    private getTrophyNameWithoutColors(k: string): string
    {
        const local2 = this.getTrophyColorCharacter(k);

        if(local2.length > 0) return k.slice(0, ((k.length - 1) - local2.length));

        return k;
    }

    private getTrophyColorCharacter(k: string): string
    {
        const indexTrophy = k.indexOf('prizetrophy_2011_');

        if(indexTrophy != -1) return '';

        const lastUnderscoreIndex = k.lastIndexOf('_') + 1;

        if(lastUnderscoreIndex <= 0) return '';

        const local4 = k.substr(lastUnderscoreIndex);

        if(local4.length > 1 || (local4 != 'g' && local4 != 's' && local4 != 'b')) return '';

        return local4;

    }

    public buyCurrentItem(): void
    {
        this._catalogService.component && this._catalogService.component.confirmPurchase(this.activePage, this.currentTrophyOffer, 1, this.enteredText);
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
