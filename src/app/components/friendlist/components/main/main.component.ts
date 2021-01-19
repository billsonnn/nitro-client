import { Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { MessengerInitComposer } from '../../../../../client/nitro/communication/messages/outgoing/friendlist/MessengerInitComposer';
import { Nitro } from '../../../../../client/nitro/Nitro';
import { SettingsService } from '../../../../core/settings/service';
import { MessengerThread } from '../../common/MessengerThread';
import { FriendListService } from '../../services/friendlist.service';

@Component({
    selector: 'nitro-friendlist-main-component',
    templateUrl: './main.template.html'
})
export class FriendListMainComponent implements OnInit, OnDestroy
{
    @Input()
    public visible: boolean = false;

    private _currentThread: MessengerThread = null;
    private _friendsVisible: boolean = true;

    constructor(
        private _settingsService: SettingsService,
        private _friendListService: FriendListService,
        private _ngZone: NgZone)
    {
        this.selectThread = this.selectThread.bind(this);
    }

    public ngOnInit(): void
    {
        this._friendListService.component = this;

        Nitro.instance.communication.connection.send(new MessengerInitComposer());
    }

    public ngOnDestroy(): void
    {
        this._friendListService.component = null;
    }

    public hide(): void
    {
        this._settingsService.hideFriendList();
    }

    public displayFriends(): void
    {
        this._friendsVisible    = true;
        this._currentThread     = null;
    }

    public selectThread(thread: MessengerThread): void
    {
        if(!thread) return;

        this._friendsVisible    = false;
        this._currentThread     = thread;
    }

    public get currentThread(): MessengerThread
    {
        return this._currentThread;
    }

    public get friendsVisible(): boolean
    {
        return (this._friendsVisible && !this._currentThread);
    }

    public get totalFriendRequests(): number
    {
        return this._friendListService.requests.size;
    }
}