import { Component } from '@angular/core';
import { GroupsService } from '../../services/groups.service';

@Component({
    selector: 'nitro-group-room-info-component',
    templateUrl: './room-info.template.html'
})
export class GroupRoomInfoComponent
{
    private _open: boolean;

    constructor(private _groupService: GroupsService)
    {
        this._open = false;
    }

    public toggleOpen(): void
    {
        this._open = !this._open;
    }

    public join(): void
    {
        if(!this.groupId || this.isGroupMember) return;

        this._groupService.join(this.groupId);
    }

    public get visible(): boolean
    {
        return this._groupService.groupId > 0;
    }

    public get open(): boolean
    {
        return this._open;
    }

    public get groupId(): number
    {
        return this._groupService.groupId;
    }

    public get groupName(): string
    {
        return this._groupService.groupName;
    }

    public get groupBadgeCode(): string
    {
        return this._groupService.groupBadgeCode;
    }

    public get groupType(): number
    {
        return this._groupService.groupType;
    }

    public get groupMembershipType(): number
    {
        return this._groupService.groupMembershipType;
    }

    public get isGroupMember(): boolean
    {
        return this._groupService.isGroupMember;
    }

    public get roomGroupInfoLoaded(): boolean
    {
        return this._groupService.roomGroupInfoLoaded;
    }
}