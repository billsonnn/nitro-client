import { Component, EventEmitter, Input, Output } from '@angular/core';
import RoomSettings from '../../common/RoomSettings';

@Component({
    selector: 'nitro-navigator-roomsettings-tab-rights-component',
    templateUrl: './roomsettings-tab-rights.template.html'
})
export class NavigatorRoomSettingsTabRightsComponent
{
    @Input()
    public roomSettings: RoomSettings;

    @Output()
    public onSave: EventEmitter<any> = new EventEmitter();

    @Output()
    public onGiveRights: EventEmitter<any> = new EventEmitter();

    @Output()
    public onTakeRights: EventEmitter<any> = new EventEmitter();

    @Output()
    public onOpenProfile: EventEmitter<any> = new EventEmitter();

    constructor()
    {}

    public save(): void
    {
        this.onSave.emit(this.roomSettings);
    }

    public giveRights(userId: number): void
    {
        this.onGiveRights.emit(userId);
    }

    public takeRights(userId: number): void
    {
        this.onTakeRights.emit(userId);
    }

    public openProfile(userId: number): void
    {
        this.onOpenProfile.emit(userId);
    }
}
