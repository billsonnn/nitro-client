import { Component, Input, OnInit } from '@angular/core';
import { CatalogLocalizationData } from 'nitro-renderer/src/nitro/communication/messages/parser/catalog/utils/CatalogLocalizationData';
import { CatalogService } from '../../services/catalog.service';

@Component({
    selector: 'redeem-voucher-component',
    templateUrl: './redeem-voucher.component.html'
})
export class CatalogRedeemVoucherComponent implements OnInit
{
    @Input()
    public localization: CatalogLocalizationData = null;

    public voucherCode: string = '';

    constructor(private _catalogService: CatalogService)
    {}

    public ngOnInit(): void
    {
    }

    public redeem(): void
    {
        this._catalogService.redeemVoucher(this.voucherCode);

        this.voucherCode = '';
    }
}
