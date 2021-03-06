import { Component, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output } from '@angular/core';
import { ModTool } from '../../tool.component';
import { ModToolService } from '../../../services/mod-tool.service';
import { ModToolUserInfoService } from '../../../services/mod-tool-user-info.service';
import { UserToolUser } from '../user-tool/user-tool-user';
import { ModtoolUserVisitedRoomsRoom } from '../../../../../../client/nitro/communication/messages/parser/modtool/utils/ModtoolUserVisitedRoomsRoom';
import { NavigatorService } from '../../../../navigator/services/navigator.service';
import { ModtoolUserChatlogParserVisit } from '../../../../../../client/nitro/communication/messages/parser/modtool/utils/ModtoolUserChatlogParserVisit';
import { ModToolChatlogsComponent } from '../../shared/chatlogs/component';


@Component({
    selector: 'nitro-mod-tool-user-chatlogs-component',
    templateUrl: '../../shared/chatlogs/template.html'
})
export class ModToolUserChatlogsComponent extends ModToolChatlogsComponent
{
    @Input()
    public user: UserToolUser = null;


    constructor(
        protected _modToolService: ModToolService,
        private _modToolUserInfoService: ModToolUserInfoService,
        protected _navigatorService: NavigatorService
    )
    {
        super(_modToolService, _navigatorService);
    }

    public get title(): string
    {
        if(!this.user) return '';

        return `Chatlogs: ${this.user.username}`;
    }

    public getData(): ModtoolUserChatlogParserVisit[]
    {
        if(!this._modToolService.roomVisits) return [];

        return this._modToolService.roomVisits;
    }


    public close(): void
    {
        this._modToolService.showSendUserChatlogs = false;
    }

}
