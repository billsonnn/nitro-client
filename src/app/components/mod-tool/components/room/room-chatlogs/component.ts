import { Component, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output } from '@angular/core';
import { ModTool } from '../../tool.component';
import { ModToolService } from '../../../services/mod-tool.service';
import { ModToolUserInfoService } from '../../../services/mod-tool-user-info.service';
import { ModtoolUserVisitedRoomsRoom } from '../../../../../../client/nitro/communication/messages/parser/modtool/utils/ModtoolUserVisitedRoomsRoom';
import { NavigatorService } from '../../../../navigator/services/navigator.service';
import { ModtoolUserChatlogParserVisit } from '../../../../../../client/nitro/communication/messages/parser/modtool/utils/ModtoolUserChatlogParserVisit';
import { ModToolChatlogsComponent } from '../../shared/chatlogs/component';
import { UserToolUser } from '../../user/user-tool/user-tool-user';


@Component({
    selector: 'nitro-mod-tool-room-chatlogs-component',
    templateUrl: '../../shared/chatlogs/template.html'
})
export class ModToolRoomChatlogsComponent extends ModToolChatlogsComponent
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

    public goToRoom(roomId: number): void
    {
        this._navigatorService.goToPrivateRoom(roomId);
    }

    public openRoomTools(roomId: number): void
    {
        this._modToolService.openRoomTool(roomId);
    }





}
