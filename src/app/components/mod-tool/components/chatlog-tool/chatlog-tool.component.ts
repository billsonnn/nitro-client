import { Component, Input, NgZone, OnDestroy, EventEmitter, OnInit, Output } from '@angular/core';
import { ModTool } from '../tool.component';
import { ModToolService } from '../../services/mod-tool.service';
import { ModtoolUserChatlogParserVisit } from '../../../../../client/nitro/communication/messages/parser/modtool/utils/ModtoolUserChatlogParserVisit';

@Component({
    selector: 'nitro-mod-tool-chatlog-component',
    templateUrl: './chatlog-tool.template.html'
})
export class ModToolChatlogComponent extends ModTool implements OnInit, OnDestroy
{

    constructor(private _modToolService: ModToolService)
    {
        super();
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

}
