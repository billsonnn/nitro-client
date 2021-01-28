import { Component, NgZone, OnDestroy } from '@angular/core';
import { IMessageEvent } from '../../../../../client/core/communication/messages/IMessageEvent';
import { RoomBannedUsersEvent } from '../../../../../client/nitro/communication/messages/incoming/room/data/RoomBannedUsersEvent';
import { RoomSettingsEvent } from '../../../../../client/nitro/communication/messages/incoming/room/data/RoomSettingsEvent';
import { RoomUsersWithRightsEvent } from '../../../../../client/nitro/communication/messages/incoming/room/data/RoomUsersWithRightsEvent';
import { RoomGiveRightsComposer } from '../../../../../client/nitro/communication/messages/outgoing/room/action/RoomGiveRightsComposer';
import { RoomTakeRightsComposer } from '../../../../../client/nitro/communication/messages/outgoing/room/action/RoomTakeRightsComposer';
import { RoomUnbanUserComposer } from '../../../../../client/nitro/communication/messages/outgoing/room/action/RoomUnbanUserComposer';
import { RoomBannedUsersComposer } from '../../../../../client/nitro/communication/messages/outgoing/room/data/RoomBannedUsersComposer';
import { RoomUsersWithRightsComposer } from '../../../../../client/nitro/communication/messages/outgoing/room/data/RoomUsersWithRightsComposer';
import { SaveRoomSettingsComposer } from '../../../../../client/nitro/communication/messages/outgoing/room/data/SaveRoomSettingsComposer';
import { NavigatorCategoryDataParser } from '../../../../../client/nitro/communication/messages/parser/navigator/NavigatorCategoryDataParser';
import { Nitro } from '../../../../../client/nitro/Nitro';
import { MessengerFriend } from '../../../friendlist/common/MessengerFriend';
import { FriendListService } from '../../../friendlist/services/friendlist.service';
import { NavigatorService } from '../../services/navigator.service';


@Component({
    selector: 'nitro-navigator-roomsettings-component',
    templateUrl: './roomsettings.template.html'
})
export class NavigatorRoomSettingsComponent implements OnDestroy
{

    private _currentTab: number = 1;
    private _messages: IMessageEvent[] = [];
    private _maxVisitors: number[] = [];

    public roomName: string;
    public roomDescription: string;
    public categoryId: string;
    public userCount: string;
    public tags: string[];
    public tradeState: string;
    public allowWalkthrough: boolean;

    public lockState: string;
    public password: string;
    public confirmPassword: string;
    public allowPets: boolean;
    public allowPetsEat: boolean;

    private _usersWithRights: Map<number, string>;
    private _friendsWithoutRights: Map<number, string>;

    public hideWalls: boolean;
    public wallThickness: string;
    public floorThickness: string;
    public chatBubbleMode: string;
    public chatBubbleWeight: string;
    public chatBubbleSpeed: string;
    public chatFloodProtection: string;
    public chatDistance: number;

    public muteState: string;
    public kickState: string;
    public banState: string;
    private _bannedUsers: Map<number, string>;
    private _selectedUserToUnban: number;

    private _roomId: number;
    private _oldRoomName: string;
    private _oldLockState: number;
    private _visible: boolean;
    
    constructor(
        private _navigatorService: NavigatorService,
        private _friendListService: FriendListService,
        private _ngZone: NgZone) 
    {
        this.onRoomSettingsEvent         = this.onRoomSettingsEvent.bind(this);
        this.onRoomUsersWithRightsEvent  = this.onRoomUsersWithRightsEvent.bind(this);
        this.onRoomBannedUsersEvent      = this.onRoomBannedUsersEvent.bind(this);

        this.registerMessages();
    }

