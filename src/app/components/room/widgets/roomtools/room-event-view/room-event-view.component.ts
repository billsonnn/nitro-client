import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConversionTrackingWidget } from '../../../../../../client/nitro/ui/widget/ConversionTrackingWidget';
import { RoomDataParser } from '../../../../../../client/nitro/communication/messages/parser/room/data/RoomDataParser';
import { NavigatorDataService } from '../../../../navigator/services/navigator-data.service';
import { SecurityLevel } from '../../../../../../client/nitro/session/enum/SecurityLevel';
import { Nitro } from '../../../../../../client/nitro/Nitro';
import { RoomControllerLevel } from '../../../../../../client/nitro/session/enum/RoomControllerLevel';
import {RoomSettingsComposer} from "../../../../../../client/nitro/communication/messages/outgoing/room/settings/RoomSettingsComposer";

@Component({
    selector: 'nitro-room-event-view-component',
    templateUrl: './room-event-view.template.html'
})
export class RoomEventViewComponent extends ConversionTrackingWidget
{
    @Input()
    roomData: RoomDataParser;
    // _enteredGuestRoom

    @Input()
    @Output()
    isVisible: boolean;

    @Output()
    roomEventViewClosed: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(
        private _navigatorDataService: NavigatorDataService
    )
    {
        super();
    }

    public get roomSettingsVisible(): boolean
    {
        if(!this.roomData) return false;

        return this._navigatorDataService.currentRoomOwner || Nitro.instance.sessionDataManager.securityLevel >= SecurityLevel.MODERATOR;
    }

    public get roomFilterVisible(): boolean
    {
        if(!this.roomData) return false;

        return this._navigatorDataService.currentRoomOwner || Nitro.instance.sessionDataManager.securityLevel >= SecurityLevel.MODERATOR;
    }

    public get floorPlanVisible(): boolean
    {
        if(!this.roomData) return false;

        return Nitro.instance.roomSessionManager.getSession(this.roomData.roomId).controllerLevel >= RoomControllerLevel.GUEST;
    }

    public get addStaffPickedVisible(): boolean
    {
        if(!this.roomData) return false;

        return Nitro.instance.sessionDataManager.securityLevel >= SecurityLevel.COMMUNITY;
    }

    public get hoomRegionVisible(): boolean
    {
        if(!this.roomData) return false;

        return this.roomData.showOwner;
    }

    public handleButtonClick(button: string): void
    {
        switch(button)
        {
            case 'room_report_button':
                this.reportRoom();
                break;

            case 'room_settings_button':
                this.openRoomSettings();
                break;

        }
    }

    private makeFavorite(): void
    {
        //_Str_16071
    }

    private favoriteRegion(): void
    {
        //        _Str_16307
    }

    private openRoomSettings(): void
    {
        Nitro.instance.communication.connection.send(new RoomSettingsComposer(this.roomData.roomId));
    }

    private openRoomFilter(): void
    {
        //_Str_22339
    }

    private muteAll(): void
    {
        // _Str_25149
    }

    private makeHomeRoom(): void
    {
        //_Str_25302
    }

    private emdedSrc(): void
    {
        //_Str_23461
    }

    private staffPick(): void
    {
        // _Str_22695
    }

    private reportRoom(): void
    {
        // _Str_24254
    }


    public close()
    {
        this.roomEventViewClosed.emit(true);
    }
}
