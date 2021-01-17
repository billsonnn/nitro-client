import { Component, Input, NgZone, OnChanges, SimpleChanges } from '@angular/core';
import { SendMessageComposer } from '../../../../../client/nitro/communication/messages/outgoing/friendlist/SendMessageComposer';
import { Nitro } from '../../../../../client/nitro/Nitro';
import { MessengerChat } from '../../common/MessengerChat';
import { MessengerFriend } from '../../common/MessengerFriend';
import { MessengerThread } from '../../common/MessengerThread';
import { FriendListService } from '../../services/friendlist.service';

@Component({
    selector: '[nitro-friendlist-thread-viewer-component]',
    templateUrl: './thread-viewer.template.html'
})
export class FriendListThreadViewerComponent implements OnChanges
{
    @Input()
    public thread: MessengerThread = null;

    constructor(
        private _friendListService: FriendListService,
        private _ngZone: NgZone)
    {}

    public ngOnChanges(changes: SimpleChanges): void
    {
        const prev = changes.thread.previousValue;
        const next = changes.thread.currentValue;

        if(next && (next !== prev)) this.prepareThread();
    }

    private prepareThread(): void
    {

    }

    public sendMessage(message: string): void
    {
        if(!this.participantOther || !message) return;

        // not sure if server sends back the chat, so this might need removing if it appears dupped
        this.thread.insertChat(this.participantSelf.id, message, 0, null);

        Nitro.instance.communication.connection.send(new SendMessageComposer(this.participantOther.id, message));
    }

    public get participantSelf(): MessengerFriend
    {
        return this.thread.participantSelf;
    }

    public get participantOther(): MessengerFriend
    {
        return this.thread.participantOther;
    }

    public get chats(): MessengerChat[]
    {
        return this.thread.chats;
    }
}