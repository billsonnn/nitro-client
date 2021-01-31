import { Component, Input, NgZone, OnDestroy, EventEmitter, OnInit, Output } from '@angular/core';
import { ModTool } from '../tool.component';
import { ModToolService } from '../../services/mod-tool.service';
import { ModtoolUserChatlogParserVisit } from '../../../../../client/nitro/communication/messages/parser/modtool/utils/ModtoolUserChatlogParserVisit';
import { ModtoolRoomChatlogLine } from '../../../../../client/nitro/communication/messages/parser/modtool/utils/ModtoolRoomChatlogLine';

@Component({
    selector: 'nitro-mod-tool-chatlog-component',
    templateUrl: './chatlog-tool.template.html'
})
export class ModToolChatlogComponent extends ModTool implements OnInit, OnDestroy
{
    private _showUserChatlogs: boolean;
    private _showRoomChatlogs: boolean;

    constructor(private _modToolService: ModToolService)
    {
        super();
        this._showUserChatlogs = false;
        this._showRoomChatlogs = true;
    }

    public ngOnInit(): void
    {
    }

    public ngOnDestroy(): void
    {
    }

    public get visits(): ModtoolUserChatlogParserVisit[]
    {
        return this._modToolService.roomVisits;
    }

    public get roomChatlogs(): ModtoolRoomChatlogLine[]
    {
        return this._modToolService.roomChatlogs;
    }

    public showUserChatlogs(): boolean
    {
        return this._showUserChatlogs;
    }

    public showRoomChatlogs(): boolean
    {
        return this._showRoomChatlogs;
    }

    public toggleChatlogWindows(): void
    {
        this._showRoomChatlogs = !this._showRoomChatlogs;
        this._showUserChatlogs = !this._showUserChatlogs;
    }
}
