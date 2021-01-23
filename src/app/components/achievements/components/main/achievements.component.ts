import { Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { SettingsService } from '../../../../core/settings/service';
import { AchievementsService } from '../../services/AchievementsService';

@Component({
    selector: 'nitro-achievements-main-component',
    templateUrl: './main.template.html'
})
export class AchievementsComponent implements OnInit, OnDestroy
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
}