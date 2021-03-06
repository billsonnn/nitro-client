import { Component, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output } from '@angular/core';
import { ModTool } from '../../tool.component';
import { ModToolService } from '../../../services/mod-tool.service';
import { ModToolUserInfoService } from '../../../services/mod-tool-user-info.service';
import { UserToolUser } from '../user-tool/user-tool-user';
import { ModtoolUserVisitedRoomsRoom } from '../../../../../../client/nitro/communication/messages/parser/modtool/utils/ModtoolUserVisitedRoomsRoom';
import { NavigatorService } from '../../../../navigator/services/navigator.service';
import { ModtoolUserChatlogParserVisit } from '../../../../../../client/nitro/communication/messages/parser/modtool/utils/ModtoolUserChatlogParserVisit';


@Component({
    selector: 'nitro-mod-tool-user-chatlogs-component',
    templateUrl: './template.html'
})
export class ModToolUserChatlogsComponent extends ModTool implements OnInit, OnDestroy
{
    @Input()
    public user: UserToolUser = null;


    constructor(
        private _modToolService: ModToolService,
        private _modToolUserInfoService: ModToolUserInfoService,
        private _navigatorService: NavigatorService
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
        this._modToolService.closeRoomVisitedTool();
    }

    public get roomsVisited(): ModtoolUserChatlogParserVisit[]
    {
        if(!this._modToolService.roomVisits) return [];

        return this._modToolService.roomVisits;
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
