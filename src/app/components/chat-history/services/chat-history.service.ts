import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { IMessageEvent } from '../../../../client/core/communication/messages/IMessageEvent';
import { RoomInfoEvent } from '../../../../client/nitro/communication/messages/incoming/room/data/RoomInfoEvent';
import { Nitro } from '../../../../client/nitro/Nitro';
import { ChatHistoryItem } from '../common/ChatHistoryItem';

@Injectable()
export class ChatHistoryService implements OnDestroy
{
    private _messages: IMessageEvent[];

    private _lastRoomId: number;
    private _queuedRoomId: number;
    private _queuedHistoryItems: ChatHistoryItem[];
    private _historyItems: ChatHistoryItem[];

    constructor(
        private _ngZone: NgZone)
    {
        this.flush();

        this.registerMessages();
    }

    ngOnDestroy(): void
    {
        this.unregisterMessages();
    }

    private registerMessages(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            this.unregisterMessages();

            this._messages = [
                new RoomInfoEvent(this.onRoomInfoEvent.bind(this))
            ];

            for(const message of this._messages) Nitro.instance.communication.registerMessageEvent(message);
        });
    }

    private unregisterMessages(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            if(this._messages && this._messages.length)
            {
                for(const message of this._messages) Nitro.instance.communication.removeMessageEvent(message);

                this._messages = [];
            }
        });
    }

    private flush(): void
    {
        this._lastRoomId         = 0;
        this._queuedRoomId       = 0;
        this._queuedHistoryItems = [];
        this._historyItems       = [];
    }

    private onRoomInfoEvent(event: RoomInfoEvent): void
    {
        const parser = event.getParser();

        if(!parser) return;

        this._queuedRoomId = 0;

        this.addItem(new ChatHistoryItem(true, parser.data.roomName, Date.now()));

        this._lastRoomId = Nitro.instance.roomEngine.activeRoomId;

        for(let i = 0; i < this._queuedHistoryItems.length; i++)
        {
            this.addItem(this._queuedHistoryItems[i]);
        }

        this._queuedHistoryItems = [];
    }

    public addItem(chatHistoryItem: ChatHistoryItem): void
    {
        const currentRoomId = Nitro.instance.roomEngine.activeRoomId;

        /*if(chatHistoryItem.isRoomName && currentRoomId === this._lastRoomId)
        {
            console.log(currentRoomId, this._lastRoomId)
            return;
        }*/

        if(currentRoomId !== this._lastRoomId)
        {
            if(currentRoomId !== this._queuedRoomId)
            {
                this._queuedHistoryItems = [];
            }

            this._queuedRoomId = currentRoomId;
            this._queuedHistoryItems.push(chatHistoryItem);
        }
        else
        {
            this._ngZone.run(() =>
            {
                this._historyItems.push(chatHistoryItem);
            });
        }
    }

    public get historyItems(): ChatHistoryItem[]
    {
        return this._historyItems;
    }
}