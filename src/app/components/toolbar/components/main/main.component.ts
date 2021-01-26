import { Component, ElementRef, Input, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DesktopViewComposer } from '../../../../../client/nitro/communication/messages/outgoing/desktop/DesktopViewComposer';
import { ToolbarIconEnum } from '../../../../../client/nitro/enums/ToolbarIconEnum';
import { NitroToolbarAnimateIconEvent } from '../../../../../client/nitro/events/NitroToolbarAnimateIconEvent';
import { NitroToolbarEvent } from '../../../../../client/nitro/events/NitroToolbarEvent';
import { Nitro } from '../../../../../client/nitro/Nitro';
import { Dispose } from '../../../../../client/nitro/window/motion/Dispose';
import { DropBounce } from '../../../../../client/nitro/window/motion/DropBounce';
import { EaseOut } from '../../../../../client/nitro/window/motion/EaseOut';
import { JumpBy } from '../../../../../client/nitro/window/motion/JumpBy';
import { Motions } from '../../../../../client/nitro/window/motion/Motions';
import { Queue } from '../../../../../client/nitro/window/motion/Queue';
import { Wait } from '../../../../../client/nitro/window/motion/Wait';
import { SettingsService } from '../../../../core/settings/service';
import { SessionService } from '../../../../security/services/session.service';
import { AchievementsService } from '../../../achievements/services/AchievementsService';
import { AvatarEditorService } from '../../../avatar-editor/services/avatar-editor.service';
import { FriendListService } from '../../../friendlist/services/friendlist.service';
import { InventoryService } from '../../../inventory/services/inventory.service';
import { NavigatorService } from '../../../navigator/services/navigator.service';

@Component({
    selector: 'nitro-toolbar-component',
    templateUrl: './main.template.html'
})
export class ToolbarMainComponent implements OnInit, OnDestroy
{
    @Input()
    public isInRoom: boolean = false;

    @ViewChild('navigationList')
    public navigationList: ElementRef<HTMLElement>;

    constructor(
        private _avatarEditorService: AvatarEditorService,
        private _inventoryService: InventoryService,
        private _navigatorService: NavigatorService,
        private _friendListService: FriendListService,
        private _achievementService: AchievementsService,
        private sessionService: SessionService,
        private settingsService: SettingsService,
        private ngZone: NgZone) 
    {
        this.onNitroToolbarEvent = this.onNitroToolbarEvent.bind(this);
    }

    public ngOnInit(): void
    {
        this.ngZone.runOutsideAngular(() =>
        {
            Nitro.instance.roomEngine.events.addEventListener(NitroToolbarEvent.TOOLBAR_CLICK, this.onNitroToolbarEvent);
            Nitro.instance.roomEngine.events.addEventListener(NitroToolbarAnimateIconEvent.ANIMATE_ICON, this.onNitroToolbarEvent);
        });
    }

    public ngOnDestroy(): void
    {
        this.ngZone.runOutsideAngular(() =>
        {
            Nitro.instance.roomEngine.events.removeEventListener(NitroToolbarEvent.TOOLBAR_CLICK, this.onNitroToolbarEvent);
            Nitro.instance.roomEngine.events.removeEventListener(NitroToolbarAnimateIconEvent.ANIMATE_ICON, this.onNitroToolbarEvent);
        });
    }

    private onNitroToolbarEvent(event: NitroToolbarEvent): void
    {
        if(!event) return;

        switch(event.type)
        {
            case NitroToolbarEvent.TOOLBAR_CLICK:
                this.clickIcon(event.iconName);
                return;
            case NitroToolbarAnimateIconEvent.ANIMATE_ICON: {
                const iconEvent = (event as NitroToolbarAnimateIconEvent);

                this.animateToIcon(iconEvent.iconName, iconEvent.image, iconEvent.x, iconEvent.y);
                return;
            }
        }
    }

