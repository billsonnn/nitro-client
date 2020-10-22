import { Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { GroupItem } from '../items/GroupItem';
import { InventoryTradingService } from './service';

@Component({
	selector: '[nitro-inventory-trading-component]',
    template: `
    <div *ngIf="visible" class="nitro-inventory-trading-component">
        <div class="container">
            <div class="row">
                <div class="col-6">
                    <div class="badge badge-secondary">{{ ('inventory.trading.you') | translate }}</div>
                    <div class="grid-container">
                        <div class="grid-items">
                            <div class="item-detail" *ngFor="let num of indexs; let i = index;" (click)="selectGroup(ownUserItems[i])">
                                <div class="detail-image" [ngStyle]="{ 'background-image': (ownUserItems[i] ? getIconUrl(ownUserItems[i]): null )}"></div>
                                <ng-container *ngIf="ownUserItems[i]">
                                    <div class="badge badge-secondary" *ngIf="!ownUserItems[i].stuffData.uniqueNumber">x{{ ownUserItems[i].getUnlockedCount() }}</div>
                                    <div class="badge badge-secondary" *ngIf="ownUserItems[i].stuffData.uniqueNumber">{{ ownUserItems[i].stuffData.uniqueNumber }}</div>
                                </ng-container>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex flex-column">
                        <span>{{ ownUserNumItems }} items</span>
                        <span>{{ ownUserNumCredits }} credits</span>
                    </div>
                </div>
                <div class="col-6">
                    <div class="badge badge-secondary">{{ otherUserName }}</div>
                    <div class="grid-container">
                        <div class="grid-items">
                            <div class="item-detail" *ngFor="let num of indexs; let i = index;" (click)="selectGroup(otherUserItems[i])">
                                <div class="detail-image" [ngStyle]="{ 'background-image': (otherUserItems[i] ? getIconUrl(otherUserItems[i]): null )}"></div>
                                <ng-container *ngIf="otherUserItems[i]">
                                    <div class="badge badge-secondary" *ngIf="!otherUserItems[i].stuffData.uniqueNumber">x{{ otherUserItems[i].getUnlockedCount() }}</div>
                                    <div class="badge badge-secondary" *ngIf="otherUserItems[i].stuffData.uniqueNumber">{{ otherUserItems[i].stuffData.uniqueNumber }}</div>
                                </ng-container>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex flex-column">
                        <span>{{ otherUserNumItems }} items</span>
                        <span>{{ otherUserNumCredits }} credits</span>
                    </div>
                </div>
            </div>
        </div>
    </div>`
})
export class InventoryTradingComponent implements OnInit, OnDestroy
{
    @Input()
    public visible: boolean = false;

    public indexs: number[] = [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ];

    constructor(
        private _inventoryTradingService: InventoryTradingService,
        private _ngZone: NgZone) {}

    public ngOnInit(): void
    {
        this._inventoryTradingService.controller = this;
    }

    public ngOnDestroy(): void
    {
        this._inventoryTradingService.controller = null;
    }

    public getIconUrl(groupItem: GroupItem): string
    {
        const imageUrl = ((groupItem && groupItem.iconUrl) || null);

        if(imageUrl && (imageUrl !== '')) return `url('${ imageUrl }')`;

        return null;
    }

    public get ownUserName(): string
    {
        return this._inventoryTradingService.ownUserName;
    }

    public get ownUserItems(): GroupItem[]
    {
        return Array.from(this._inventoryTradingService.ownUserItems.values());
    }

    public get ownUserNumItems(): number
    {
        return this._inventoryTradingService.ownUserNumItems;
    }

    public get ownUserNumCredits(): number
    {
        return this._inventoryTradingService.ownUserNumCredits;
    }

    public get otherUserName(): string
    {
        return this._inventoryTradingService.otherUserName;
    }

    public get otherUserItems(): GroupItem[]
    {
        return Array.from(this._inventoryTradingService.otherUserItems.values());
    }

    public get otherUserNumItems(): number
    {
        return this._inventoryTradingService.otherUserNumItems;
    }

    public get otherUserNumCredits(): number
    {
        return this._inventoryTradingService.otherUserNumCredits;
    }
}