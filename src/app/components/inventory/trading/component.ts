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
                            <div class="item-detail" *ngFor="let groupItem of ownUserItems" (click)="selectGroup(groupItem)">
                            <div class="detail-image" [ngStyle]="{ 'background-image': getIconUrl(groupItem) }"></div>
                            <div class="badge badge-secondary" *ngIf="!groupItem.stuffData.uniqueNumber">x{{ groupItem.getUnlockedCount() }}</div>
                            <div class="badge badge-secondary" *ngIf="groupItem.stuffData.uniqueNumber">{{ groupItem.stuffData.uniqueNumber }}</div>
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
                    <ul>
                        <li>{{ otherUserNumItems }} items</li>
                        <li>{{ otherUserNumCredits }} credits</li>
                    </ul>
                    <div class="d-flex flex-grow-1 grid-container">
                        <div class="grid-items">
                            <div class="item-detail" *ngFor="let groupItem of otherUserItems" (click)="selectGroup(groupItem)">
                                <div class="detail-image" [ngStyle]="{ 'background-image': getIconUrl(groupItem) }"></div>
                                <div class="badge badge-secondary" *ngIf="!groupItem.stuffData.uniqueNumber">x{{ groupItem.getUnlockedCount() }}</div>
                                <div class="badge badge-secondary" *ngIf="groupItem.stuffData.uniqueNumber">{{ groupItem.stuffData.uniqueNumber }}</div>
                            </div>
                        </div>
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