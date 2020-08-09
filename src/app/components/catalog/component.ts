import { Component } from '@angular/core';
import { SettingsService } from '../../core/settings/service';

@Component({
	selector: 'nitro-catalog-component',
    template: `
    <ng-container *ngIf="visible">
        <div [bringToTop] [draggable] dragHandle=".card-header" class="nitro-catalog-component">
            <div class="card">
                <div class="card-header">
                    <div class="header-title">Catalog</div>
                    <div class="header-close" (click)="hide()"><i class="fas fa-times"></i></div>
                </div>
                <div class="card-body">
                    catalog content
                </div>
            </div>
        </div>
    </ng-container>`
})
export class CatalogComponent
{
    constructor(
        private settingsService: SettingsService) {}

    public hide(): void
    {
        this.settingsService.hideCatalog();
    }

    public get visible(): boolean
    {
        return this.settingsService.catalogVisible;
    }
}