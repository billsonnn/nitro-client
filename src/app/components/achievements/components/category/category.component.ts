import { Component, OnDestroy, OnInit } from '@angular/core';
import { Achievement } from '../../../../../client/nitro/communication/messages/incoming/inventory/achievements/Achievement';
import { AchievementsService } from '../../services/AchievementsService';

@Component({
    selector: 'nitro-achievements-category-component',
    templateUrl: './category.template.html'
})
export class AchievementsCategoryComponent implements OnInit, OnDestroy
{
    private _selectedBadge: string;
    
    constructor(
        private _achivementsService: AchievementsService,) 
    { }
    
    public ngOnInit(): void
    {}

    public ngOnDestroy(): void
    { }

    public selectBadge(badge: string)
    { 
        this._selectedBadge = badge;
    }
    
    public get category(): Achievement[]
    { 
        return this._achivementsService.selected;
    }

    public get selectedBadge(): string
    {
        return (this._selectedBadge || this._achivementsService.selected[0].badgeId)
    }
}