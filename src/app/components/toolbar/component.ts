import { Component, Input } from '@angular/core';
import { SettingsService } from '../../core/settings/service';
import { SessionService } from '../../security/services/session.service';

@Component({
	selector: 'nitro-toolbar-component',
    template: `
    <div class="nitro-toolbar-component">
        <div class="card">
            <div class="card-header">
                <div class="header-title">Nitro</div>
            </div>
            <div class="card-body">
                <ul class="list-group">
                    <li class="list-group-item" *ngIf="isInRoom"><i class="icon icon-habbo"></i></li>
                    <li class="list-group-item" *ngIf="!isInRoom"><i class="icon icon-house"></i></li>
                    <li class="list-group-item" (click)="toggleNavigator()"><i class="icon icon-rooms"></i></li>
                    <li class="list-group-item" (click)="toggleInventory()"><i class="icon icon-inventory"></i></li>
                    <li class="list-group-item" (click)="toggleCatalog()"><i class="icon icon-catalog"></i></li>
                    <li class="list-group-item avatar-image"><nitro-avatar-image [figure]="figure" [headOnly]="true" [direction]="2" [scale]="0.5"></nitro-avatar-image></li>
                </ul>
            </div>
        </div>
    </div>`
})
export class ToolbarComponent
{
    @Input()
    public isInRoom: boolean = false;

    constructor(
        private sessionService: SessionService,
        private settingsService: SettingsService) {}

    public toggleCatalog(): void
    {
        this.settingsService.toggleCatalog();
    }

    public toggleInventory(): void
    {
        this.settingsService.toggleInventory();
    }

    public toggleNavigator(): void
    {
        this.settingsService.toggleNavigator();
    }

    public get figure(): string
    {
        return this.sessionService.figure;
    }
}