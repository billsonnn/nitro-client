import { Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ModToolService } from '../../services/mod-tool.service';
import { SettingsService } from '../../../../core/settings/service';
import { UserToolUser } from '../user-tool/user-tool-user';
import { RoomToolRoom } from '../room-tool/room-tool-room';
import { Nitro } from '../../../../../client/nitro/Nitro';
import { ModtoolRoomChatlogLine } from '../../../../../client/nitro/communication/messages/parser/modtool/utils/ModtoolRoomChatlogLine';
import { ModtoolRoomChatlogParser } from '../../../../../client/nitro/communication/messages/parser/modtool/ModtoolRoomChatlogParser';
import { ChatlogToolChatlog } from '../chatlog-tool/chatlog-tool-chatlog';
import { ModToolUserInfoService } from '../../services/mod-tool-user-info.service';

@Component({
    selector: 'nitro-mod-tool-main-component',
    templateUrl: './main.template.html'
})
export class ModToolMainComponent implements OnInit, OnDestroy
{
    @Input()
    public visible: boolean = false;

    public roomToolVisible: boolean = false;
    public chatlogToolVisible: boolean = false;
    public userToolVisible: boolean = false;
    public reportsToolVisible: boolean = false;

    public clickedUser: UserToolUser = null;

    constructor(
        private _settingsService: SettingsService,
        private _modToolService: ModToolService,
        private _modToolsUserService: ModToolUserInfoService,
        private _ngZone: NgZone)
    {}

    public ngOnInit(): void
    {
        this._modToolService.component = this;
    }

    public ngOnDestroy(): void
    {
        this._modToolService.component = null;
    }

    public toggleRoomTool(): void
    {
        this.roomToolVisible = !this.roomToolVisible;
    }

    public openRoomTool(): void
    {
        this._modToolService.openRoomTool();
    }

    public openChatlogTool(): void
    {
        this._modToolService.openChatlogTool();
    }

    public selectUser(): void
    {
        this.clickedUser = this.selectedUser;
        this._modToolsUserService.load(this.selectedUser.id);
    }

    public toggleReportsTool(): void
    {
        this.reportsToolVisible = !this.reportsToolVisible;
    }

    public get inRoom(): boolean
    {
        return Nitro.instance.roomSessionManager.viewerSession !== null;
    }

    public get rooms(): RoomToolRoom[]
    {
        return this._modToolService.rooms;
    }

    public get chatlogs(): ChatlogToolChatlog[]
    {
        return this._modToolService.roomChatlogs;
    }

    public get users(): UserToolUser[]
    {
        return this._modToolService.users;
    }

    public get selectedUser(): UserToolUser
    {
        return this._modToolService.selectedUser;
    }
}
