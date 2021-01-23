import { Component, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output } from '@angular/core';
import { ModTool } from '../tool.component';
import { Nitro } from '../../../../../client/nitro/Nitro';
import { UserFigureComposer } from '../../../../../client/nitro/communication/messages/outgoing/user/data/UserFigureComposer';
import { ModtoolRequestRoomInfoComposer } from '../../../../../client/nitro/communication/messages/outgoing/modtool/ModtoolRequestRoomInfoComposer';
import { RoomSessionEvent } from '../../../../../client/nitro/session/events/RoomSessionEvent';
import { NavigatorHomeRoomEvent } from '../../../../../client/nitro/communication/messages/incoming/navigator/NavigatorHomeRoomEvent';
import { ModtoolRoomInfoEvent } from '../../../../../client/nitro/communication/messages/incoming/modtool/ModtoolRoomInfoEvent';
import { UserInfoEvent } from '../../../../../client/nitro/communication/messages/incoming/user/data/UserInfoEvent';
import { NavigatorCategoriesComposer } from '../../../../../client/nitro/communication/messages/outgoing/navigator/NavigatorCategoriesComposer';
import { NavigatorSettingsComposer } from '../../../../../client/nitro/communication/messages/outgoing/navigator/NavigatorSettingsComposer';
import { ModToolService } from '../../services/mod-tool.service';

@Component({
    selector: 'nitro-mod-tool-room-component',
    templateUrl: './room-tool.template.html'
})
export class ModToolRoomComponent extends ModTool implements OnInit, OnDestroy
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

    public get inRoom(): boolean
	{
		return this._modToolService.isInRoom;
	}

	public get roomId(): number
	{
		return this._modToolService.roomId;
	}

    public get roomName(): string
    {
        return this._modToolService.roomName;
    }

    public get roomOwnerName(): string
    {
        return this._modToolService.roomOwnerName;
    }

}
