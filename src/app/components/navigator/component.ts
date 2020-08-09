import { Component } from '@angular/core';
import { SettingsService } from '../../core/settings/service';

@Component({
	selector: 'nitro-navigator-component',
    template: `
    <ng-container *ngIf="visible">
        <div [bringToTop] [draggable] dragHandle=".card-header" class="nitro-navigator-component">
            <div class="card">
                <div class="card-header">
                    <div class="header-title">Navigator</div>
                    <div class="header-close" (click)="hide()"><i class="fas fa-times"></i></div>
                </div>
                <div class="card-body">
                    navigator content
                </div>
            </div>
        </div>
    </ng-container>`
})
export class NavigatorComponent
{
    constructor(
        private settingsService: SettingsService) {}

    public hide(): void
    {
        this.settingsService.hideNavigator();
    }

    public get visible(): boolean
    {
        return this.settingsService.navigatorVisible;
    }
}