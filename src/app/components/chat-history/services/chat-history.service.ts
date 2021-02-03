import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { IMessageEvent } from '../../../../client/core/communication/messages/IMessageEvent';
import { AdvancedMap } from '../../../../client/core/utils/AdvancedMap';
import { RoomInfoEvent } from '../../../../client/nitro/communication/messages/incoming/room/data/RoomInfoEvent';
import { Nitro } from '../../../../client/nitro/Nitro';
import { ChatHistoryItem } from '../common/ChatHistoryItem';
import { ChatHistorySet } from '../common/ChatHistorySet';

@Injectable()
export class ChatHistoryService implements OnDestroy
{
    public static MESSAGE_RECEIVED: string = 'CHS_MESSAGE_RECEIVED';

    private _messages: IMessageEvent[];

    private _lastRoomId: number  = -1;
    private _historySets: AdvancedMap<number, ChatHistorySet>;
    private _queuedItems: AdvancedMap<number, ChatHistoryItem[]>;

    constructor(private _ngZone: NgZone)
    {
        this._historySets   = new AdvancedMap();
        this._queuedItems   = new AdvancedMap();

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

    private onRoomInfoEvent(event: RoomInfoEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        const data = parser.data;

        if(this._lastRoomId === data.roomId) return;

        this._ngZone.run(() =>
        {
            this._lastRoomId = data.roomId;

            const entryItem = new ChatHistoryItem();

            entryItem.content = (parser.data.roomName + '');

            this.addItem(this._lastRoomId, entryItem);

            this.processQueue(this._lastRoomId);
        });
    }

    public addItem(roomId: number, item: ChatHistoryItem): void
    {
        if(!item) return;

        this._ngZone.run(() =>
        {
            const history = this.getHistorySet(roomId);

            if(!history)
            {
                const queue = this.getHistoryQueue(roomId);

                if(queue) queue.push(item);

                return;
            }

            history.addItem(item);
        });
    }

    public getHistorySet(roomId: number): ChatHistorySet
    {
        let existing = this._historySets.getValue(roomId);

        if(!existing)
        {
            existing = new ChatHistorySet(roomId);

            this._historySets.add(roomId, existing);
        }

        return existing;
    }

    public getHistoryQueue(roomId: number): ChatHistoryItem[]
    {
        let existing = this._queuedItems.getValue(roomId);

        if(!existing)
        {
            existing = [];

            this._queuedItems.add(roomId, existing);
        }

        return existing;
    }

    public processQueue(roomId: number): void
    {
        const existing = this._queuedItems.getValue(roomId);

        if(!existing) return;

        for(const item of existing) (item && this.addItem(roomId, item));

        this._queuedItems.remove(roomId);
    }

    public get historySets(): AdvancedMap<number, ChatHistorySet>
    {
        return this._historySets;
    }
}