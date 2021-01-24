import { Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Achievement } from '../../../../../client/nitro/communication/messages/incoming/inventory/achievements/Achievement';
import { Nitro } from '../../../../../client/nitro/Nitro';
import { SettingsService } from '../../../../core/settings/service';
import { AchievementsService } from '../../services/AchievementsService';

@Component({
    selector: 'nitro-achievements-category-list-component',
    templateUrl: './category-list.template.html'
})
export class AchievementsCategoryListComponent implements OnInit, OnDestroy
{
    @Input()
    public visible: boolean = false;
    
    constructor(
        private _settingsService: SettingsService,
        private _achivementsService: AchievementsService,
        private _ngZone: NgZone) 
    { }
    
    public ngOnInit(): void
    {}

    public ngOnDestroy(): void
    {}

    public selectCat(selected: Achievement[]): void
    { 
        this._achivementsService.selected = selected;
    }

    public getCategoryImage(cat: string, achievements: Achievement[], icon: boolean = false): string
    {
        if(icon) return Nitro.instance.core.configuration.getValue('c.images.url') + `/quests/achicon_${cat}.png`;
        
        let k = 0;

        for(const loc of achievements)
        { 
            k = k + ((loc._Str_7518) ? loc.level : (loc.level - 1));
        }

        const isActive = ((k > 0) ? 'active' : 'inactive');

        return Nitro.instance.core.configuration.getValue('c.images.url') + `/quests/achcategory_${cat}_${isActive}.png`;
    }

    public getCategoryProgress(achievements: Achievement[]): string
    {
        let completed = 0;

        let total = 0;

        for(const loc of achievements)
        { 
            if(loc._Str_7518)
            { 
                completed = completed + 1 + loc.level;
            }
            
            total = total + loc.totalLevels;
        }

        return completed + '/' + total;
    }

    public get categories(): Object
    {   
        return this._achivementsService.achievements;
    }

    public get selectedCategory(): string
    { 
        return this._achivementsService.selected['name'];
    }
}