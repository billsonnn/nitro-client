import { Component, OnInit } from '@angular/core';
import { GroupsService } from '../../services/groups.service';

@Component({
    selector: 'nitro-group-main-component',
    template: `
        <nitro-group-info-component></nitro-group-info-component>
        <nitro-group-members-component></nitro-group-members-component>
    `
})
export class GroupMainComponent implements OnInit
{
    
    
    constructor(
        private _groupsService: GroupsService
    )
    {}

    public ngOnInit(): void
    {
        this._groupsService.openGroupCreator();
    }

    
}