    public clickIcon(name: string): void
    {
        if(!name || (name === '')) return;

        switch(name)
        {
            case ToolbarIconEnum.HOTEL_VIEW:
                this.visitDesktop();
                return;
            case ToolbarIconEnum.HOME_ROOM:
                this.visitHomeRoom();
                return;
            case ToolbarIconEnum.NAVIGATOR:
                this.toggleNavigator();
                return;
            case ToolbarIconEnum.CATALOG:
                this.toggleCatalog();
                return;
            case ToolbarIconEnum.INVENTORY:
                this.toggleInventory();
                return;
            case ToolbarIconEnum.FRIEND_LIST:
                this.toggleFriendList();
                return;
            case ToolbarIconEnum.ME_MENU:
                this.toggleAvatarEditor();
                
                Nitro.instance.roomEngine.events.dispatchEvent(new NitroToolbarEvent(NitroToolbarEvent.SELECT_OWN_AVATAR));
                return;
        }
    }

    public animateToIcon(iconName: string, image: HTMLImageElement, x: number, y: number): void
    {
        if(!iconName || !image || !this.navigationListElement) return;

        iconName  = this.getIconName(iconName);

        if(iconName === '') return;
        
        const target = (this.navigationListElement.getElementsByClassName(iconName)[0] as HTMLElement);

        if(target)
        {
            image.className         = 'toolbar-icon-animation';
            image.style.visibility  = 'visible';
            image.style.left        = (x + 'px');
            image.style.top         = (y + 'px');

            document.body.append(image);

            const targetBounds  = target.getBoundingClientRect();
            const imageBounds   = image.getBoundingClientRect();

            const left    = (imageBounds.x - targetBounds.x);
            const top     = (imageBounds.y - targetBounds.y);
            const squared = Math.sqrt(((left * left) + (top * top)));
            const wait    = (500 - Math.abs(((((1 / squared) * 100) * 500) * 0.5)));
            const height  = 20;

            const motionName = (`ToolbarBouncing[${ iconName }]`);

            if(!Motions._Str_19320(motionName))
            {
                Motions._Str_4598(new Queue(new Wait((wait + 8)), new DropBounce(target, 400, 12))).tag = motionName;
            }

            const _local_19 = new Queue(new EaseOut(new JumpBy(image, wait, ((targetBounds.x - imageBounds.x) + height), (targetBounds.y - imageBounds.y), 100, 1), 1), new Dispose(image));
            
            Motions._Str_4598(_local_19);
        }
    }

    public getIconName(icon: string): string
    {
        switch(icon)
        {
            case ToolbarIconEnum.HOTEL_VIEW:
                return 'icon-hotelview';
            case ToolbarIconEnum.NAVIGATOR:
                return 'icon-navigator';
            case ToolbarIconEnum.CATALOG:
                return 'icon-catalog';
            case ToolbarIconEnum.INVENTORY:
                return 'icon-inventory';
            default:
                return '';
        }
    }

    public toggleCatalog(): void
    {
        this.settingsService.toggleCatalog();
    }

    public toggleInventory(): void
    {
        this.settingsService.toggleInventory();
    }

    public toggleFriendList(): void
    {
        this.settingsService.toggleFriendList();
    }

    public toggleNavigator(): void
    {
        this.settingsService.toggleNavigator();
    }

    public toggleAvatarEditor(): void
    {
        this._avatarEditorService.loadOwnAvatarInEditor();
        this.settingsService.toggleAvatarEditor();
    }

    public visitDesktop(): void
    {
        if(Nitro.instance.roomSessionManager.getSession(-1))
        {
            Nitro.instance.communication.connection.send(new DesktopViewComposer());

            Nitro.instance.roomSessionManager.removeSession(-1);
        }
    }

    public visitHomeRoom(): void
    {
        this._navigatorService.goToHomeRoom();
    }

    public get figure(): string
    {
        return this.sessionService.figure;
    }

    public get navigationListElement(): HTMLElement
    {
        return ((this.navigationList && this.navigationList.nativeElement) || null);
    }

    public get unseenInventoryCount(): number
    {
        return this._inventoryService.unseenCount;
    }

    public get unseenFriendListCount(): number
    {
        return this._friendListService.notificationCount;
    }

    public get unseenAchievementsCount(): number
    {
        return this._achievementService.unseen;
    }
}