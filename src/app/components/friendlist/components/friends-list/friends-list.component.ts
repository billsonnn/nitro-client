import { Component, Input, NgZone } from '@angular/core';
import { MessengerFriend } from '../../common/MessengerFriend';
import { MessengerThread } from '../../common/MessengerThread';
import { FriendListService } from '../../services/friendlist.service';

@Component({
    selector: '[nitro-friendlist-friends-list-component]',
    templateUrl: './friends-list.template.html'
})
export class FriendListFriendsListComponent
{
    @Input()
    public threadSelector: (thread: MessengerThread) => void = null;

    @Input()
    public onlineOnly: boolean = false;

    constructor(
        private _friendListService: FriendListService,
        private _ngZone: NgZone)
    {}

    public selectThread(friend: MessengerFriend): void
    {
        if(!friend) return;

        const thread = this._friendListService.getMessageThread(friend.id);

        if(!thread) return;

        if(this.threadSelector) this.threadSelector(thread);
    }

    public get friends(): MessengerFriend[]
    {
        const friends = Array.from(this._friendListService.friends.values());

        if(this.onlineOnly)
        {
            return friends.filter(friend =>
            {
                return friend.online;
            });
        }

        return friends;
    }
}