    private clear(): void
    {
        this._currentTab            = 1;

        this.roomName               = null;
        this.roomDescription        = null;    
        this.categoryId             = '0';
        this.userCount              = '0';
        this.tags                   = [];
        this.tradeState             = '0';
        this.allowWalkthrough       = false;

        this.lockState              = '0';
        this.password               = null;
        this.confirmPassword        = null;
        this.allowPets              = false;
        this.allowPetsEat           = false;

        this._usersWithRights       = new Map<number, string>();
        this._friendsWithoutRights  = new Map<number, string>();
        
        this.hideWalls              = false;
        this.wallThickness          = '0';
        this.floorThickness         = '0';
        this.chatBubbleMode         = '0';
        this.chatBubbleWeight       = '0';
        this.chatBubbleSpeed        = '0';
        this.chatFloodProtection    = '0';
        this.chatDistance           = 0;

        this.muteState              = '0';
        this.kickState              = '0';
        this.banState               = '0';
        this._bannedUsers           = new Map<number, string>();
        this._selectedUserToUnban   = 0;

        this._roomId                = 0;
        this._oldRoomName           = null;
        this._visible               = false;
    }

    public ngOnDestroy(): void
    {
        this.clear();
        this.unregisterMessages();
    }

    private registerMessages(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            this._messages = [
                new RoomSettingsEvent(this.onRoomSettingsEvent),
                new RoomUsersWithRightsEvent(this.onRoomUsersWithRightsEvent),
                new RoomBannedUsersEvent(this.onRoomBannedUsersEvent)
            ];

            for(const message of this._messages) Nitro.instance.communication.registerMessageEvent(message);
        });
    }

    public unregisterMessages(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            for(const message of this._messages) Nitro.instance.communication.removeMessageEvent(message);

            this._messages = [];
        });
    }

    private onRoomSettingsEvent(event: RoomSettingsEvent): void
    {
        if(!(event instanceof RoomSettingsEvent)) return;

        const parser = event.getParser();

        if(!parser) return;

        this.clear();
        
        this._roomId = parser.roomId;

        this._ngZone.run(() => {            
            this.roomName               = parser.name;
            this.roomDescription        = parser.description;
            this.categoryId             = parser.categoryId.toString();
            this.userCount              = parser.userCount.toString();
            this.tradeState             = parser.tradeMode.toString();
            this.allowWalkthrough       = parser.allowWalkthrough;

            this.lockState              = parser.state.toString();
            this.allowPets              = parser.allowPets;
            
            this.hideWalls              = parser.hideWalls;
            this.wallThickness          = parser.thicknessWall.toString();
            this.floorThickness         = parser.thicknessFloor.toString();
            this.chatBubbleMode         = parser.chatSettings.mode.toString();
            this.chatBubbleWeight       = parser.chatSettings.weight.toString();
            this.chatBubbleSpeed        = parser.chatSettings.speed.toString();
            this.chatFloodProtection    = parser.chatSettings.protection.toString();
            this.chatDistance           = parser.chatSettings.distance;

            this.muteState              = parser.moderationSettings.allowMute.toString();
            this.kickState              = parser.moderationSettings.allowKick.toString();
            this.banState               = parser.moderationSettings.allowBan.toString();

            this._maxVisitors           = this._navigatorService.getMaxVisitors(parser.maxUserCount);
            
            this._oldRoomName           = parser.name;
            this._visible               = true;
        });
        
        Nitro.instance.communication.connection.send(new RoomUsersWithRightsComposer(this._roomId));
        Nitro.instance.communication.connection.send(new RoomBannedUsersComposer(this._roomId));
    }

    private onRoomUsersWithRightsEvent(event: RoomUsersWithRightsEvent)
    {
        if(!(event instanceof RoomUsersWithRightsEvent)) return;

        const parser = event.getParser();

        if(!parser) return;

        this._usersWithRights = new Map(parser.users);
        this.getFriendsWithoutRights();
    }

    private onRoomBannedUsersEvent(event: RoomBannedUsersEvent)
    {
        if(!(event instanceof RoomBannedUsersEvent)) return;

        const parser = event.getParser();

        if(!parser) return;

        this._bannedUsers = new Map(parser.users);
    }

    public getFriendsWithoutRights(): void
    {
        this._friendListService.friends.forEach((friend: MessengerFriend, id: number) => {
            if(!this._usersWithRights.has(id))
            {
                this._friendsWithoutRights.set(id, friend.name);
            }
        });
    }

    public changeTab(tab: number): void
    {
        this._currentTab = tab;
    }

    public openProfile(userId: number): void
    {
        //Nitro.instance.communication.connection.send(new UserProfileByIdComposer(userId));
    }

    public giveRights(userId: number): void
    {
        if(!this._friendsWithoutRights.has(userId)) return;

        this._ngZone.run(() => {
            this._usersWithRights.set(userId, this._friendsWithoutRights.get(userId));
            this._friendsWithoutRights.delete(userId);
        });

        Nitro.instance.communication.connection.send(new RoomGiveRightsComposer(userId));
    }

    public takeRights(userId: number): void
    {
        if(!this._usersWithRights.has(userId)) return;

        this._ngZone.run(() => {
            this._friendsWithoutRights.set(userId, this._usersWithRights.get(userId));
            this._usersWithRights.delete(userId);
        });

        Nitro.instance.communication.connection.send(new RoomTakeRightsComposer(userId));
    }

    public unban(): void
    {
        if(this._selectedUserToUnban === 0) return;

        if(!this._bannedUsers.has(this._selectedUserToUnban)) return;

        const userId = this._selectedUserToUnban;

        this._ngZone.run(() => {
            this._bannedUsers.delete(this._selectedUserToUnban);
            this._selectedUserToUnban = 0;
        });

        Nitro.instance.communication.connection.send(new RoomUnbanUserComposer(userId, this._roomId));
    }

    public selectUserToUnban(userId: number): void
    {
        this._ngZone.run(() => {
            if(this._selectedUserToUnban === userId)
            {
                this._selectedUserToUnban = 0;
            }
            else
            {
                this._selectedUserToUnban = userId;
            }
        });
    }

    public hide(): void
    {
        this._visible = false;
        this.clear();
    }

    public save(): void
    {
        if(!this.isValidPassword)
            return;

        if(this.roomName.length < 1)
            this.roomName = this._oldRoomName;

        if(parseInt(this.userCount) < 0)
            this.userCount = '0';

        const event = new SaveRoomSettingsComposer(
            this._roomId,
            this.roomName,
            this.roomDescription,
            parseInt(this.lockState),
            this.password,
            parseInt(this.userCount),
            parseInt(this.categoryId),
            this.tags.length,
            this.tags,
            parseInt(this.tradeState),
            this.allowPets,
            this.allowPetsEat,
            this.allowWalkthrough,
            this.hideWalls,
            parseInt(this.wallThickness),
            parseInt(this.floorThickness),
            parseInt(this.muteState),
            parseInt(this.kickState),
            parseInt(this.banState),
            parseInt(this.chatBubbleMode),
            parseInt(this.chatBubbleWeight),
            parseInt(this.chatBubbleSpeed),
            this.chatDistance,
            parseInt(this.chatFloodProtection)
        );

        Nitro.instance.communication.connection.send(event);
    }

    public get currentTab(): number
    {
        return this._currentTab;
    }

    public get categories(): NavigatorCategoryDataParser[]
    {
        return this._navigatorService.categories;
    }

    public get maxVisitors(): number[]
    {
        return this._maxVisitors;
    }

    public get tradeSettings(): string[]
    {
        return this._navigatorService.tradeSettings;
    }

    public get visible(): boolean
    {
        return this._visible;
    }

    public get isValidPassword(): boolean
    {
        if(this.lockState !== '3')
            return true;

        return this.password && this.password.length > 0 && this.password === this.confirmPassword;
    }

    public get usersWithRights(): Map<number, string>
    {
        return this._usersWithRights;
    }

    public get friendsWithoutRights(): Map<number, string>
    {
        return this._friendsWithoutRights;
    }

    public get bannedUsers(): Map<number, string>
    {
        return this._bannedUsers;
    }

    public get selectedUserToUnban(): number
    {
        return this._selectedUserToUnban;
    }

    public get selectedUsernameToUnban(): string
    {
        if(this._selectedUserToUnban > 0)
            return this._bannedUsers.get(this._selectedUserToUnban);

        return null;
    }
}