import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ModTool } from '../../tool.component';
import { ModToolService } from '../../../services/mod-tool.service';
import { ModToolUserInfoService } from '../../../services/mod-tool-user-info.service';
import { NavigatorService } from '../../../../navigator/services/navigator.service';
import { ModtoolUserChatlogParserVisit } from '../../../../../../client/nitro/communication/messages/parser/modtool/utils/ModtoolUserChatlogParserVisit';
import { UserToolUser } from '../../user/user-tool/user-tool-user';


@Component({
    template: ''
})
export abstract class ModToolChatlogsComponent
{
    @Input()
    public user: UserToolUser = null;


    constructor(
        protected _modToolService: ModToolService,
        protected _navigatorService: NavigatorService
    )
    {

    }

    protected abstract title: string;
    abstract getData(): ModtoolUserChatlogParserVisit[];
    abstract close(): void;


    public goToRoom(roomId: number): void
    {
        this._navigatorService.goToPrivateRoom(roomId);
    }

    public openRoomTools(roomId: number): void
    {
        this._modToolService.openRoomTool(roomId);
    }
}
