import { Component, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output } from '@angular/core';
import { ModTool } from '../tool.component';
import { ModToolService } from '../../services/mod-tool.service';
import { RoomToolRoom } from './room-tool-room';
import { Nitro } from '../../../../../client/nitro/Nitro';
import { ModtoolChangeRoomSettingsComposer } from '../../../../../client/nitro/communication/messages/outgoing/modtool/ModtoolChangeRoomSettingsComposer';

@Component({
    selector: 'nitro-mod-tool-room-component',
    templateUrl: './room-tool.template.html'
})
export class ModToolRoomComponent extends ModTool implements OnInit, OnDestroy
{
    public lockDoor: boolean = false;
    public changeTitle: boolean = false;
    public kickUsers: boolean = false;
    private _housekeepingUrl: string;

    constructor(private _modToolService: ModToolService)
    {
        super();
        this._housekeepingUrl = Nitro.instance.getConfiguration<string>('modtools.housekeeping.url', 'http://localhost');
    }

    public ngOnInit(): void
    {
    }

    public ngOnDestroy(): void
    {
    }

    public saveRoom(): void
    {
        const roomId = Nitro.instance.roomSessionManager.viewerSession.roomId;
        const lockDoor = this.lockDoor ? 1 : 0;
        const changeTitle = this.changeTitle ? 1 : 0;
        const kickUsers = this.kickUsers ? 1 : 0;
        Nitro.instance.communication.connection.send(new ModtoolChangeRoomSettingsComposer(roomId, lockDoor, changeTitle, kickUsers ));
    }

    public get inRoom(): boolean
	{
		return this._modToolService.isInRoom;
	}

	public get room(): RoomToolRoom
	{
		return this._modToolService.room;
	}

	public get housekepingUrl(): string
    {
        return this._housekeepingUrl;
    }
}
