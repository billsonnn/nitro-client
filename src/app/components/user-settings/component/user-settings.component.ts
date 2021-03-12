import { Component, Input, NgZone, OnChanges, SimpleChanges } from '@angular/core';
import { SettingsService } from '../../../core/settings/service';
import { UserSettingsService } from '../services/user-settings.service';

@Component({
    selector: 'nitro-user-settings-component',
    templateUrl: './user-settings.template.html'
})
export class UserSettingsComponent implements OnChanges
{
    @Input()
    public visible: boolean = false;

    public volumeSystem: number = 0;
    public volumeFurni: number = 0;
    public volumeTrax: number = 0;

    constructor(
        private _ngZone: NgZone,
        private _userSettingsService: UserSettingsService,
        private _settingsService: SettingsService)
    {}

    public ngOnChanges(changes: SimpleChanges): void
    {
        const prev = (changes.visible.previousValue || false);
        const next = changes.visible.currentValue;

        if(next && (next !== prev)) this._getSound();
    }

    private _getSound(): void
    {
        this._ngZone.run(() =>
        {
            this.volumeSystem = this._userSettingsService.volumeSystem * 100;
            this.volumeFurni = this._userSettingsService.volumeFurni * 100;
            this.volumeTrax = this._userSettingsService.volumeTrax * 100;
        });
    }

    public hide(): void
    {
        this._settingsService.hideUserSettings();
    }

    public saveSound(): void
    {
        this._userSettingsService.volumeSystem = this.volumeSystem / 100;
        this._userSettingsService.volumeFurni = this.volumeFurni / 100;
        this._userSettingsService.volumeTrax = this.volumeTrax / 100;
        this._userSettingsService.sendSound();
    }

    public get oldChat(): boolean
    {
        return this._userSettingsService.oldChat;
    }

    public set oldChat(value: boolean)
    {
        this._userSettingsService.oldChat = value;
    }

    public get roomInvites(): boolean
    {
        return this._userSettingsService.roomInvites;
    }

    public set roomInvites(value: boolean)
    {
        this._userSettingsService.roomInvites = value;
    }

    public get cameraFollow(): boolean
    {
        return this._userSettingsService.cameraFollow;
    }

    public set cameraFollow(value: boolean)
    {
        this._userSettingsService.cameraFollow = value;
    }
}
