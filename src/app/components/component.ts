import { Component, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Nitro } from '../../client/nitro/Nitro';
import { RoomBackgroundColorEvent } from '../../client/nitro/room/events/RoomBackgroundColorEvent';
import { RoomEngineDimmerStateEvent } from '../../client/nitro/room/events/RoomEngineDimmerStateEvent';
import { RoomEngineEvent } from '../../client/nitro/room/events/RoomEngineEvent';
import { RoomEngineObjectEvent } from '../../client/nitro/room/events/RoomEngineObjectEvent';
import { RoomEngineTriggerWidgetEvent } from '../../client/nitro/room/events/RoomEngineTriggerWidgetEvent';
import { RoomObjectHSLColorEnabledEvent } from '../../client/nitro/room/events/RoomObjectHSLColorEnabledEvent';
import { RoomZoomEvent } from '../../client/nitro/room/events/RoomZoomEvent';
import { RoomSessionChatEvent } from '../../client/nitro/session/events/RoomSessionChatEvent';
import { RoomSessionDanceEvent } from '../../client/nitro/session/events/RoomSessionDanceEvent';
import { RoomSessionEvent } from '../../client/nitro/session/events/RoomSessionEvent';
import { RoomSessionUserBadgesEvent } from '../../client/nitro/session/events/RoomSessionUserBadgesEvent';
import { RoomWidgetEnum } from '../../client/nitro/ui/widget/enums/RoomWidgetEnum';
import { RoomId } from '../../client/room/utils/RoomId';
import { SettingsService } from '../core/settings/service';
import { NotificationService } from './notification/services/notification.service';
import { RoomComponent } from './room/room.component';
import { RoomAvatarInfoComponent } from './room/widgets/avatarinfo/component';
import { RoomChatInputComponent } from './room/widgets/chatinput/component';
import { CustomStackHeightComponent } from './room/widgets/furniture/customstackheight/component';
import { DimmerFurniComponent } from './room/widgets/furniture/dimmer/component';
import { RoomInfoStandMainComponent } from './room/widgets/infostand/components/main/main.component';
import { RoomChatComponent } from './room/widgets/roomchat/component';

@Component({
    selector: 'nitro-main-component',
    template: `
    <div class="nitro-main-component">
        <nitro-notification-main-component></nitro-notification-main-component>
        <div class="nitro-right-side">
            <div class="d-flex flex-column">
                <nitro-purse-main-component></nitro-purse-main-component>
                <nitro-notification-centre-component></nitro-notification-centre-component>
            </div>
        </div>
        <nitro-call-for-help-main-component></nitro-call-for-help-main-component>
        <nitro-pedia-main-component></nitro-pedia-main-component>
        <nitro-avatar-editor-main-component [visible]="avatarEditorVisible"></nitro-avatar-editor-main-component>
        <nitro-hotelview-component *ngIf="landingViewVisible"></nitro-hotelview-component>
		<nitro-mod-tool-main-component [visible]="true"></nitro-mod-tool-main-component>
		<nitro-toolbar-component [isInRoom]="!landingViewVisible"></nitro-toolbar-component>
        <nitro-friendlist-main-component [visible]="friendListVisible"></nitro-friendlist-main-component>
        <nitro-catalog-main-component [visible]="catalogVisible"></nitro-catalog-main-component>
        <nitro-navigator-main-component [visible]="navigatorVisible"></nitro-navigator-main-component>
        <nitro-inventory-main-component [visible]="inventoryVisible"></nitro-inventory-main-component>
        <nitro-wired-main-component></nitro-wired-main-component>
        <nitro-room-component></nitro-room-component>
    </div>`
})
export class MainComponent implements OnInit, OnDestroy 
{
    @ViewChild(RoomComponent)
    public roomComponent: RoomComponent = null;

    private _landingViewVisible: boolean = true;

