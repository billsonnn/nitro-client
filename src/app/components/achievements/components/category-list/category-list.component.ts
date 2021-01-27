import { Component, ElementRef, Input, NgZone, ViewChild } from '@angular/core';
import { Achievement } from '../../../../../client/nitro/communication/messages/incoming/inventory/achievements/Achievement';
import { Nitro } from '../../../../../client/nitro/Nitro';
import { SettingsService } from '../../../../core/settings/service';
import { AchievementCategory } from '../../common/AchievementCategory';
import { AchievementsService } from '../../services/achievements.service';

@Component({
    selector: 'nitro-achievements-category-list-component',
    templateUrl: './category-list.template.html'
})
export class AchievementsCategoryListComponent
{
    @Input()
    public visible: boolean = false;

    @ViewChild('progressBar')
    public progressBar: ElementRef<HTMLElement>;

    constructor(
        private _settingsService: SettingsService,
        private _achivementsService: AchievementsService,
        private _ngZone: NgZone)
    {}

    public selectCategory(category: AchievementCategory): void
    {
        this._achivementsService.selectedCategory = category;
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

        return Math.trunc(completed / total * 100) + '%';
    }

    public getCategoryImage(cat: string, achievements: Achievement[], icon: boolean = false): string
    {
        if(icon) return Nitro.instance.getConfiguration('achievements.images.url',Nitro.instance.core.configuration.getValue('c.images.url') + `/quests/achcategory_${cat}.png`).toString().replace('%image%',cat);

        let k = 0;

        for(const loc of achievements)
        {
            k = k + ((loc._Str_7518) ? loc.level : (loc.level - 1));
        }

        const isActive = ((k > 0) ? 'active' : 'inactive');

        return Nitro.instance.getConfiguration('achievements.images.url', Nitro.instance.core.configuration.getValue('c.images.url') + `/quests/achcategory_${cat}_${isActive}.png`).toString().replace('%image%',`achcategory_${cat}_${isActive}`);
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

    public getUnseenCategory(category: AchievementCategory): number
    {
        let unseen = 0;

        category.achievements.forEach(el =>
        {
            if(el.unseen == 0) return;

            unseen = unseen + el.unseen;
        });

        return unseen;
    }

    public get categories(): AchievementCategory[]
    {
        return this._achivementsService.categories;
    }

    public get selectedCategory(): AchievementCategory
    {
        return this._achivementsService.selectedCategory;
    }

    public get achievementScore(): number
    {
        return this._achivementsService.achievementScore;
    }
}