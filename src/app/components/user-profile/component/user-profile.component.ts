import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserProfileComposer } from '@nitrots/nitro-renderer/src/nitro/communication/messages/outgoing/user/data/UserProfileComposer';
import { GroupInformationParser } from '@nitrots/nitro-renderer/src/nitro/communication/messages/parser/group/GroupInformationParser';
import { UserProfileParser } from '@nitrots/nitro-renderer/src/nitro/communication/messages/parser/user/data/UserProfileParser';
import { UserRelationshipDataParser } from '@nitrots/nitro-renderer/src/nitro/communication/messages/parser/user/data/UserRelationshipDataParser';
import { Nitro } from '@nitrots/nitro-renderer/src/nitro/Nitro';
import { SettingsService } from '../../../core/settings/service';
import { SessionService } from '../../../security/services/session.service';
import { UserProfileService } from '../services/user-profile.service';

@Component({
    selector: 'nitro-user-profile-component',
    templateUrl: './user-profile.template.html'
})
export class UserProfileComponent implements OnInit, OnDestroy
{
    private _currentRandomHeartRelationship: UserRelationshipDataParser = null;
    private _currentRandomSmileRelationship: UserRelationshipDataParser = null;
    private _currentRandomBobbaRelationship: UserRelationshipDataParser = null;
    private _tabId: number                                              = 0;

    constructor(
        private _userProfileService: UserProfileService,
        private _sessionService: SessionService,
        private _settingsService: SettingsService)
    {}

    public ngOnInit(): void
    {
        this._userProfileService.component = this;
    }

    public ngOnDestroy(): void
    {
        this._userProfileService.component = null;
    }

    public hide(): void
    {
        this._settingsService.hideUserProfile();
    }

    public openRelationshipProfile(relationship: UserRelationshipDataParser): void
    {
        if(!relationship) return;

        Nitro.instance.communication.connection.send(new UserProfileComposer(relationship.userId));
    }

    public getRandomRelationships(): void
    {
        this._currentRandomHeartRelationship = this.heartRelationships[Math.floor(Math.random() * this.heartRelationships.length)];
        this._currentRandomSmileRelationship = this.smileRelationships[Math.floor(Math.random() * this.smileRelationships.length)];
        this._currentRandomBobbaRelationship = this.bobbaRelationships[Math.floor(Math.random() * this.bobbaRelationships.length)];
    }

    public selectGroup(groupId: number): void
    {
        this._userProfileService.selectGroup(groupId);
    }

    public selectTab(tab: number):void
    {
        this._tabId = tab;
    }

    public get visible(): boolean
    {
        return this._settingsService.userProfileVisible;
    }

    public get userProfile(): UserProfileParser
    {
        return this._userProfileService.userLoadedProfile;
    }

    public get userBadges(): string[]
    {
        return this._userProfileService.userBadges;
    }

    public get isMe(): boolean
    {
        if(this.userProfile)
            return this._sessionService.userId === this.userProfile.id;

        return false;
    }

    public get isFriend(): boolean
    {
        if(this.userProfile)
            return this.userProfile.isMyFriend;

        return false;
    }

    public get heartRelationships(): UserRelationshipDataParser[]
    {
        return this._userProfileService.heartRelationships;
    }

    public get currentRandomHeartRelationship(): UserRelationshipDataParser
    {
        return this._currentRandomHeartRelationship;
    }

    public get smileRelationships(): UserRelationshipDataParser[]
    {
        return this._userProfileService.smileRelationships;
    }

    public get currentRandomSmileRelationship(): UserRelationshipDataParser
    {
        return this._currentRandomSmileRelationship;
    }

    public get bobbaRelationships(): UserRelationshipDataParser[]
    {
        return this._userProfileService.bobbaRelationships;
    }

    public get currentRandomBobbaRelationship(): UserRelationshipDataParser
    {
        return this._currentRandomBobbaRelationship;
    }

    public get selectedGroup(): GroupInformationParser
    {
        return this._userProfileService.selectedGroup;
    }

    public get tabId(): number
    {
        return this._tabId;
    }
}
