import { Component, NgZone } from '@angular/core';
import { GroupRemoveMemberComposer } from '../../../../../client/nitro/communication/messages/outgoing/group/GroupRemoveMemberComposer';
import GroupMemberParser from '../../../../../client/nitro/communication/messages/parser/group/utils/GroupMemberParser';
import { Nitro } from '../../../../../client/nitro/Nitro';
import { NotificationChoice } from '../../../notification/components/choices/choices.component';
import { GroupsService } from '../../services/groups.service';

@Component({
    selector: 'nitro-group-members-component',
    templateUrl: './group-members.template.html'
})
export class GroupMembersComponent
{
    private _groupId: number;
    private _groupName: string;
    private _groupBadgeCode: string;
    private _totalMembersCount: number;
    private _result: GroupMemberParser[];
    private _admin: boolean;
    private _pageSize: number;
    private _pageIndex: number;
    private _level: number;
    
    public query: string;

    constructor(
        private _ngZone: NgZone,
        private _groupService: GroupsService)
    {
        this._groupService.groupMembersComponent = this;
        
        this.clear();
    }

    public clear(): void
    {
        this._ngZone.run(() => {
            this._groupId           = 0;
            this._groupName         = null;
            this._groupBadgeCode    = null;
            this._totalMembersCount = 0;
            this._result            = [];
            this._admin             = false;
            this._pageSize          = 0;
            this._pageIndex         = 0;
            this._level             = 0;
            this.query              = null;
        });
    }

    public confirmRemove(userId: number, furnitureCount: number): [string, string, NotificationChoice[]]
    {
        const title = Nitro.instance.localization.getValue('group.kickconfirm.title');

        let message = null;

        if(furnitureCount)
        {
            message = Nitro.instance.localization.getValueWithParameters('group.kickconfirm.desc', ['user', 'amount'], ['<b>' + userId + '</b>', '<b>' + furnitureCount + '</b>']);
        }
        else
        {
            message = Nitro.instance.localization.getValueWithParameter('group.kickconfirm_nofurni.desc', 'user', '<b>' + userId + '</b>');
        }
        
        const choices = [
            new NotificationChoice('group.kickconfirm.title', () => {
                Nitro.instance.communication.connection.send(new GroupRemoveMemberComposer(this.groupId, Nitro.instance.sessionDataManager.userId));
            }, ['btn-danger']),
            new NotificationChoice('generic.close', () => {}, ['btn-primary'])
        ];

        return [title, message, choices];
    }

    public get visible(): boolean
    {
        return (this._groupId > 0);
    }

    public get groupId(): number
    {
        return this._groupId;
    }

    public set groupId(id: number)
    {
        this._groupId = id;
    }

    public get groupName(): string
    {
        return this._groupName;
    }

    public set groupName(name: string)
    {
        this._groupName = name;
    }

    public get groupBadgeCode(): string
    {
        return this._groupBadgeCode;
    }

    public set groupBadgeCode(badgeCode: string)
    {
        this._groupBadgeCode = badgeCode;
    }

    public get totalMembersCount(): number
    {
        return this._totalMembersCount;
    }

    public set totalMembersCount(totalMembersCount: number)
    {
        this._totalMembersCount = totalMembersCount;
    }

    public get result(): GroupMemberParser[]
    {
        return this._result;
    }

    public set result(result: GroupMemberParser[])
    {
        this._result = result;
    }

    public get admin(): boolean
    {
        return this._admin;
    }

    public set admin(admin: boolean)
    {
        this._admin = admin;
    }

    public get pageSize(): number
    {
        return this._pageSize;
    }

    public set pageSize(pageSize: number)
    {
        this._pageSize = pageSize;
    }

    public get pageIndex(): number
    {
        return this._pageIndex;
    }

    public set pageIndex(pageIndex: number)
    {
        this._pageIndex = pageIndex;
    }

    public get level(): number
    {
        return this._level;
    }

    public set level(level: number)
    {
        this._level = level;
    }

    public get totalPages(): number
    {
        return Math.ceil(this._totalMembersCount / this._pageSize);
    }
}