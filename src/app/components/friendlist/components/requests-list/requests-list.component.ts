import { Component, NgZone } from '@angular/core';
import { AcceptFriendComposer } from '../../../../../client/nitro/communication/messages/outgoing/friendlist/AcceptFriendComposer';
import { DeclineFriendComposer } from '../../../../../client/nitro/communication/messages/outgoing/friendlist/DeclineFriendComposer';
import { Nitro } from '../../../../../client/nitro/Nitro';
import { MessengerRequest } from '../../common/MessengerRequest';
import { FriendListService } from '../../services/friendlist.service';

@Component({
    selector: '[nitro-friendlist-requests-list-component]',
    templateUrl: './requests-list.template.html'
})
export class FriendListRequestsListComponent
{
    constructor(
        private _friendListService: FriendListService,
        private _ngZone: NgZone)
    {}

    public acceptRequest(request: MessengerRequest): void
    {
        if(!request) return;

        Nitro.instance.communication.connection.send(new AcceptFriendComposer(request.requestId));

        this.requests.delete(request.requestId);
    }

    public declineRequest(request: MessengerRequest): void
    {
        if(!request) return;

        Nitro.instance.communication.connection.send(new DeclineFriendComposer(false, request.requestId));

        this.requests.delete(request.requestId);
    }

    public declineAllRequests(): void
    {
        Nitro.instance.communication.connection.send(new DeclineFriendComposer(true, null));

        this.requests.clear();
    }

    public get requests(): Map<number, MessengerRequest>
    {
        return this._friendListService.requests;
    }
}