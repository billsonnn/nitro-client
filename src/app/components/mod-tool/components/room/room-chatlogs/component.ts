import { Component } from '@angular/core';
import { ModToolService } from '../../../services/mod-tool.service';
import { ModToolUserInfoService } from '../../../services/mod-tool-user-info.service';
import { NavigatorService } from '../../../../navigator/services/navigator.service';
import { ModtoolUserChatlogParserVisit } from '../../../../../../client/nitro/communication/messages/parser/modtool/utils/ModtoolUserChatlogParserVisit';
import { ModToolChatlogsComponent } from '../../shared/chatlogs/component';


@Component({
    selector: 'nitro-mod-tool-room-chatlogs-component',
    templateUrl: '../../shared/chatlogs/template.html'
})
export class ModToolRoomChatlogsComponent extends ModToolChatlogsComponent
{

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
        return '';
    }


    public getData(): ModtoolUserChatlogParserVisit[]
    {
        if(!this._modToolService.roomVisits) return [];

        return this._modToolService.roomVisits;
    }

    public close(): void
    {
        this._modToolService.showRoomChatLogs = false;
    }

}
