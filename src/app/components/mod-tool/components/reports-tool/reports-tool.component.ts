import { Component, Input, OnDestroy, EventEmitter, OnInit, Output } from '@angular/core';
import { ModTool } from '../tool.component';

@Component({
    selector: 'nitro-mod-tool-reports-component',
    templateUrl: './reports-tool.template.html'
})
export class ModToolReportsComponent extends ModTool implements OnInit, OnDestroy
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
