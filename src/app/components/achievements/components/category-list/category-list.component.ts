import { Component, ElementRef, Input, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
    
    @ViewChild('progressBar')
    public progressBar: ElementRef<HTMLElement>;

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

    public getProgress(stringify:boolean = false): string
    { 
        if(!this.categories) return;

        const cats: any = this.categories;

        let total = 0;

        let completed = 0;

        for(const loc of cats)
        { 
            for(const loc2 of loc['achievements'])
            { 
                completed += (loc2._Str_7518) ? loc2.level : (loc2.level - 1);

                total += loc2.totalLevels; 
            }
        }

        if(stringify) return completed + '/' + total;
        
        return '';
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