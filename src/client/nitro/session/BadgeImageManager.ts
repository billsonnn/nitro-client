import { Texture } from 'pixi.js';
import { IAssetManager } from '../../core/asset/IAssetManager';
import { IEventDispatcher } from '../../core/events/IEventDispatcher';
import { Nitro } from '../Nitro';
import { BadgeInfo } from './BadgeInfo';
import { BadgeImageReadyEvent } from './events/BadgeImageReadyEvent';

export class BadgeImageManager
{
    public static GROUP_BADGE: string   = 'group_badge';
    public static NORMAL_BADGE: string  = 'normal_badge';

    private _Str_9663: string = 'badge_';
    private _Str_23071: string = '_32';

    private _assets: IAssetManager;
    private _events: IEventDispatcher;
    private _requestedGroupBadges: Map<string, boolean>;

    constructor(k: IAssetManager, _arg_2: IEventDispatcher)
    {
        this._assets                = k;
        this._events                = _arg_2;
        this._requestedGroupBadges  = new Map();
    }

    public dispose(): void
    {
        this._assets = null;
    }

    public getBadgeImage(k: string, _arg_2: string = 'normal_badge', _arg_3: boolean = true, _arg_4: boolean = false): Texture
    {
        let badge = this._Str_10735(k, _arg_2, _arg_4);

        if(!badge && _arg_3) badge = this._Str_20965();

        return badge;
    }

    public _Str_15979(k: string): BadgeInfo
    {
        const badge = this._Str_10735(k);

        return (badge) ? new BadgeInfo(badge, false) : new BadgeInfo(this._Str_20965(), true);
    }

    public _Str_5831(k: string, _arg_2: string = 'normal_badge', _arg_3: boolean = false): string
    {
        const badgeName = this.getBadgeAssetName(k, _arg_3);

        if(this._assets.getTexture(badgeName)) return badgeName;

        this._Str_10735(k, _arg_2, _arg_3);

        return null;
    }

    private _Str_10735(k: string, _arg_2: string = 'normal_badge', _arg_3: boolean = false): Texture
    {
        const badgeName = this.getBadgeAssetName(k, _arg_3);

        const existing = this._assets.getTexture(badgeName);

        if(existing) return existing.clone();

        if(_arg_3) return null;

        let url = null;

        switch (_arg_2)
        {
            case BadgeImageManager.NORMAL_BADGE:
                url = (Nitro.instance.getConfiguration<string>("badge.asset.url")).replace('%badgename%', k);
                break;
            case BadgeImageManager.GROUP_BADGE:
                if(!this._requestedGroupBadges.get(badgeName))
                {
                    url = (Nitro.instance.getConfiguration<string>("badge.asset.group.url")).replace('%badgedata%', k);
                    
                    this._requestedGroupBadges.set(badgeName, true);
                }
                break;
        }

        if(url)
        {
            this._assets.downloadAsset(url, (flag: boolean) =>
            {
                if(flag)
                {
                    const texture = this._assets.getTexture(k);

                    if(texture && this._events) this._events.dispatchEvent(new BadgeImageReadyEvent(k, texture.clone()));
                }
            });
        }
        
        return null;
    }

    private _Str_20965(): Texture
    {
        const existing = this._assets.getTexture('loading_icon');

        console.log(existing);

        if(!existing) return null;

        return existing.clone();
    }

    private getBadgeAssetName(badgeName: string, zoomedOut: boolean = false): string
    {
        if(!badgeName) return null;

        //return ((this._Str_9663 + badgeName) + ((zoomedOut) ? '_32' : ''));

        return badgeName;
    }
}