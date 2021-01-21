import { Component } from '@angular/core';
import { CatalogLayout } from '../../../CatalogLayout';

@Component({
    templateUrl: './vip-buy.template.html'
})
export class CatalogLayoutVipBuyComponent extends CatalogLayout
{
    public static CODE: string = 'vip_buy';
}