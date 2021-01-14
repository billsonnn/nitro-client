import { Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { MessengerInitComposer } from '../../../../../client/nitro/communication/messages/outgoing/friendlist/MessengerInitComposer';
import { Nitro } from '../../../../../client/nitro/Nitro';
import { SettingsService } from '../../../../core/settings/service';
import { FriendListService } from '../../services/friendlist.service';

@Component({
    selector: 'nitro-friendlist-main-component',
    templateUrl: './main.template.html'
})
export class FriendListMainComponent implements OnInit, OnDestroy
{
    @Input()
    public visible: boolean = false;

    constructor(
        private _settingsService: SettingsService,
        private _friendListService: FriendListService,
        private _ngZone: NgZone)
    {}

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
}