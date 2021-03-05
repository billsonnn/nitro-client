import { Component, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output } from '@angular/core';
import { ModTool } from '../tool.component';
import { ModToolService } from '../../services/mod-tool.service';
import { ModToolUserInfoService } from '../../services/mod-tool-user-info.service';
import { UserToolUser } from '../user-tool/user-tool-user';
import { ModtoolUserVisitedRoomsRoom } from '../../../../../client/nitro/communication/messages/parser/modtool/utils/ModtoolUserVisitedRoomsRoom';
import { NavigatorService } from '../../../navigator/services/navigator.service';
import { NotificationService } from '../../../notification/services/notification.service';
import { ModtoolEventAlertComposer } from '../../../../../client/nitro/communication/messages/outgoing/modtool/ModtoolEventAlertComposer';
import { Nitro } from '../../../../../client/nitro/Nitro';


@Component({
    selector: 'nitro-mod-tool-user-send-message-component',
    templateUrl: './template.html'
})
export class ModToolUserSendMessageComponent extends ModTool implements OnInit, OnDestroy
{
    @Input()
    public user: UserToolUser = null;

    public optionId: string = '-1';
    public message: string = '';

    constructor(
        private _modToolService: ModToolService,
        private _modToolUserInfoService: ModToolUserInfoService,
        private _notificationService: NotificationService
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
    }

    public get options(): string[]
    {
        if(!this._modToolService._Str_3325) return [];

        return this._modToolService._Str_3325._Str_15690;
    }

    public selectMessage(id: string)
    {
        if(id == '-1')
        {
            this.message = '';
            return;
        }

        const idNumber = parseInt(id);

        this.message = this.options[idNumber];

    }

    public sendMessage(): void
    {
        if(this.message.trim().length == 0)
        {
            this._notificationService.alert('Please enter a message');
            return;
        }

        Nitro.instance.communication.connection.send(new ModtoolEventAlertComposer(this.user.id, this.message, -999));
        this._modToolService.showSendUserMessage = false;
    }


}
