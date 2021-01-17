import { Component, Input, NgZone } from '@angular/core';
import { AcceptFriendComposer } from '../../../../../client/nitro/communication/messages/outgoing/friendlist/AcceptFriendComposer';
import { DeclineFriendComposer } from '../../../../../client/nitro/communication/messages/outgoing/friendlist/DeclineFriendComposer';
import { Nitro } from '../../../../../client/nitro/Nitro';
import { MessengerFriend } from '../../common/MessengerFriend';
import { MessengerRequest } from '../../common/MessengerRequest';
import { MessengerThread } from '../../common/MessengerThread';
import { FriendListService } from '../../services/friendlist.service';

@Component({
    selector: '[nitro-friendlist-thread-list-component]',
    templateUrl: './thread-list.template.html'
})
export class FriendListThreadListComponent
{
    @Input()
    public threadSelector: (thread: MessengerThread) => void = null;

    public options: Array<string> = ['friendlist.tip.tab.1', 'friendlist.tip.tab.2'];

    public optionActive:number = 0;

    constructor(
        private _friendListService: FriendListService,
        private _ngZone: NgZone)
    { }

    public changeTab(tab: number)
    { 
        this.optionActive = tab;
    }

    public friendRequest(opt: boolean, friend: MessengerRequest)
    {
        if (opt)
        {
            console.log(friend)
            Nitro.instance.communication.connection.send(new AcceptFriendComposer(friend.requesterUserId))
        } else
        { 
            Nitro.instance.communication.connection.send(new DeclineFriendComposer(false,friend.requesterUserId))
        } 
        
    }

    public selectThread(thread: MessengerThread): void
    {
        if(!thread) return;

        if(this.threadSelector) this.threadSelector(thread);
    }

    public thread(id: number): MessengerThread
    { 
        let thread = this._friendListService.currentThread = this._friendListService.getMessageThread(id);
        
        return thread;
    }

    public get offlineFriends(): Map<number, MessengerFriend>
    {
        return this._friendListService.friends;
    }

    public get friendRequests(): Map<number, MessengerRequest>
    {
        return this._friendListService.requests;
    }

    public get onlineFriends(): Map<number, MessengerFriend>
    {
        var online = new Map();

        var friends = this._friendListService.friends;

        for (let friend of friends) { 
            if (friend[1].online)
            { 
                online.set(friend[1].id, friend[1])
            }
        }
        
        return online;
    }

}