import { Component, Input, NgZone } from '@angular/core';
import { NavigatorSearchResultRoom } from '../../../../../../client/nitro/communication/messages/parser/navigator/utils/NavigatorSearchResultRoom';
import { Nitro } from '../../../../../../client/nitro/Nitro';

@Component({
    selector: '[nitro-navigator-search-result-item-component]',
    template: `
    <div class="nitro-navigator-search-result-item-component" (click)="visit()">
        <div class="item-info">
            <div class="info-name">{{ room.roomName }}</div>
            <div class="info-right">
                <i class="fas info-icon fa-users group-icon" *ngIf="room.habboGroupId"></i>
                <div class="info-usercount {{ userCountColor }}">
                    <i class="fas info-icon fa-user"></i>{{ room.userCount }}
                </div>
            </div>
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
        private ngZone: NgZone) {}

    public get userCountColor(): string
    {
        const maxUsers      = this.room.maxUserCount;
        const currentUsers  = this.room.userCount;
        const steps         = maxUsers / 4;

        if(currentUsers === maxUsers) return 'dark-red';

        if(currentUsers >= (steps * 3)) return 'red';

        if(currentUsers >= (steps * 2)) return 'yellow';

        if(currentUsers > 0) return 'green';

        return 'gray';
    }

    public visit(): void
    {
        this.ngZone.runOutsideAngular(() => Nitro.instance.navigator.goToRoom(this.room.roomId));
    }
}