    constructor(
        private _notificationService: NotificationService,
        private _settingsService: SettingsService,
        private _ngZone: NgZone) 
    { }

    public ngOnInit(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            if(Nitro.instance.roomEngine.events)
            {
                Nitro.instance.roomEngine.events.addEventListener(RoomEngineEvent.INITIALIZED, this.onRoomEngineEvent.bind(this));
                Nitro.instance.roomEngine.events.addEventListener(RoomEngineEvent.DISPOSED, this.onRoomEngineEvent.bind(this));
                Nitro.instance.roomEngine.events.addEventListener(RoomEngineEvent.ENGINE_INITIALIZED, this.onInterstitialEvent.bind(this));
                Nitro.instance.roomEngine.events.addEventListener(RoomEngineEvent.OBJECTS_INITIALIZED, this.onInterstitialEvent.bind(this));
                Nitro.instance.roomEngine.events.addEventListener(RoomEngineEvent.NORMAL_MODE, this.onInterstitialEvent.bind(this));
                Nitro.instance.roomEngine.events.addEventListener(RoomEngineEvent.GAME_MODE, this.onInterstitialEvent.bind(this));
                Nitro.instance.roomEngine.events.addEventListener(RoomZoomEvent.ROOM_ZOOM, this.onRoomEngineEvent.bind(this));
                Nitro.instance.roomEngine.events.addEventListener(RoomObjectHSLColorEnabledEvent.ROOM_BACKGROUND_COLOR, this.onRoomEngineEvent.bind(this));
                Nitro.instance.roomEngine.events.addEventListener(RoomBackgroundColorEvent.ROOM_COLOR, this.onRoomEngineEvent.bind(this));
                Nitro.instance.roomEngine.events.addEventListener(RoomEngineDimmerStateEvent.ROOM_COLOR, this.onRoomEngineEvent.bind(this));

                Nitro.instance.roomEngine.events.addEventListener(RoomEngineObjectEvent.SELECTED, this.onRoomEngineObjectEvent.bind(this));
                Nitro.instance.roomEngine.events.addEventListener(RoomEngineObjectEvent.DESELECTED, this.onRoomEngineObjectEvent.bind(this));
                Nitro.instance.roomEngine.events.addEventListener(RoomEngineObjectEvent.ADDED, this.onRoomEngineObjectEvent.bind(this));
                Nitro.instance.roomEngine.events.addEventListener(RoomEngineObjectEvent.REMOVED, this.onRoomEngineObjectEvent.bind(this));
                Nitro.instance.roomEngine.events.addEventListener(RoomEngineObjectEvent.PLACED, this.onRoomEngineObjectEvent.bind(this));
                Nitro.instance.roomEngine.events.addEventListener(RoomEngineObjectEvent.REQUEST_MOVE, this.onRoomEngineObjectEvent.bind(this));
                Nitro.instance.roomEngine.events.addEventListener(RoomEngineObjectEvent.REQUEST_ROTATE, this.onRoomEngineObjectEvent.bind(this));
                Nitro.instance.roomEngine.events.addEventListener(RoomEngineObjectEvent.MOUSE_ENTER, this.onRoomEngineObjectEvent.bind(this));
                Nitro.instance.roomEngine.events.addEventListener(RoomEngineObjectEvent.MOUSE_LEAVE, this.onRoomEngineObjectEvent.bind(this));
                Nitro.instance.roomEngine.events.addEventListener(RoomEngineTriggerWidgetEvent.OPEN_WIDGET, this.onRoomEngineObjectEvent.bind(this));
                Nitro.instance.roomEngine.events.addEventListener(RoomEngineTriggerWidgetEvent.CLOSE_WIDGET, this.onRoomEngineObjectEvent.bind(this));
                Nitro.instance.roomEngine.events.addEventListener(RoomEngineTriggerWidgetEvent.REQUEST_INTERNAL_LINK, this.onRoomEngineObjectEvent.bind(this));
                Nitro.instance.roomEngine.events.addEventListener(RoomEngineTriggerWidgetEvent.REQUEST_ROOM_LINK, this.onRoomEngineObjectEvent.bind(this));
            }

            if(Nitro.instance.roomSessionManager.events)
            {
                Nitro.instance.roomSessionManager.events.addEventListener(RoomSessionEvent.CREATED, this.onRoomSessionEvent.bind(this));
                Nitro.instance.roomSessionManager.events.addEventListener(RoomSessionEvent.STARTED, this.onRoomSessionEvent.bind(this));
                Nitro.instance.roomSessionManager.events.addEventListener(RoomSessionEvent.ROOM_DATA, this.onRoomSessionEvent.bind(this));
                Nitro.instance.roomSessionManager.events.addEventListener(RoomSessionEvent.ENDED, this.onRoomSessionEvent.bind(this));
                Nitro.instance.roomSessionManager.events.addEventListener(RoomSessionChatEvent.CHAT_EVENT, this.onRoomSessionEvent.bind(this));
                Nitro.instance.roomSessionManager.events.addEventListener(RoomSessionDanceEvent.RSDE_DANCE, this.onRoomSessionEvent.bind(this));
                Nitro.instance.roomSessionManager.events.addEventListener(RoomSessionUserBadgesEvent.RSUBE_BADGES, this.onRoomSessionEvent.bind(this));
            }
        });
    }

    public ngOnDestroy(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            if(Nitro.instance.roomEngine.events)
            {
                Nitro.instance.roomEngine.events.removeEventListener(RoomEngineEvent.INITIALIZED, this.onRoomEngineEvent.bind(this));
                Nitro.instance.roomEngine.events.removeEventListener(RoomEngineEvent.DISPOSED, this.onRoomEngineEvent.bind(this));
                Nitro.instance.roomEngine.events.removeEventListener(RoomZoomEvent.ROOM_ZOOM, this.onRoomEngineEvent.bind(this));
                Nitro.instance.roomEngine.events.removeEventListener(RoomObjectHSLColorEnabledEvent.ROOM_BACKGROUND_COLOR, this.onRoomEngineEvent.bind(this));
                Nitro.instance.roomEngine.events.removeEventListener(RoomBackgroundColorEvent.ROOM_COLOR, this.onRoomEngineEvent.bind(this));
                Nitro.instance.roomEngine.events.removeEventListener(RoomEngineDimmerStateEvent.ROOM_COLOR, this.onRoomEngineEvent.bind(this));

                Nitro.instance.roomEngine.events.removeEventListener(RoomEngineObjectEvent.SELECTED, this.onRoomEngineObjectEvent.bind(this));
                Nitro.instance.roomEngine.events.removeEventListener(RoomEngineObjectEvent.DESELECTED, this.onRoomEngineObjectEvent.bind(this));
                Nitro.instance.roomEngine.events.removeEventListener(RoomEngineObjectEvent.ADDED, this.onRoomEngineObjectEvent.bind(this));
                Nitro.instance.roomEngine.events.removeEventListener(RoomEngineObjectEvent.REMOVED, this.onRoomEngineObjectEvent.bind(this));
                Nitro.instance.roomEngine.events.removeEventListener(RoomEngineObjectEvent.PLACED, this.onRoomEngineObjectEvent.bind(this));
                Nitro.instance.roomEngine.events.removeEventListener(RoomEngineObjectEvent.REQUEST_MOVE, this.onRoomEngineObjectEvent.bind(this));
                Nitro.instance.roomEngine.events.removeEventListener(RoomEngineObjectEvent.REQUEST_ROTATE, this.onRoomEngineObjectEvent.bind(this));
                Nitro.instance.roomEngine.events.removeEventListener(RoomEngineObjectEvent.MOUSE_ENTER, this.onRoomEngineObjectEvent.bind(this));
                Nitro.instance.roomEngine.events.removeEventListener(RoomEngineObjectEvent.MOUSE_LEAVE, this.onRoomEngineObjectEvent.bind(this));
                Nitro.instance.roomEngine.events.removeEventListener(RoomEngineTriggerWidgetEvent.OPEN_WIDGET, this.onRoomEngineObjectEvent.bind(this));
                Nitro.instance.roomEngine.events.removeEventListener(RoomEngineTriggerWidgetEvent.CLOSE_WIDGET, this.onRoomEngineObjectEvent.bind(this));
                Nitro.instance.roomEngine.events.removeEventListener(RoomEngineTriggerWidgetEvent.REQUEST_INTERNAL_LINK, this.onRoomEngineObjectEvent.bind(this));
                Nitro.instance.roomEngine.events.removeEventListener(RoomEngineTriggerWidgetEvent.REQUEST_ROOM_LINK, this.onRoomEngineObjectEvent.bind(this));
            }

            if(Nitro.instance.roomSessionManager.events)
            {
                Nitro.instance.roomSessionManager.events.removeEventListener(RoomSessionEvent.CREATED, this.onRoomSessionEvent.bind(this));
                Nitro.instance.roomSessionManager.events.removeEventListener(RoomSessionEvent.STARTED, this.onRoomSessionEvent.bind(this));
                Nitro.instance.roomSessionManager.events.removeEventListener(RoomSessionEvent.ROOM_DATA, this.onRoomSessionEvent.bind(this));
                Nitro.instance.roomSessionManager.events.removeEventListener(RoomSessionEvent.ENDED, this.onRoomSessionEvent.bind(this));
                Nitro.instance.roomSessionManager.events.removeEventListener(RoomSessionChatEvent.CHAT_EVENT, this.onRoomSessionEvent.bind(this));
                Nitro.instance.roomSessionManager.events.removeEventListener(RoomSessionDanceEvent.RSDE_DANCE, this.onRoomSessionEvent.bind(this));
                Nitro.instance.roomSessionManager.events.removeEventListener(RoomSessionUserBadgesEvent.RSUBE_BADGES, this.onRoomSessionEvent.bind(this));
            }
        });
    }

    private onRoomEngineEvent(event: RoomEngineEvent): void
    {
        if(!event) return;

        if(RoomId.isRoomPreviewerId(event.roomId)) return;

        const session = Nitro.instance.roomSessionManager.getSession(event.roomId);

        if(!session) return;

        switch(event.type)
        {
            case RoomEngineEvent.INITIALIZED:
                if(this.roomComponent)
                {
                    this.roomComponent.prepareRoom(session);

                    Nitro.instance.roomEngine.setActiveRoomId(event.roomId);

                    this.roomComponent.createWidget(RoomWidgetEnum.CHAT_WIDGET, RoomChatComponent);
                    this.roomComponent.createWidget(RoomWidgetEnum.INFOSTAND, RoomInfoStandMainComponent);
                    this.roomComponent.createWidget(RoomWidgetEnum.LOCATION_WIDGET, null);
                    this.roomComponent.createWidget(RoomWidgetEnum.ROOM_DIMMER, null);
                    this.roomComponent.createWidget(RoomWidgetEnum.INTERNAL_LINK, null);
                    this.roomComponent.createWidget(RoomWidgetEnum.ROOM_LINK, null);
                    this.roomComponent.createWidget(RoomWidgetEnum.CUSTOM_STACK_HEIGHT, CustomStackHeightComponent);
                    this.roomComponent.createWidget(RoomWidgetEnum.ROOM_DIMMER, DimmerFurniComponent);

                    if(!this.roomComponent.roomSession.isSpectator)
                    {
                        this.roomComponent.createWidget(RoomWidgetEnum.CHAT_INPUT_WIDGET, RoomChatInputComponent);
                        this.roomComponent.createWidget(RoomWidgetEnum.AVATAR_INFO, RoomAvatarInfoComponent);
                    }
                }
                return;
            case RoomEngineEvent.DISPOSED:
                //if(this.roomComponent) this.roomComponent.endRoom();
                return;
            case RoomZoomEvent.ROOM_ZOOM: {
                const zoomEvent = (event as RoomZoomEvent);

                let zoomLevel = ((zoomEvent.level < 1) ? 0.5 : (1 << (Math.floor(zoomEvent.level) - 1)));

                if(zoomEvent.forceFlip || zoomEvent.asDelta) zoomLevel = zoomEvent.level;

                if(this.roomComponent) Nitro.instance.roomEngine.setRoomInstanceRenderingCanvasScale(this.roomComponent.roomSession.roomId, this.roomComponent.getFirstCanvasId(), zoomLevel, null, null, false, zoomEvent.asDelta);

                return;
            }
            case RoomBackgroundColorEvent.ROOM_COLOR:
                if(this.roomComponent)
                {
                    const colorEvent = (event as RoomBackgroundColorEvent);

                    if(colorEvent._Str_11464)
                    {
                        this.roomComponent.setRoomColorizerColor(0xFF0000, 0xFF);
                    }
                    else 
                    {
                        this.roomComponent.setRoomColorizerColor(colorEvent.color, colorEvent._Str_5123);
                    }
                }
                return;
            case RoomEngineDimmerStateEvent.ROOM_COLOR:
                if(this.roomComponent) this.roomComponent._Str_2485(event);
                return;
            case RoomObjectHSLColorEnabledEvent.ROOM_BACKGROUND_COLOR:
                if(this.roomComponent)
                {
                    const hslColorEvent = (event as RoomObjectHSLColorEnabledEvent);

                    if(hslColorEvent.enable) this.roomComponent.setRoomBackgroundColor(hslColorEvent.hue, hslColorEvent.saturation, hslColorEvent.lightness);
                    else this.roomComponent.setRoomBackgroundColor(0, 0, 0);
                }
                return;
        }
    }

    private onInterstitialEvent(event: RoomEngineEvent): void
    {
        if(!event) return;

        if((event.type !== RoomEngineEvent.GAME_MODE) && (event.type !== RoomEngineEvent.NORMAL_MODE)) return;

        this.roomComponent && this.roomComponent.onRoomEngineEvent(event);
    }

    public onRoomEngineObjectEvent(event: RoomEngineObjectEvent): void
    {
        (this.roomComponent && this.roomComponent.onRoomEngineObjectEvent(event));
    }

    private onRoomSessionEvent(event: RoomSessionEvent): void
    {
        if(!event) return;

        switch(event.type)
        {
            case RoomSessionEvent.CREATED:
                this._ngZone.run(() =>
                {
                    this._landingViewVisible = false;
                });

                Nitro.instance.roomSessionManager.startSession(event.session);
                return;
            case RoomSessionEvent.STARTED:
                return;
            case RoomSessionEvent.ROOM_DATA:
                return;
            case RoomSessionEvent.ENDED:
                if(this.roomComponent) this.roomComponent.endRoom();

                this._ngZone.run(() => 
                {
                    this._landingViewVisible = event.openLandingView;
                });
                return;
            default:
                (this.roomComponent && this.roomComponent.processEvent(event));
                return;
        }
    }

    public get landingViewVisible(): boolean 
    {
        return this._landingViewVisible;
    }

    public get avatarEditorVisible(): boolean 
    {
        return this._settingsService.avatarEditorVisible;
    }

    public get catalogVisible(): boolean 
    {
        return this._settingsService.catalogVisible;
    }

    public get navigatorVisible(): boolean 
    {
        return this._settingsService.navigatorVisible;
    }

    public get inventoryVisible(): boolean 
    {
        return this._settingsService.inventoryVisible;
    }

    public get friendListVisible(): boolean 
    {
        return this._settingsService.friendListVisible;
    }
}