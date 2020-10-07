import { Component, Input, OnInit } from '@angular/core';
import { NavigatorSearchResultList } from '../../../../../client/nitro/communication/messages/parser/navigator/utils/NavigatorSearchResultList';
import { NavigatorDisplayMode } from '../NavigatorDisplayMode';

@Component({
    selector: '[nitro-navigator-search-result-component]',
    template: `
    <div class="nitro-navigator-search-result-component">
        <div class="card-header">
            <div class="header-left" (click)="toggleCollapsed()">
                <i class="fas header-icon" [ngClass]="{ 'fa-plus': !isCollapsed, 'fa-minus': isCollapsed }"></i>
                {{ resultCode | translate }}
            </div>
            <div class="header-right" *ngIf="isCollapsed">
                <i class="fas header-icon" *ngIf="displayMode !== 2" (click)="toggleListMode()" [ngClass]="{ 'fa-th-large': displayMode === 0, 'fa-th-list': displayMode === 1 }"></i>
            </div>
        </div>
        <div class="card-body" *ngIf="isCollapsed" [ngClass]="{ 'result-grid': (displayMode === 1 || displayMode === 2) }">
            <div *ngFor="let room of result.rooms" nitro-navigator-search-result-item-component [room]="room" [displayMode]="displayMode"></div>
        </div>
    </div>`
})
export class NavigatorSearchResultComponent implements OnInit
{
    @Input()
    public result: NavigatorSearchResultList;

    private _displayMode: number;
    private _isCollapsed: boolean;

    public ngOnInit(): void
    {
        this._displayMode   = this.result.mode;
        this._isCollapsed   = this.result.closed;
    }

    public toggleListMode(): void
    {
        if(this._displayMode === NavigatorDisplayMode.THUMBNAILS) return;

        if(this._displayMode === NavigatorDisplayMode.LIST) this._displayMode = NavigatorDisplayMode.THUMBNAILS;
        else this._displayMode = NavigatorDisplayMode.LIST;
    }

    public toggleCollapsed(): void
    {
        this._isCollapsed = !this._isCollapsed;
    }

    public get resultCode(): string
    {
        let name = this.result.code;

        if(this.result.code.startsWith('${'))
        {
            name = name.substr(2, (name.length - 3));
        }
        else
        {
            name = ('navigator.searchcode.title.' + name);
        }

        return name;
    }

    public get displayMode(): number
    {
        return this._displayMode;
    }

    public get isCollapsed(): boolean
    {
        return !this._isCollapsed;
    }
}