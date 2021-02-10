import { Component } from '@angular/core';
import { RoomSettingsComposer } from '../../../../../client/nitro/communication/messages/outgoing/room/data/RoomSettingsComposer';
import { RoomDataParser } from '../../../../../client/nitro/communication/messages/parser/room/data/RoomDataParser';
import { Nitro } from '../../../../../client/nitro/Nitro';
import { RoomControllerLevel } from '../../../../../client/nitro/session/enum/RoomControllerLevel';
import { SecurityLevel } from '../../../../../client/nitro/session/enum/SecurityLevel';
import { NavigatorData } from '../../common/NavigatorData';
import { NavigatorService } from '../../services/navigator.service';

@Component({
    selector: 'nitro-navigator-room-info-component',
    templateUrl: './room-info.template.html'
})
export class NavigatorRoomInfoComponent
{
    constructor(private _navigatorService: NavigatorService)
    {}

    public hide(): void
    {
        this._navigatorService.roomInfoShowing = false;
    }

    public handleButton(type: string): void
    {
        if(!type) return;

        switch(type)
        {
            case 'settings':
                this.openRoomSettings();
                return;
            case 'filter':
                return;
            case 'floor-plan':
                return;
            case 'staff-pick':
                return;
            case 'staff-unpick':
                return;
            case 'report':
                return;
        }
    }

    private openRoomSettings(): void
    {
        Nitro.instance.communication.connection.send(new RoomSettingsComposer(this.roomData.roomId));
    }

    public get data(): NavigatorData
    {
        return this._navigatorService.data;
    }

    public get roomData(): RoomDataParser
    {
        return ((this.data && this.data.enteredGuestRoom) || null);
    }

    public get roomName(): string
    {
        return ((this.roomData && this.roomData.roomName) || '');
    }

    public get ownerName(): string
    {
        return ((this.roomData && this.roomData.ownerName) || '');
    }

    public get showOwner(): boolean
    {
        return (this.roomData && this.roomData.showOwner);
    }

    public get ranking(): number
    {
        return ((this.roomData && this.roomData.ranking) || 0);
    }

    public get roomSettingsVisible(): boolean
    {
        if(!this.roomData) return false;

        return (this.data.currentRoomOwner || (Nitro.instance.sessionDataManager.securityLevel >= SecurityLevel.MODERATOR));
    }

    public get roomFilterVisible(): boolean
    {
        if(!this.roomData) return false;

        return (this.data.currentRoomOwner || (Nitro.instance.sessionDataManager.securityLevel >= SecurityLevel.MODERATOR));
    }

    public get floorPlanVisible(): boolean
    {
        if(!this.roomData) return false;

        return (Nitro.instance.roomSessionManager.getSession(this.roomData.roomId).controllerLevel >= RoomControllerLevel.GUEST);
    }

    public get addStaffPickedVisible(): boolean
    {
        if(!this.roomData) return false;

        return (Nitro.instance.sessionDataManager.securityLevel >= SecurityLevel.COMMUNITY);
    }

    public get hoomRegionVisible(): boolean
    {
        if(!this.roomData) return false;

        return this.roomData.showOwner;
    }
}