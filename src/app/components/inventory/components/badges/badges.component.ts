import { Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';
import { InventorySharedComponent } from '../shared/inventory-shared.component';
import { Nitro } from '../../../../../client/nitro/Nitro';
import { Badge } from '../../models/badge';
import { InventoryBadgeService } from '../../services/badge.service';
import { SetActivatedBadgesComposer } from '../../../../../client/nitro/communication/messages/outgoing/inventory/badges/SetActivatedBadgesComposer';
import { AchievementsService } from '../../../achievements/services/achievements.service';

@Component({
    selector: '[nitro-inventory-badges-component]',
    templateUrl: './badges.template.html'
})
export class InventoryBadgesComponent extends InventorySharedComponent implements OnInit, OnDestroy
{
    @Input()
    public visible: boolean = false;

    public selectedBadge: Badge = null;

    constructor(
        protected _inventoryService: InventoryService,
        protected _ngZone: NgZone,
        private _badgesService: InventoryBadgeService,
        private _achievementsService: AchievementsService)
    {
        super(_inventoryService, _ngZone);
    }

    public ngOnInit(): void
    {
        this._inventoryService.badgesController = this;
    }

    public ngOnDestroy(): void
    {
        this._inventoryService.badgesController = null;
    }

    public get badges(): Badge[]
    {
        const badges = this._badgesService.availableBadges;
        return badges.getValues();
    }

    public get wearableBadgesWithoutCurrentBadges(): Badge[]
    {
        const badges = this._badgesService.availableBadges.getValues();

        const returnBadges = [];

        for(const badge of badges)
        {
            if(!this._badgesService.isWearingBadge(badge)) returnBadges.push(badge);
        }

        return returnBadges;
    }

    public get wearing(): Badge[]
    {
        const badges = this._badgesService.currentBadges;
        return badges.getValues();
    }

    public get hasBadges(): boolean
    {
        return this.badges && this.badges.length > 0;
    }

    public isWearingBadge(badge: Badge): boolean
    {
        return this._badgesService.isWearingBadge(badge);
    }

    public get selectedBadgeName(): string
    {
        return Nitro.instance.localization.getBadgeName(this.selectedBadge.badgeId);
    }

    public handleClick(badge: Badge): void
    {
        this._badgesService.wearOrClearBadge(badge);
        const wearingBadges = this._badgesService.currentBadges.getValues();
        const composer = new SetActivatedBadgesComposer();
        for(const badge of wearingBadges)
        {
            composer.addActivatedBadge(badge.badgeId);
        }

        Nitro.instance.communication.connection.send(composer);
    }

    public get badgeButtonDisabled(): boolean
    {
        const limitReached = this._badgesService.badgeLimitReached();

        if(this.isWearingBadge(this.selectedBadge)) return false;

        return limitReached;
    }

    public get achievementsScore(): number
    {
        return this._achievementsService.achievementScore;
    }


}
