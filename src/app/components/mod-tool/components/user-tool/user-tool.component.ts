import { Component, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output } from '@angular/core';
import { ModTool } from '../tool.component';

@Component({
    selector: 'nitro-mod-tool-user-component',
    templateUrl: './user-tool.template.html'
})
export class ModToolUserComponent extends ModTool implements OnInit, OnDestroy
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
