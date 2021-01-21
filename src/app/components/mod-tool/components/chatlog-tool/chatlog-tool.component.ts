import { Component, Input, NgZone, OnDestroy, EventEmitter, OnInit, Output } from '@angular/core';
import { ModTool } from '../tool.component';

@Component({
    selector: 'nitro-mod-tool-chatlog-component',
    templateUrl: './chatlog-tool.template.html'
})
export class ModToolChatlogComponent extends ModTool implements OnInit, OnDestroy
{

    constructor()
    {
        super();
    }

    public ngOnInit(): void
    {
    }

    public ngOnDestroy(): void
    {
    }

}
