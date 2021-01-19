import { Component, Input, NgZone } from '@angular/core';
import { MessengerThread } from '../../common/MessengerThread';
import { FriendListService } from '../../services/friendlist.service';

@Component({
    selector: '[nitro-friendlist-thread-list-component]',
    templateUrl: './thread-list.template.html'
})
export class FriendListThreadListComponent
{
    @Input()
    public currentThread: MessengerThread = null;
    
    @Input()
    public threadSelector: (thread: MessengerThread) => void = null;

    constructor(
        private _friendListService: FriendListService,
        private _ngZone: NgZone)
    {}

    public selectThread(thread: MessengerThread): void
    {
        if(!thread) return;

        if(this.threadSelector) this.threadSelector(thread);
    }

    public get threads(): Map<number, MessengerThread>
    {
        return this._friendListService.threads;
    }
}