import { Component } from '@angular/core';
import { RoomStaffPickComposer } from '@nitrots/nitro-renderer/src/nitro/communication/messages/outgoing/room/action/RoomStaffPickComposer';
import { RoomSettingsComposer } from '@nitrots/nitro-renderer/src/nitro/communication/messages/outgoing/room/data/RoomSettingsComposer';
import { RoomMuteComposer } from '@nitrots/nitro-renderer/src/nitro/communication/messages/outgoing/roomevents/RoomMuteComposer';
import { RoomDataParser } from '@nitrots/nitro-renderer/src/nitro/communication/messages/parser/room/data/RoomDataParser';
import { Nitro } from '@nitrots/nitro-renderer/src/nitro/Nitro';
import { RoomControllerLevel } from '@nitrots/nitro-renderer/src/nitro/session/enum/RoomControllerLevel';
import { SecurityLevel } from '@nitrots/nitro-renderer/src/nitro/session/enum/SecurityLevel';
import { SettingsService } from '../../../../core/settings/service';
import { NavigatorData } from '../../common/NavigatorData';
import { NavigatorService } from '../../services/navigator.service';

@Component({
    selector: 'nitro-navigator-room-info-component',
    templateUrl: './room-info.template.html'
})
export class NavigatorRoomInfoComponent
{
    constructor(private _navigatorService: NavigatorService,
        private _settingsService: SettingsService)
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
                this._settingsService.floorPlanVisible = true;
                return;
            case 'staff-pick':
                this.staffPick();
                return;
            case 'room-mute':
                this.muteRoom();
                break;
            case 'report':
                return;
        }
    }

    private openRoomSettings(): void
    {
        Nitro.instance.communication.connection.send(new RoomSettingsComposer(this.roomData.roomId));
    }

    private staffPick(): void
    {
        if(!this.roomData) return;

        this.roomData.roomPicker = !this.roomData.roomPicker;

        Nitro.instance.communication.connection.send(new RoomStaffPickComposer(this.roomData.roomId));
    }

    private muteRoom(): void
    {
        if(!this.roomData) return;

        this.roomData.allInRoomMuted = !this.roomData.allInRoomMuted;

        Nitro.instance.communication.connection.send(new RoomMuteComposer());
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

        const session = Nitro.instance.roomSessionManager.getSession(this.roomData.roomId);

        if(!session) return false;

        return session.controllerLevel >= RoomControllerLevel.ROOM_OWNER;
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

    public get staffPickVisible(): boolean
    {
        if(!this.roomData) return false;

        return this.roomData.roomPicker;
    }

    public get canMuteVisible(): boolean
    {
        if(!this.roomData) return false;

        return this.roomData.canMute;
    }

    public get mutedVisible(): boolean
    {
        if(!this.roomData) return false;

        return this.roomData.allInRoomMuted;
    }
}
