import { Injectable, OnDestroy } from '@angular/core';
import { UserInfoEvent } from '../../../client/nitro/communication/messages/incoming/user/data/UserInfoEvent';
import { Nitro } from '../../../client/nitro/Nitro';

@Injectable()
export class SessionService implements OnDestroy
{
    constructor()
    {
        Nitro.instance.communication.registerMessageEvent(new UserInfoEvent(this.onUserInfoEvent.bind(this)));
    }

    public ngOnDestroy(): void
    {
        Nitro.instance.communication.removeMessageEvent(new UserInfoEvent(this.onUserInfoEvent.bind(this)));
    }

    private onUserInfoEvent(event: UserInfoEvent): void
    {
        if(!event) return;

        console.log(event);
    }
}