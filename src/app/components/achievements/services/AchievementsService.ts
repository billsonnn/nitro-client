import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { IMessageEvent } from '../../../../client/core/communication/messages/IMessageEvent';
import { Achievement } from '../../../../client/nitro/communication/messages/incoming/inventory/achievements/Achievement';
import { AchievementsEvent } from '../../../../client/nitro/communication/messages/incoming/inventory/achievements/AchievementsEvent';
import { RequestAchievementsMessageComposer } from '../../../../client/nitro/communication/messages/outgoing/achievements/RequestAchievementsMessageComposer';
import { Nitro } from '../../../../client/nitro/Nitro';
import { SettingsService } from '../../../core/settings/service';

@Injectable()
export class AchievementsService implements OnDestroy
{
    private _messages: IMessageEvent[] = [];

    private _achievements: Object = [];

    private _selectedCategory: Achievement[];

    private _categories: Array<string> = [];

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
                new AchievementsEvent(this.onAchievementsMessageEvent.bind(this))
            ];

            for (const message of this._messages) Nitro.instance.communication.registerMessageEvent(message);
            
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

    public onAchievementsMessageEvent(event: AchievementsEvent): void
    { 
        if (!event) return;

        const parser = event.getParser();

        const catList: Achievement[] = [];

        parser.achievements.forEach(el =>
        { 
            if (this._categories.indexOf(el.category) == -1) this._categories.push(el.category);

            if (!catList[el.category]) catList[el.category] = [];

            catList[el.category].push(el);

        })
        
        this._achievements = catList;

        this._selectedCategory = this.achievements[Object.keys(this.achievements)[0]];
    }

    public get achievements(): Object
    { 
        return this._achievements;
    }

    public set selected(select: Achievement[])
    {
        this._selectedCategory = select;
    }

    public get selected(): Achievement[]
    { 
        if (!this._achievements) return null;

        return this._selectedCategory;
    }
}