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

    public get thumbnail(): string
    { 
        if (!this.room) return;
        
        let thumbnailUrl: string = Nitro.instance.core.configuration.getValue("thumbnails.url");

        thumbnailUrl = thumbnailUrl.replace('%thumbnail%', this.room.roomId.toString());

        return thumbnailUrl;
    }

    public get entryBg(): String 
    {
        var bg: String = 'badge-secondary';

        var num: Number = (100 * (this.room.userCount / this.room.maxUserCount));

        if (num >= 92) {
            bg = 'badge-danger'
        } else if (num >= 50) {
            bg = 'badge-warning text-white'
        }
        else if (num > 0) {
            bg = 'badge-success'
        }
        
        return bg;
    }
}