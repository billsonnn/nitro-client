import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { IMessageEvent } from '../../../../client/core/communication/messages/IMessageEvent';
import { UserSettingsEvent } from '../../../../client/nitro/communication/messages/incoming/user/data/UserSettingsEvent';
import { UserSettingsCameraFollowComposer } from '../../../../client/nitro/communication/messages/outgoing/user/settings/UserSettingsCameraFollowComposer';
import { UserSettingsOldChatComposer } from '../../../../client/nitro/communication/messages/outgoing/user/settings/UserSettingsOldChatComposer';
import { UserSettingsRoomInvitesComposer } from '../../../../client/nitro/communication/messages/outgoing/user/settings/UserSettingsRoomInvitesComposer';
import { UserSettingsSoundComposer } from '../../../../client/nitro/communication/messages/outgoing/user/settings/UserSettingsSoundComposer';
import { Nitro } from '../../../../client/nitro/Nitro';

@Injectable()
export class UserSettingsService implements OnDestroy
{
    private _messages: IMessageEvent[];

    private _volumeSystem: number;
    private _volumeFurni: number;
    private _volumeTrax: number;

    private _oldChat: boolean;
    private _roomInvites: boolean;
    private _cameraFollow: boolean;
    private _flags: number;
    private _chatType: number;
    
    constructor(
        private _ngZone: NgZone)
    {
        this._messages      = [];

        this._volumeSystem  = 0.3;
        this._volumeFurni   = 0.3;
        this._volumeTrax    = 0.3;

        this._oldChat       = false;
        this._roomInvites   = false;
        this._cameraFollow  = true;
        this._flags         = 0;
        this._chatType      = 0;

        this.registerMessages();
    }

    public ngOnDestroy(): void
    {
        this.unregisterMessages();
    }

    private registerMessages(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            this.unregisterMessages();

            this._messages = [
                new UserSettingsEvent(this.onUserSettingsEvent.bind(this))
            ];

            for(const message of this._messages) Nitro.instance.communication.registerMessageEvent(message);
        });
    }

    private unregisterMessages(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            if(this._messages && this._messages.length)
            {
                for(const message of this._messages) Nitro.instance.communication.removeMessageEvent(message);

                this._messages = [];
            }
        });
    }

    private onUserSettingsEvent(event: UserSettingsEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._volumeSystem  = parser.volumeSystem / 100;
        this._volumeFurni   = parser.volumeFurni / 100;
        this._volumeTrax    = parser.volumeTrax / 100;

        this._oldChat       = parser.oldChat;
        this._roomInvites   = parser.roomInvites;
        this._cameraFollow  = parser.cameraFollow;
        this._flags         = parser.flags;
        this._chatType      = parser.chatType;

        this._updateSessionDataManager();
    }

    private _updateSessionDataManager(): void
    {
        Nitro.instance.sessionDataManager.updateSettings(this._cameraFollow, this._chatType, this._flags);
    }

    public sendSound(): void
    {
        Nitro.instance.communication.connection.send(new UserSettingsSoundComposer(Math.round(this._volumeSystem * 100), Math.round(this._volumeFurni * 100), Math.round(this._volumeTrax * 100)));
    }

    private _sendOldChat(): void
    {
        Nitro.instance.communication.connection.send(new UserSettingsOldChatComposer(this._oldChat));
    }

    private _sendRoomInvites(): void
    {
        Nitro.instance.communication.connection.send(new UserSettingsRoomInvitesComposer(this._roomInvites));
    }

    private _sendCameraFollow(): void
    {
        Nitro.instance.communication.connection.send(new UserSettingsCameraFollowComposer(this._cameraFollow));
    }

    public get volumeSystem(): number
    {
        return this._volumeSystem;
    }

    public set volumeSystem(volume: number)
    {
        if(volume > 1) volume = 1;

        if(volume < 0) volume = 0;
        
        this._volumeSystem = volume;
    }

    public get volumeFurni(): number
    {
        return this._volumeFurni;
    }

    public set volumeFurni(volume: number)
    {
        if(volume > 1) volume = 1;

        if(volume < 0) volume = 0;
        
        this._volumeFurni = volume;
    }

    public get volumeTrax(): number
    {
        return this._volumeTrax;
    }

    public set volumeTrax(volume: number)
    {
        if(volume > 1) volume = 1;

        if(volume < 0) volume = 0;
        
        this._volumeTrax = volume;
    }

    public get oldChat(): boolean
    {
        return this._oldChat;
    }

    public set oldChat(value: boolean)
    {
        this._oldChat = value;
        this._sendOldChat();
    }

    public get roomInvites(): boolean
    {
        return this._roomInvites;
    }

    public set roomInvites(value: boolean)
    {
        this._roomInvites = value;
        this._sendRoomInvites();
    }

    public get cameraFollow(): boolean
    {
        return this._cameraFollow;
    }

    public set cameraFollow(value: boolean)
    {
        this._cameraFollow = value;
        this._sendCameraFollow();
        this._updateSessionDataManager();
    }

    public get flags(): number
    {
        return this._flags;
    }

    public set flags(value: number)
    {
        this._flags = value;
        this._updateSessionDataManager();
    }

    public get chatType(): number
    {
        return this._chatType;
    }

    public set chatType(value: number)
    {
        this._chatType = value;
        this._updateSessionDataManager();
    }
}
