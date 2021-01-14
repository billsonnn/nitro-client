import { Component, Input, NgZone } from '@angular/core';
import { RoomDataParser } from '../../../../../client/nitro/communication/messages/parser/room/data/RoomDataParser';
import { Nitro } from '../../../../../client/nitro/Nitro';
import { NavigatorService } from '../../services/navigator.service';

@Component({
    selector: '[nitro-navigator-search-result-item-component]',
    templateUrl: './searchitem.template.html'
})
export class NavigatorSearchItemComponent
{
    @Input()
    public room: RoomDataParser;

    @Input()
    public displayMode: number;

    constructor(
        private _navigatorService: NavigatorService,
        private _ngZone: NgZone) 
    {}

    public visit(): void
    {
        if(this.room.ownerId !== Nitro.instance.sessionDataManager.userId)
        {
            if(this.room.habboGroupId !== 0)
            {
                this._navigatorService.goToPrivateRoom(this.room.roomId);

                return;
            }

            switch(this.room.doorMode)
            {
                case RoomDataParser.DOORBELL_STATE:
                    this._navigatorService.openRoomDoorbell(this.room);
                    return;
                case RoomDataParser.PASSWORD_STATE:
                    this._navigatorService.openRoomPassword(this.room);
                    return;
            }
        }

        this._navigatorService.goToRoom(this.room.roomId);
    }

    public get isGroup(): boolean
    {
        return (this.room && (this.room.habboGroupId > 0));
    }

    public get isDoorbell(): boolean
    {
        return (this.room && (this.room.doorMode === RoomDataParser.DOORBELL_STATE));
    }

    public get isPassword(): boolean
    {
        return (this.room && (this.room.doorMode === RoomDataParser.PASSWORD_STATE));
    }
}