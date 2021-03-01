import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { Nitro } from '../../../../client/nitro/Nitro';
import { _Str_5147 } from '../../../../client/nitro/communication/messages/incoming/inventory/badges/_Str_5147';
import { IMessageEvent } from '../../../../client/core/communication/messages/IMessageEvent';
import { AdvancedMap } from '../../../../client/core/utils/AdvancedMap';
import { Badge } from '../models/badge';


@Injectable()
export class InventoryBadgeService implements OnDestroy
{
    private _messages: IMessageEvent[] = [];
    private _availableBadges: AdvancedMap<string, Badge> = new AdvancedMap<string, Badge>();
    private _badgesInUse: AdvancedMap<string, Badge> = new AdvancedMap<string, Badge>();

    constructor(
        private _ngZone: NgZone)
    {
        this.registerMessages();
    }

    public ngOnDestroy(): void
    {
        this.unregisterMessages();
    }

    private registerMessages(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {

            this._messages = [
                new _Str_5147(this.onBadgesListEvent.bind(this)),
            ];

            for(const message of this._messages) Nitro.instance.communication.registerMessageEvent(message);
        });
    }

    public unregisterMessages(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            for(const message of this._messages) Nitro.instance.communication.removeMessageEvent(message);

            this._messages = [];
        });
    }


    private onBadgesListEvent(event: _Str_5147): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        const local6 = parser._Str_21415();
        const local7 = parser._Str_23681();
        for(const badgeId of local6)
        {
            const isWearingBadge = local7.indexOf(badgeId) > -1;
            const local9 = parser._Str_17775(badgeId);
            this.updateBadge(badgeId, isWearingBadge, local9, isWearingBadge);
        }
    }

    public isWearingBadge(badge: Badge): boolean
    {
        return this._badgesInUse.hasKey(badge.badgeId);
    }

    public get availableBadges(): AdvancedMap<string, Badge>
    {
        return this._availableBadges;
    }

    public get currentBadges(): AdvancedMap<string, Badge>
    {
        return this._badgesInUse;
    }

    private updateBadge(k: string, arg2: boolean, arg3: number, isWearing: boolean): void
    {
        if(arg3 > 0)
        {
            this._availableBadges.add(k, new Badge(k, false));
        }

        if(isWearing)
        {
            this._badgesInUse.add(k, new Badge(k, false));
        }
    }

    public wearOrClearBadge(badge: Badge)
    {
        if(this.isWearingBadge(badge))
        {
            this._badgesInUse.remove(badge.badgeId);
        }
        else
        {
            this._badgesInUse.add(badge.badgeId, badge);
        }
    }

    public badgeLimitReached(): boolean
    {
        return this._badgesInUse.length == 5;
    }
}
