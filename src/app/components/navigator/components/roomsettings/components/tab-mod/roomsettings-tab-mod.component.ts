import { Component, EventEmitter, Input, Output } from '@angular/core';
import RoomSettings from '../../common/RoomSettings';

@Component({
    selector: 'nitro-navigator-roomsettings-tab-mod-component',
    templateUrl: './roomsettings-tab-mod.template.html'
})
export class NavigatorRoomSettingsTabModComponent
{
    @Input()
    public roomSettings: RoomSettings;

    @Output()
    public onSave: EventEmitter<any> = new EventEmitter();

    @Output()
    public onUnban: EventEmitter<any> = new EventEmitter();

    @Output()
    public onOpenProfile: EventEmitter<any> = new EventEmitter();

    constructor()
    {}

    public save(): void
    {
        this.onSave.emit(this.roomSettings);
    }

    public unban(): void
    {
        this.onUnban.emit();
    }

    public openProfile(userId: number): void
    {
        this.onOpenProfile.emit(userId);
    }
}
