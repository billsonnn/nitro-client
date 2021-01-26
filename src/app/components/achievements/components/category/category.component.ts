import { Component, OnDestroy, OnInit } from '@angular/core';
import { Achievement } from '../../../../../client/nitro/communication/messages/incoming/inventory/achievements/Achievement';
import { Nitro } from '../../../../../client/nitro/Nitro';
import { AchievementsService } from '../../services/AchievementsService';
import { BadgeBaseAndLevel } from '../../utils/badge-base-and-level';

@Component({
    selector: 'nitro-achievements-category-component',
    templateUrl: './category.template.html'
})
export class AchievementsCategoryComponent implements OnInit, OnDestroy
{
    private _selectedBadge: Achievement;

    private _romanNumerals:Array<string> = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI', 'XXII', 'XXIII', 'XXIV', 'XXV', 'XXVI', 'XXVII', 'XXVIII', 'XXIX', 'XXX'];
    
    constructor(
        private _achivementsService: AchievementsService,) 
    { }
    
    public ngOnInit(): void
    {}

    public ngOnDestroy(): void
    { }

    public selectBadge(badge: Achievement)
    { 
        badge.unseen = 0;

        console.log(badge);
        
        this._selectedBadge = badge;
    }

    public getBadgeImageUrl(badge: Achievement): string
    { 
        if(badge.totalLevels > 1) return Nitro.instance.getConfiguration('badge.asset.url').toString().replace('%badgename%', badge.badgeId.replace(/[0-9]/g, '') + ((badge.level - 1) > 0 ? badge.level - 1 : badge.level ));
        return Nitro.instance.getConfiguration('badge.asset.url').toString().replace('%badgename%', badge.badgeId);
    }

    private getText(texts: string[]): string
    {
        let b = null;

        for(let index = 0; index < texts.length; index++) 
        {
            const item = texts[index];

            b = Nitro.instance.localization.getValue(item);

            if(b !== item) 
            {
                return b;
            }
        }

        return '';
    }

    private _Str_16394(k:Achievement):string
    {
        return (k._Str_7518) ? k.badgeId : this._Str_18179(k.badgeId);
    }

    public _Str_18179(k: string): string
    {
        const _local_2: BadgeBaseAndLevel = new BadgeBaseAndLevel(k);
        
        _local_2.level--;

        return _local_2.getBadgeId;
    }

    public getBadgeText(badge: Achievement, desc = false): string
    {
        const str: string = this._Str_16394(badge);

        const badgeBase = new BadgeBaseAndLevel(str);

        let charReplaced: string;

        if(desc) 
        {
            charReplaced = this.getText(['badge_desc_' + str, 'badge_desc_' + badgeBase.base]); 
        }
        else 
        {
            charReplaced = this.getText(['badge_name_' + str, 'badge_name_' + badgeBase.base]); 
        }
            
        return charReplaced
            .replace('%roman%', this.getRomanNumeral(badgeBase.level))
            .replace('%limit%',badge._Str_24142.toString());
    }

    private getRomanNumeral(k: number): string
    {
        return this._romanNumerals[Math.max(0, (k - 1))];
    }

    public getProgress(badge:Achievement, stringify = false): string
    { 
        if(!badge) return;
        
        if(stringify) return badge.progress + '/' + badge.toNextProgress;
        
        return Math.trunc(badge.progress / badge.toNextProgress * 100) + '%';
    }

    public getCurrencyUrl(type: number): string
    {
        const url = Nitro.instance.getConfiguration<string>('currency.asset.icon.url');

        return url.replace('%type%', type.toString());
    }

    public getBadgeLevelString(badge: Achievement): string
    {
        if(!badge) return;

        const str = Nitro.instance.getLocalization('achievements.details.level');

        return str.replace('%level%', Math.max(1,badge.level - 1).toString()).replace('%limit%',badge.totalLevels.toString());
    }
    
    public get category(): Object
    { 
        return this._achivementsService.selected['achievements'];
    }

    public get categoryTitle(): Object
    { 
        return this._achivementsService.selected['name'];
    }

    public get selectedBadge(): Achievement
    {
        if(!this._achivementsService.selected['achievements']) return;
        
        if(!this._selectedBadge) this._selectedBadge = this._achivementsService.selected['achievements'][0];
        
        return this._selectedBadge;
    }
}