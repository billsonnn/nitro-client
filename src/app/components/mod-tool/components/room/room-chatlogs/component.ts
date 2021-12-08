import { Component } from '@angular/core';
import { ChatRecordData } from '@nitrots/nitro-renderer';
import { NavigatorService } from '../../../../navigator/services/navigator.service';
import { ModToolUserInfoService } from '../../../services/mod-tool-user-info.service';
import { ModToolService } from '../../../services/mod-tool.service';
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
        if(!this._modToolService.currentRoomModData) return '';


        return `Room Chatlog: ${this._modToolService.currentRoomModData.data.room.name}`;
    }

    public getData(): ChatRecordData[]
    {

        if(!this._modToolService.userChatlogs) return [];

        if(!this._modToolService.currentRoomModData) return [];

        return [ this._modToolService.userChatlogs];
    }

    public close(): void
    {
        this._modToolService.showRoomChatLogs = false;
    }

}
