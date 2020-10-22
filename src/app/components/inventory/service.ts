import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { IMessageEvent } from '../../../client/core/communication/messages/IMessageEvent';
import { UserCurrencyEvent } from '../../../client/nitro/communication/messages/incoming/user/inventory/currency/UserCurrencyEvent';
import { UserCurrencyComposer } from '../../../client/nitro/communication/messages/outgoing/user/inventory/currency/UserCurrencyComposer';
import { Nitro } from '../../../client/nitro/Nitro';
import { RoomSessionEvent } from '../../../client/nitro/session/events/RoomSessionEvent';
import { IRoomSession } from '../../../client/nitro/session/IRoomSession';
import { UnseenItemCategory } from './unseen/UnseenItemCategory';
import { UnseenItemTracker } from './unseen/UnseenItemTracker';

@Injectable()
export class InventoryService implements OnDestroy
{
    private _messages: IMessageEvent[];
    private _unseenTracker: UnseenItemTracker;
    private _roomSession: IRoomSession;

    private _unseenCount: number = 0;
    private _unseenCounts: Map<number, number>;

    private _furnitureVisible: boolean = false;
    private _tradingVisible: boolean = false;

    constructor(
        private _ngZone: NgZone)
    {
        this._messages      = [];
        this._unseenTracker = new UnseenItemTracker(Nitro.instance.communication, this);
        this._roomSession   = null;

        this._unseenCounts  = new Map();

        Nitro.instance.communication.connection.send(new UserCurrencyComposer());

        this.registerMessages();
    }

    public ngOnDestroy(): void
    {
        this.unregisterMessages();

        if(this._unseenTracker)
        {
            this._unseenTracker.dispose();

            this._unseenTracker = null;
        }
    }

    private registerMessages(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            Nitro.instance.roomSessionManager.events.addEventListener(RoomSessionEvent.STARTED, this.onRoomSessionEvent.bind(this));
            Nitro.instance.roomSessionManager.events.addEventListener(RoomSessionEvent.ENDED, this.onRoomSessionEvent.bind(this));

            this._messages = [
                new UserCurrencyEvent(this.onUserCurrencyEvent.bind(this))
            ];

            for(let message of this._messages) Nitro.instance.communication.registerMessageEvent(message);
        });
    }

    public unregisterMessages(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            for(let message of this._messages) Nitro.instance.communication.removeMessageEvent(message);

            this._messages = [];
        });
    }

    private onRoomSessionEvent(event: RoomSessionEvent): void
    {
        if(!event) return;

        switch(event.type)
        {
            case RoomSessionEvent.STARTED:
                this._roomSession = event.session;
                return;
            case RoomSessionEvent.ENDED:
                this._roomSession = null;
                return;
        }
    }

    private onUserCurrencyEvent(event: UserCurrencyEvent): void
    {

    }

    public updateUnseenCount(): void
    {
        function run()
        {
            let count = 0;

            const furniCount = this._unseenTracker._Str_5621(UnseenItemCategory.FURNI);
    
            count += furniCount;
    
            this._unseenCounts.set(UnseenItemCategory.FURNI, furniCount);
    
            this._unseenCount = count;
        }

        if(!NgZone.isInAngularZone())
        {
            this._ngZone.run(() => run.apply(this));
        }
        else
        {
            run.apply(this);
        }
    }

    public get unseenTracker(): UnseenItemTracker
    {
        return this._unseenTracker;
    }

    public get roomSession(): IRoomSession
    {
        return this._roomSession;
    }

    public get unseenCount(): number
    {
        return this._unseenCount;
    }

    public get furnitureVisible(): boolean
    {
        return this._furnitureVisible;
    }

    public set furnitureVisible(flag: boolean)
    {
        this._furnitureVisible = flag;
    }

    public get tradingVisible(): boolean
    {
        return this._tradingVisible;
    }

    public set tradingVisible(flag: boolean)
    {
        this._tradingVisible = flag;
    }
}