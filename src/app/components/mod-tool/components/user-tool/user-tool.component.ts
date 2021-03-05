import { Component, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output } from '@angular/core';
import { ModTool } from '../tool.component';
import { ModToolService } from '../../services/mod-tool.service';
import { UserToolUser } from './user-tool-user';

@Component({
    selector: 'nitro-mod-tool-user-component',
    templateUrl: './user-tool.template.html'
})
export class ModToolUserComponent extends ModTool implements OnInit, OnDestroy
{
    @Input()
    public user: UserToolUser = null;

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

    public close(): void
    {
        this._modToolService.closeUserTool();
    }
}
