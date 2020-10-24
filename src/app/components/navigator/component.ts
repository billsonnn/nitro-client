import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NavigatorSearchResultList } from '../../../client/nitro/communication/messages/parser/navigator/utils/NavigatorSearchResultList';
import { NavigatorTopLevelContext } from '../../../client/nitro/communication/messages/parser/navigator/utils/NavigatorTopLevelContext';
import { SettingsService } from '../../core/settings/service';
import { NavigatorRoomCreatorComponent } from './roomcreator/component';
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
                    <div *ngIf="!isLoading" class="nav-item nav-link" (click)="openRoomCreator()"><i class="fas fa-plus"></i></div>
                </div>
            </div>
        </div>
        <div class="card-body">
            <div nitro-navigator-search-component></div>
            <div class="results-container">
                <div class="mb-3" *ngFor="let result of lastSearchResults" [result]="result" nitro-navigator-search-result-component></div>
            </div>
        </div>
    </div>`
})
export class NavigatorComponent implements OnChanges
{
    @Input()
    public visible: boolean = false;

    private _roomCreatorModal: NgbModalRef;

    constructor(
        private _settingsService: SettingsService,
        private _navigatorService: NavigatorService,
        private _modalService: NgbModal) {}

    public ngOnChanges(changes: SimpleChanges): void
    {
        const prev = changes.visible.previousValue;
        const next = changes.visible.currentValue;

        if(next && (next !== prev)) this.prepareNavigator();
    }

    private prepareNavigator(): void
    {
        if(!this._navigatorService.isLoaded)
        {
            this._navigatorService.loadNavigator();
        }
        else
        {
            this._navigatorService.search();
        }
    }

    public setCurrentContext(context: NavigatorTopLevelContext): void
    {
        this._navigatorService.setCurrentContext(context);
    }

    public hide(): void
    {
        this._settingsService.hideNavigator();
    }

    public openRoomCreator(): void
    {
        if(this._roomCreatorModal)
        {
            const componentInstance = (this._roomCreatorModal.componentInstance as NavigatorRoomCreatorComponent);

            return;
        }
        
        this._roomCreatorModal = this._modalService.open(NavigatorRoomCreatorComponent, {
            backdrop: false
        });

        if(this._roomCreatorModal)
        {
            this._roomCreatorModal.result.then(() => (this._roomCreatorModal = null));
        }
    }

    public get topLevelContext(): NavigatorTopLevelContext
    {
        return ((this._navigatorService && this._navigatorService.topLevelContext) || null);
    }

    public get topLevelContexts(): NavigatorTopLevelContext[]
    {
        return ((this._navigatorService && this._navigatorService.topLevelContexts) || null);
    }

    public get lastSearchResults(): NavigatorSearchResultList[]
    {
        return this._navigatorService.lastSearchResults;
    }

    public get isLoading(): boolean
    {
        return (this._navigatorService && (this._navigatorService.isLoading || this._navigatorService.isSearching));
    }
}