import { Component, Input, NgZone } from '@angular/core';
import { NavigatorSearchResultRoom } from '../../../../../../client/nitro/communication/messages/parser/navigator/utils/NavigatorSearchResultRoom';
import { RoomDataParser } from '../../../../../../client/nitro/communication/messages/parser/room/data/RoomDataParser';
import { NavigatorService } from '../../../service';

@Component({
    selector: '[nitro-navigator-search-result-item-component]',
    template: `
    <div class="row my-1 p-1 align-items-center bg-lighter search-result-item" (click)="visit()">
        <div class="d-inline-flex align-items-center flex-grow-1">
            <div class="badge badge-secondary mr-3"><i class="fas fa-user mr-1"></i>{{ room.userCount }}</div>
            {{ room.roomName }}
        </div>
        <ng-template #roomInfoTooltip>
            <div class="container">
                <div class="row">
                    <div class="col-2">
                        pic
                    </div>
                    <div class="col-10">
                        <span>{{ room.roomName }}</span>
                        <span>{{ room.description }}</span>
                    </div>
                </div>
                <div class="row">
                    <i class="fas fa-user mr-1"></i>{{ room.ownerName }}
                </div>
            </div>
        </ng-template>
        <div class="d-inline-flex align-items-center">
            <i class="fas fa-users mr-2" *ngIf="isGroup"></i>
            <i class="fas fa-lock mr-2" *ngIf="isDoorbell"></i>
            <i class="fas fa-key mr-2" *ngIf="isPassword"></i>
            <button type="button" class="btn btn-sm btn-primary" [ngbTooltip]="roomInfoTooltip" tooltipClass="search-result-item-tooltip" placement="right" container="body"><i class="fas fa-info-circle"></i></button>
        </div>
    </div>`
})
export class NavigatorSearchResultItemComponent
{
    @Input()
    public room: NavigatorSearchResultRoom;

    @Input()
    public displayMode: number;

    constructor(
        private _navigatorService: NavigatorService,
        private _ngZone: NgZone) {}

    public visit(): void
    {
        this._navigatorService.goToRoom(this.room.roomId);
    }



    public get isGroup(): boolean
    {
        return (this.room && (this.room.habboGroupId > -1));
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