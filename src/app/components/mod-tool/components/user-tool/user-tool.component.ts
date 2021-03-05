import { Component, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output } from '@angular/core';
import { ModTool } from '../tool.component';
import { ModToolService } from '../../services/mod-tool.service';
import { UserToolUser } from './user-tool-user';
import { ModToolUserInfoService } from '../../services/mod-tool-user-info.service';
import { _Str_5467 } from '../../../../../client/nitro/communication/messages/parser/modtool/utils/_Str_5467';
import { Nitro } from '../../../../../client/nitro/Nitro';
import { ModtoolRequestUserRoomsComposer } from '../../../../../client/nitro/communication/messages/outgoing/modtool/ModtoolRequestUserRoomsComposer';


@Component({
    selector: 'nitro-mod-tool-user-component',
    templateUrl: './user-tool.template.html'
})
export class ModToolUserComponent extends ModTool implements OnInit, OnDestroy
{
    @Input()
    public user: UserToolUser = null;


    constructor(
        private _modToolService: ModToolService,
        private _modToolUserInfoService: ModToolUserInfoService
    )
    {
        super();
    }

    public ngOnInit(): void
    {
    }

    public ngOnDestroy(): void
    {
    }

    public close(): void
    {
        this._modToolService.closeUserTool();
    }

    public userData(): _Str_5467
    {
        return this._modToolUserInfoService.currentUserInfo;
    }

    public get userProperties(): UserInfoOption[]
    {
        const data = this._modToolUserInfoService.currentUserInfo;

        if(!data) return [];

        return [
            {
                nameKey: 'name',
                nameKeyFallback: 'Name',
                value: data.userName
            },
            {
                nameKey: 'cfhs',
                nameKeyFallback: 'CFHs',
                value: data._Str_24656.toString()
            },
            {
                nameKey: 'abusive_cfhs',
                nameKeyFallback: 'Abusive CFHs',
                value:  data._Str_22987.toString()
            },
            {
                nameKey: 'cautions',
                nameKeyFallback: 'Cautions',
                value: data._Str_16987.toString()
            },
            {
                nameKey: 'bans',
                nameKeyFallback: 'Bans',
                value: data._Str_20373.toString()
            },
            {
                nameKey: 'last_sanction',
                nameKeyFallback: 'Last sanction',
                value: data._Str_24447
            },
            {
                nameKey: 'trade_locks',
                nameKeyFallback: 'Trade locks',
                value: data._Str_24526.toString()
            },
            {
                nameKey: 'lock_expires',
                nameKeyFallback: 'Lock expires',
                value: data._Str_23969
            },
            {
                nameKey: 'last_login',
                nameKeyFallback: 'Last login',
                value: ModToolUserComponent._Str_12797(data._Str_23276 * 60)
            },
            {
                nameKey: 'purchase',
                nameKeyFallback: 'Purchases',
                value: data._Str_22786
            },
            {
                nameKey: 'email',
                nameKeyFallback: 'Email',
                value: data._Str_20219
            },
            {
                nameKey: 'acc_bans',
                nameKeyFallback: 'Banned Accs.',
                value: data._Str_22700.toString()
            },
            {
                nameKey: 'registered',
                nameKeyFallback: 'Registered',
                value: ModToolUserComponent._Str_12797(data._Str_24334 * 60)
            },
            {
                nameKey: 'rank',
                nameKeyFallback: 'Rank',
                value: data._Str_22262
            }
        ];
    }


    public handleClick(button: string): void
    {
        switch(button)
        {
            case 'roomchat':
            case 'send_message':
                this._modToolService.showSendUserMessage = true;
                break;
            case 'room_visits':
                this._modToolService.showVisitedRoomsForUser = true;
                Nitro.instance.communication.connection.send(new ModtoolRequestUserRoomsComposer(this.user.id));
                break;
            case 'mod_action':
                this._modToolService.showModActionOnUser = true;
                break;
        }
    }


    public static _Str_12797(k:number):string
    {
        if(k < (2 * 60))
        {
            return k + ' secs ago';
        }
        if(k < (2 * 3600))
        {
            return Math.round((k / 60)) + ' mins ago';
        }
        if(k < (2 * 86400))
        {
            return Math.round((k / 3600)) + ' hours ago';
        }
        if(k < (2 * 31536000))
        {
            return Math.round((k / 86400)) + ' days ago';
        }
        return Math.round((k / 31536000)) + ' years ago';
    }

}

interface UserInfoOption
{
    nameKey: string;
    nameKeyFallback: string;
    value: string;
}
