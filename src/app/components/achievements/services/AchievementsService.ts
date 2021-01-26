import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { IMessageEvent } from '../../../../client/core/communication/messages/IMessageEvent';
import { AchievementEvent } from '../../../../client/nitro/communication/messages/incoming/inventory/achievements/AchievementEvent';
import { AchievementsEvent } from '../../../../client/nitro/communication/messages/incoming/inventory/achievements/AchievementsEvent';
import { AchievementsScoreEvent } from '../../../../client/nitro/communication/messages/incoming/inventory/achievements/AchievementsScoreEvent';
import { RequestAchievementsMessageComposer } from '../../../../client/nitro/communication/messages/outgoing/achievements/RequestAchievementsMessageComposer';
import { Nitro } from '../../../../client/nitro/Nitro';
import { SettingsService } from '../../../core/settings/service';
import { Category } from '../utils/category';

@Injectable()
export class AchievementsService implements OnDestroy
{
    private _messages: IMessageEvent[] = [];

    private _achievements: Category[] = [];

    private _selectedCategory: Object = [];
    
    private _achievementScore: number = 0;

    constructor(
        private _settingsService: SettingsService,
        private _ngZone: NgZone)
    {
        this.registerMessages();
        this.loadAchievements();
    }

    public ngOnDestroy(): void
    {
        this.unregisterMessages();
    }

    private registerMessages(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            this._messages = [
                new AchievementsEvent(this.onAchievementsMessageEvent.bind(this)),
                new AchievementsScoreEvent(this.onAchievementsScoreEvent.bind(this)),
                new AchievementEvent(this.onAchievementEvent.bind(this))
            ];

            for(const message of this._messages) Nitro.instance.communication.registerMessageEvent(message);
            
        });
        
    }

    public unregisterMessages(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            for(const message of this._messages) Nitro.instance.communication.removeMessageEvent(message);

            this._messages = [];
        });
    }

    public loadAchievements(): void
    { 
        Nitro.instance.communication.connection.send(new RequestAchievementsMessageComposer());
    }

    public onAchievementsScoreEvent(event: AchievementsScoreEvent): void
    { 
        if(!event) return;

        const parser = event.getParser();

        this._achievementScore = parser.score;
    }

    public onAchievementsMessageEvent(event: AchievementsEvent): void
    { 
        if(!event) return;

        const parser = event.getParser();

        const arr: Category[] = [];

        parser.achievements.forEach(el =>
        {
            let ind = arr.findIndex(e => e.name === el.category);

            if(ind == -1) arr.push(new Category(el.category,[])); 
            
            ind = arr.findIndex(e => e.name === el.category);

            arr[ind].achievements.push(el);
        });
        
        this._achievements = arr;

        this._selectedCategory = arr[0];
    }

    public onAchievementEvent(event: AchievementEvent)
    { 
        if(!event) return;

        const parser = event.getParser();

        this._achievements.forEach(el =>
        { 
            if(el.name != parser.achievement.category) return;
        
            el.achievements.forEach(el =>
            { 
                if(el.achievementId != parser.achievement.achievementId) return;
                
                if(el.progress == parser.achievement.progress) return;

                const unseen = el.unseen + 1;

                el.reset(parser.achievement);

                const ignored = Array.from(Nitro.instance.getConfiguration('achievements.unseen.ignored'));

                const badge = el.badgeId.replace(/[0-9]/g, '');

                if(ignored.map(e => e).indexOf(badge) != -1 ) return;
                
                if(this.selected == el) return;

                el.unseen = unseen;
                
            });
        });

    }

    public get achievements(): Object
    { 
        return this._achievements;
    }

    public set selected(select: Object)
    {
        this._selectedCategory = select;
    }

    public get selected(): Object
    { 
        if(!this._achievements) return null;

        return this._selectedCategory;
    }

    public get achievementScore(): number
    {
        return this._achievementScore;
    }

    public get unseen(): number
    {
        let unseen = 0;

        this._achievements.forEach(el =>
        { 
            el.achievements.forEach(el =>
            { 
                if(el.unseen == 0) return;

                unseen++;
            });
        });
        
        return unseen;
    }
}