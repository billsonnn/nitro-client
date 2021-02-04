import { Component, Input, NgZone } from '@angular/core';
import { CatalogService } from '../../services/catalog.service';
import { Nitro } from '../../../../../client/nitro/Nitro';

@Component({
    selector: 'nitro-catalog-customize-gift-component',
    templateUrl: './customize-gift.template.html'
})
export class CatalogCustomizeGiftComponent
{
    @Input()
    public visible:boolean = false;

    private _ribbonIndex: number;
    private _boxIndex: number;
    private _stuffTypes: number[];
    private _defaultStuffType: number;
    private _boxTypes: number[];
    private _ribbonTypes: number[];
    private _selectedTypeId: number;

    public boxSpriteId: number = -1;
    private _boxPrice: number;
    public boxText: string;
    public priceText: string;
    public ribbonText: string;

    constructor(
        private _catalogService: CatalogService,
        private _ngZone: NgZone
    )
    {
        _catalogService.giftsLoaded.subscribe((item) =>
        {
            const configuration = this._catalogService.giftWrapperConfiguration;
            const defaultStuffTypes = configuration.defaultStuffTypes;

            if(defaultStuffTypes.length > 0)
            {
                const local11 = Math.floor((Math.random() * defaultStuffTypes.length));
                this._defaultStuffType = defaultStuffTypes[local11];
            }

            this._stuffTypes = configuration.stuffTypes;
            this._boxTypes = configuration.boxTypes;
            this._ribbonTypes = configuration.ribbonTypes;
            this._boxPrice = configuration.price;
            this._selectedTypeId = this._stuffTypes[0];
            this._ribbonIndex = this._ribbonTypes[0];
            this._boxIndex = 0;

            this._Str_3190();
        });
    }

    private _Str_3190(): void
    {
        if(this._ribbonIndex < 0)
        {
            this._ribbonIndex = (this._ribbonTypes.length - 1);
        }

        if(this._ribbonIndex > (this._ribbonTypes.length - 1))
        {
            this._ribbonIndex = 0;
        }

        if(this._boxIndex < 0)
        {
            this._boxIndex = (this._boxTypes.length - 1);
        }

        if(this._boxIndex > (this._boxTypes.length - 1))
        {
            this._boxIndex = 0;
        }


        const k = this._boxTypes[this._boxIndex];
        if(k == 8)
        {
            // see _Str_13980
            this._ribbonIndex = 10;

            if(this._ribbonIndex > (this._ribbonTypes.length - 1))
            {
                this._ribbonIndex = 0;
            }
        }

        this._ribbonIndex = 1;
        const local2 = ((k * 1000) + this._ribbonTypes[this._ribbonIndex]);

        let local3 = local2.toString();
        let local4 = this._selectedTypeId;
        const local5 = this._Str_18066();
        if(local5)
        {
            local4 = this._defaultStuffType;
            local3 = '';
        }

        this.boxSpriteId = local4;

        this.setBoxTitles();
    }

    private setBoxTitles(): void
    {
        const k = this._Str_18066();

        const boxKey = k? 'catalog.gift_wrapping_new.box.default' : ('catalog.gift_wrapping_new.box.' +  this._boxTypes[this._boxIndex]);
        const priceKey = k ? 'caatlog.gift_wrapping_new.freeprice' : 'catalog.gift_wrapping_new.price';
        const ribbonKey = 'catalog.gift_wrapping_new.ribbon.' + this._ribbonIndex;

        this.boxText = Nitro.instance.localization.getValue(boxKey);
        this.priceText = Nitro.instance.localization.getValueWithParameter(priceKey,'price', this._boxPrice.toString());
        this.ribbonText  = Nitro.instance.localization.getValue(ribbonKey);

    }

    public handleButton(button: string): void
    {
        switch(button)
        {
            case 'previous_box':
                this._boxIndex--;
                this._Str_3190();
                break;
            case 'next_box':
                this._boxIndex++;
                this._Str_3190();
                break;
            case 'previous_ribbon':
            case 'next_ribbon':
                break;
        }
    }

    private  _Str_18066():boolean
    {
        return this._boxTypes[this._boxIndex] == this._defaultStuffType;
    }

    public get habboFigure(): string
    {
        return Nitro.instance.sessionDataManager.figure;
    }
}
