import { Component, OnDestroy, OnInit } from '@angular/core';
import { Achievement } from '../../../../../client/nitro/communication/messages/incoming/inventory/achievements/Achievement';
import { Nitro } from '../../../../../client/nitro/Nitro';
import { AchievementsService } from '../../services/AchievementsService';

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
        this._selectedBadge = badge;
    }

    public getBadgeImageUrl(badge: Achievement): string
    {
        if(badge.totalLevels > 1) return Nitro.instance.core.configuration.getValue('badge.asset.url').toString().replace('%badgename%', badge.badgeId.replace(/[0-9]/g, '') + ((badge.level - 1) > 0 ? badge.level - 1 : badge.level ));
        return Nitro.instance.core.configuration.getValue('badge.asset.url').toString().replace('%badgename%', badge.badgeId);
    }


    private getRomanNumeral(k: number): string
    {
        return this._romanNumerals[Math.max(0, (k - 1))];
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

        return (this._selectedBadge || this._achivementsService.selected['achievements'][0]);
    }
}
