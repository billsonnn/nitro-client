import { Component, NgZone, OnInit } from '@angular/core';
import { CatalogClubOfferData } from '../../../../../../client/nitro/communication/messages/parser/catalog/utils/CatalogClubOfferData';
import { Nitro } from '../../../../../../client/nitro/Nitro';
import { CatalogLayout } from '../../../CatalogLayout';
import { CatalogService } from '../../../services/catalog.service';
import {Vector3d} from "../../../../../../client/room/utils/Vector3d";
import {IGetImageListener} from "../../../../../../client/nitro/room/IGetImageListener";


@Component({
    templateUrl: './trophies.template.html'
})
export class CatalogLayoutTrophiesComponent extends CatalogLayout implements OnInit, IGetImageListener
{
    public static CODE: string = 'trophies';
    public vipOffers: CatalogClubOfferData[] = [];
    private _trophyOffers = new Map<string, Map<any,any>>();

    constructor(
        protected _catalogService: CatalogService,
        protected _ngZone: NgZone)
    {
        super(_catalogService, _ngZone);
    }

    imageReady(id: number, texture: PIXI.Texture, image?: HTMLImageElement): void {
        debugger;
        if((id === -1) || !image) return;

        const url = image.src;

        //if((this._iconUrl && this._iconUrl.length) && (url === this._iconUrl)) return;
        debugger;
//        this.setIconUrl(image.src);
    //    throw new Error('Method not implemented.');
    }
    imageFailed(id: number): void {
        debugger;
      //  throw new Error('Method not implemented.');
    }

    ngOnInit(): void
    {
        // TrophyCatalogWidget
        // _local_6 = page.viewer.roomEngine.getFurnitureImage(_local_5.productClassId, new Vector3d(2, 0, 0), 64, this, 0, _local_5.extraParam);
        const parser = this.activePage.offers;

        parser.forEach((item) =>
        {
            const name = item.localizationId;
            const local4 = this._Str_23368(name);
            const local5 = this._Str_19039(name);


            if(!this._trophyOffers.has(local4))
            {
                this._trophyOffers.set(local4, new Map());
            }
            // (typeId: number, direction: IVector3D, scale: number, listener: IGetImageListener, bgColor: number = 0, extras: string = null, state: number = -1, frameCount: number = -1, objectData: IObjectData = null): ImageResult


            Nitro.instance.roomEngine.getFurnitureFloorImage(
                item.products[0].furniClassId,
                new Vector3d(2,0,0),
                64,
                this,
                0, item.products[0].extraParam);
        });

        debugger;
    }

    private _Str_23368(k: string): string
    {
        const local2 = this._Str_19039(k);
        if(local2.length > 0)
        {
            return k.slice(0, ((k.length - 1) - local2.length));
        }

        return k;
    }

    private _Str_19039(k: string): string
    {
        const indexTrophy = k.indexOf('prizetrophy_2011_');
        if(indexTrophy != -1)
        {
            return '';
        }

        const lastUnderscoreIndex = k.lastIndexOf('_') + 1;
        if(lastUnderscoreIndex <= 0)
        {
            return '';
        }

        const local4 = k.substr(lastUnderscoreIndex);

        if(local4.length > 1 || (local4 != 'g' && local4 != 's' && local4 != 'b'))
        {
            return '';
        }

        return local4;

    }
    public getText(): string
    {

        return '';
    }



}
