import { Component, Input, NgZone } from '@angular/core';
import { MessengerThread } from '../../common/MessengerThread';
import { FriendListService } from '../../services/friendlist.service';

@Component({
    selector: '[nitro-friendlist-friends-viewer-component]',
    templateUrl: './friends-viewer.template.html'
})
export class FriendListFriendsViewerComponent
{
    @Input()
    public threadSelector: (thread: MessengerThread) => void = null;

    private _requestsShowing: boolean = false;
    private _friendsShowing: boolean = true;
    private _onlineOnly: boolean = true;

    constructor(
        private _friendListService: FriendListService,
        private _ngZone: NgZone)
    {}

    public showOnlineFriends(): void
    {
        this.showFriends();

        this._onlineOnly = true;
    }

    public showFriends(): void
    {
        this._requestsShowing   = false;
        this._friendsShowing    = true;
        this._onlineOnly        = false;
    }

    public showRequests(): void
    {
        this._requestsShowing   = true;
        this._friendsShowing    = false;
        this._onlineOnly        = false;
    }

    public get requestsShowing(): boolean
    {
        return this._requestsShowing;
    }

    public get friendsShowing(): boolean
    {
        return this._friendsShowing;
    }

    public get onlineOnly(): boolean
    {
        return this._onlineOnly;
    }

    public get totalFriendRequests(): number
    {
        return this._friendListService.requests.size;
    }
}