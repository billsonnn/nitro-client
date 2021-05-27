import { Component, NgZone, OnInit } from '@angular/core';
import { CatalogLayout } from '../../../CatalogLayout';
import { CatalogService } from '../../../services/catalog.service';
import { MarketplaceService } from '../../../services/marketplace.service';
import { SellablePetPaletteData } from 'nitro-renderer/src/nitro/communication/messages/parser/catalog/utils/SellablePetPaletteData';
import { Nitro } from 'nitro-renderer/src/nitro/Nitro';
import { CatalogRequestPetBreedsComposer } from 'nitro-renderer/src/nitro/communication/messages/outgoing/catalog/CatalogRequestPetBreedsComposer';
import { SellablePetPalettesEvent } from 'nitro-renderer/src/nitro/communication/messages/incoming/catalog/SellablePetPalettesEvent';
import { IProductData } from 'nitro-renderer/src/nitro/session/product/IProductData';

@Component({
    templateUrl: './pets.template.html'
})
export class CatalogLayoutPetsComponent extends CatalogLayout implements OnInit
{
    public static CODE: string = 'pets';

    public petIndex: number = -1;
    private colorsShowing: boolean = false;
    public sellablePalettes: SellablePetPaletteData[] = [];
    private selectedColorIndex: number = -1;
    private sellableColors: number[][] = [];
    private _palettesEvent: SellablePetPalettesEvent = null;
    private productData: IProductData;

    public selectedPalette: number = -1;

    public ngOnInit(): void
    {
        this._catalogService.setPetsPage(this);

        if(!this.offers || !this.offers.length) return;

        const offer = this.offers[0];

        if(!offer) return;

        this.setPetIndex(this.getPetIndexFromLocalization(offer.localizationId));
        this.setColorsShowing(false);


        this.productData = Nitro.instance.sessionDataManager.getProductData(offer.localizationId);
        Nitro.instance.communication.connection.send(new CatalogRequestPetBreedsComposer(this.productData.type));
    }

    private setColorsShowing(show: boolean): void
    {
        this.colorsShowing = show;
    }

    private setPetIndex(index: number): void
    {
        this.petIndex = index;

        if(index === -1) return;

        const colors = this.getPetAvailableColors(index, this.sellablePalettes);
        this.selectedColorIndex = colors.length ? 0 : -1;
        this.sellableColors = colors;
    }

    public getColor()
    {
        if(!this.sellableColors.length || this.selectedColorIndex === -1) return 0xFFFFFF;

        return this.sellableColors[this.selectedColorIndex][0];
    }

    private getPetIndexFromLocalization(localization: string): number
    {
        if(!localization.length) return 0;

        let index = (localization.length - 1);

        while(index >= 0)
        {
            if(isNaN(parseInt(localization.charAt(index)))) break;

            index--;
        }

        if(index > 0) return parseInt(localization.substring(index + 1));

        return -1;
    }

    private getPetAvailableColors(petIndex: number, palettes: SellablePetPaletteData[]): number[][]
    {
        switch(petIndex)
        {
            case 0:
                return [[16743226], [16750435], [16764339], [0xF59500], [16498012], [16704690], [0xEDD400], [16115545], [16513201], [8694111], [11585939], [14413767], [6664599], [9553845], [12971486], [8358322], [10002885], [13292268], [10780600], [12623573], [14403561], [12418717], [14327229], [15517403], [14515069], [15764368], [16366271], [0xABABAB], [0xD4D4D4], [0xFFFFFF], [14256481], [14656129], [15848130], [14005087], [14337152], [15918540], [15118118], [15531929], [9764857], [11258085]];
            case 1:
                return [[16743226], [16750435], [16764339], [0xF59500], [16498012], [16704690], [0xEDD400], [16115545], [16513201], [8694111], [11585939], [14413767], [6664599], [9553845], [12971486], [8358322], [10002885], [13292268], [10780600], [12623573], [14403561], [12418717], [14327229], [15517403], [14515069], [15764368], [16366271], [0xABABAB], [0xD4D4D4], [0xFFFFFF], [14256481], [14656129], [15848130], [14005087], [14337152], [15918540], [15118118], [15531929], [9764857], [11258085]];
            case 2:
                return [[16579283], [15378351], [8830016], [15257125], [9340985], [8949607], [6198292], [8703620], [9889626], [8972045], [12161285], [13162269], [8620113], [12616503], [8628101], [0xD2FF00], [9764857]];
            case 3:
                return [[0xFFFFFF], [0xEEEEEE], [0xDDDDDD]];
            case 4:
                return [[0xFFFFFF], [16053490], [15464440], [16248792], [15396319], [15007487]];
            case 5:
                return [[0xFFFFFF], [0xEEEEEE], [0xDDDDDD]];
            case 6:
                return [[0xFFFFFF], [0xEEEEEE], [0xDDDDDD], [16767177], [16770205], [16751331]];
            case 7:
                return [[0xCCCCCC], [0xAEAEAE], [16751331], [10149119], [16763290], [16743786]];
            default:
            {
                const colors: number[][] = [];

                for(const palette of palettes)
                {
                    const petColorResult = Nitro.instance.roomEngine.getPetColorResult(petIndex, palette.paletteId);

                    if(!petColorResult) continue;

                    if(petColorResult._Str_5845 === petColorResult._Str_6659)
                    {
                        colors.push([petColorResult._Str_5845]);
                    }
                    else
                    {
                        colors.push([petColorResult._Str_5845, petColorResult._Str_6659]);
                    }
                }

                return colors;
            }
        }
    }

    public setPalettes(event: SellablePetPalettesEvent): void
    {
        this._ngZone.run(() =>
        {
            this._palettesEvent = event;

            const palettes: SellablePetPaletteData[] = [];
            for(const paletteData of event.getParser().palettes)
            {

                if(!paletteData.sellable) continue;

                palettes.push(paletteData);
            }

            this.sellablePalettes = palettes;
        });
    }

    public selectPalette(index: number): void
    {
        this.selectedPalette = index;

        if(!this.roomPreviewer) return;

        this.roomPreviewer.reset(false);

        if(index === -1 || !this.sellablePalettes.length) return;

        let petFigureString = `${this.petIndex} ${this.sellablePalettes[index].paletteId}`;

        if(index <= 7) petFigureString += ` ${this.getColor().toString(16)}`;

        this.roomPreviewer.addPetIntoRoom(petFigureString);
    }

    public getPetBreedName(): string
    {
        if(this.petIndex === -1 || !this.sellablePalettes.length || this.selectedPalette === -1) return '';

        return Nitro.instance.localization.getValue(`pet.breed.${this.petIndex}.${this.sellablePalettes[this.selectedPalette].breedId}`);
    }
}
