import { Component, Input, NgZone, OnChanges, SimpleChanges } from '@angular/core';
import { NavigatorSearchResultList } from '../../../client/nitro/communication/messages/parser/navigator/utils/NavigatorSearchResultList';
import { NavigatorTopLevelContext } from '../../../client/nitro/communication/messages/parser/navigator/utils/NavigatorTopLevelContext';
import { SettingsService } from '../../core/settings/service';
import { NavigatorService } from './service';

@Component({
	selector: 'nitro-navigator-component',
    template: `
    <div *ngIf="visible" [bringToTop] [draggable] dragHandle=".card-header" class="card nitro-navigator-component">
        <div *ngIf="isLoading" class="card-loading-overlay"></div>
        <div class="card-header-container">
            <div class="card-header-overlay"></div>
            <div class="card-header">
                <div class="header-title">{{ (isLoading ? 'navigator.title.is.busy' : 'navigator.title') | translate }}</div>
                <div class="header-close" (click)="hide()"><i class="fas fa-times"></i></div>
            </div>
            <div class="card-header-tabs">
                <div class="nav nav-tabs w-100 px-4">
                    <div *ngFor="let context of topLevelContexts" class="nav-item nav-link" [ngClass]="{ 'active': ((topLevelContext === context) && !isCreatorMode) }" (click)="setCurrentContext(context)">{{ ('navigator.toplevelview.' + context.code) | translate }}</div>
                    <div *ngIf="!isLoading" class="nav-item nav-link" [ngClass]="{ 'active': isCreatorMode }" (click)="setCreatorMode(true)"><i class="fas fa-plus"></i></div>
                </div>
            </div>
        </div>
        <div class="card-body">
            <ng-container *ngIf="!isCreatorMode">
                <div nitro-navigator-search-component></div>
                <div class="results-container">
                    <div class="mb-3" *ngFor="let result of lastSearchResults" [result]="result" nitro-navigator-search-result-component></div>
                </div>
            </ng-container>
            <div *ngIf="isCreatorMode" nitro-navigator-room-creator-component></div>
        </div>
    </div>`
})
export class NavigatorComponent implements OnChanges
{
    @Input()
    public visible: boolean = false;

    constructor(
        private settingsService: SettingsService,
        private navigatorService: NavigatorService,
        private ngZone: NgZone) {}

    public ngOnChanges(changes: SimpleChanges): void
    {
        const prev = changes.visible.previousValue;
        const next = changes.visible.currentValue;

        if(next && (next !== prev)) this.prepareNavigator();

        else if(!next && (next !== prev)) this.hideNavigator();
    }

    private prepareNavigator(): void
    {
        if(!this.navigatorService.isLoaded)
        {
            this.navigatorService.loadNavigator();
        }
        else
        {
            this.navigatorService.search();
        }
    }

    private hideNavigator(): void
    {
        this.setCreatorMode(false);
    }

    public setCurrentContext(context: NavigatorTopLevelContext): void
    {
        this.setCreatorMode(false);

        this.navigatorService.setCurrentContext(context);
    }

    public setCreatorMode(flag: boolean = true): void
    {
        this.navigatorService.setCreatorMode(flag);
    }

    public get topLevelContext(): NavigatorTopLevelContext
    {
        return ((this.navigatorService && this.navigatorService.topLevelContext) || null);
    }

    public get topLevelContexts(): NavigatorTopLevelContext[]
    {
        return ((this.navigatorService && this.navigatorService.topLevelContexts) || null);
    }

    public get lastSearchResults(): NavigatorSearchResultList[]
    {
        return this.navigatorService.lastSearchResults;
    }

    public get isLoading(): boolean
    {
        return (this.navigatorService && (this.navigatorService.isLoading || this.navigatorService.isSearching));
    }

    public hide(): void
    {
        this.settingsService.hideNavigator();
    }

    public get width(): number
    {
        return this.navigatorService.width;
    }

    public get height(): number
    {
        return this.navigatorService.height;
    }

    public get isCreatorMode(): boolean
    {
        return this.navigatorService.isCreatorMode;
    }
}