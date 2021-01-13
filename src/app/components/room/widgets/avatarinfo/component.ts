import { Component, ComponentFactoryResolver, ComponentRef, NgZone, OnDestroy, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { IEventDispatcher } from '../../../../../client/core/events/IEventDispatcher';
import { AvatarAction } from '../../../../../client/nitro/avatar/enum/AvatarAction';
import { Nitro } from '../../../../../client/nitro/Nitro';
import { RoomObjectCategory } from '../../../../../client/nitro/room/object/RoomObjectCategory';
import { RoomObjectVariable } from '../../../../../client/nitro/room/object/RoomObjectVariable';
import { HabboClubLevelEnum } from '../../../../../client/nitro/session/HabboClubLevelEnum';
import { ConversionTrackingWidget } from '../../../../../client/nitro/ui/widget/ConversionTrackingWidget';
import { RoomWidgetUpdateEvent } from '../../../../../client/nitro/ui/widget/events/RoomWidgetUpdateEvent';
import { IRoomObject } from '../../../../../client/room/object/IRoomObject';
import { RoomEnterEffect } from '../../../../../client/room/utils/RoomEnterEffect';
import { SettingsService } from '../../../../core/settings/service';
import { AvatarEditorService } from '../../../avatar-editor/services/avatar-editor.service';
import { ContextInfoView } from '../contextmenu/ContextInfoView';
import { IContextMenuParentWidget } from '../contextmenu/IContextMenuParentWidget';
import { RoomObjectNameEvent } from '../events/RoomObjectNameEvent';
import { RoomWidgetAvatarInfoEvent } from '../events/RoomWidgetAvatarInfoEvent';
import { RoomWidgetFurniInfostandUpdateEvent } from '../events/RoomWidgetFurniInfostandUpdateEvent';
import { RoomWidgetRoomEngineUpdateEvent } from '../events/RoomWidgetRoomEngineUpdateEvent';
import { RoomWidgetRoomObjectUpdateEvent } from '../events/RoomWidgetRoomObjectUpdateEvent';
import { RoomWidgetUpdateInfostandUserEvent } from '../events/RoomWidgetUpdateInfostandUserEvent';
import { RoomWidgetUserDataUpdateEvent } from '../events/RoomWidgetUserDataUpdateEvent';
import { RoomWidgetUserLocationUpdateEvent } from '../events/RoomWidgetUserLocationUpdateEvent';
import { AvatarInfoWidgetHandler } from '../handlers/AvatarInfoWidgetHandler';
import { RoomWidgetGetObjectLocationMessage } from '../messages/RoomWidgetGetObjectLocationMessage';
import { RoomWidgetRoomObjectMessage } from '../messages/RoomWidgetRoomObjectMessage';
import { RoomAvatarInfoAvatarComponent } from './avatar/component';
import { AvatarContextInfoView } from './AvatarContextInfoView';
import { AvatarInfoData } from './AvatarInfoData';
import { RoomAvatarInfoNameComponent } from './name/component';
import { RoomAvatarInfoOwnAvatarComponent } from './ownavatar/component';
import { PetInfoData } from './PetInfoData';

@Component({
	selector: 'nitro-room-avatarinfo-component',
    template: `
    <div class="nitro-room-avatarinfo-component">
        <ng-template #contextsContainer></ng-template>
    </div>`
})
export class RoomAvatarInfoComponent extends ConversionTrackingWidget implements IContextMenuParentWidget, OnDestroy
{
    private static _Str_17951: number = 77;
    private static _Str_18968: number = 29;
    private static _Str_16970: number = 30;
    private static _Str_18857: number = 185;
    private static _Str_18641: number = 5000;

    @ViewChild('contextsContainer', { read: ViewContainerRef })
    public contextsContainer: ViewContainerRef;

    public view: ComponentRef<AvatarContextInfoView> = null;
    public cachedNameView: ComponentRef<RoomAvatarInfoNameComponent> = null;
    public cachedOwnAvatarMenuView: ComponentRef<RoomAvatarInfoOwnAvatarComponent> = null;
    public cachedAvatarMenuView: ComponentRef<RoomAvatarInfoAvatarComponent> = null;
    public cachedNameBubbles: Map<string, ComponentRef<RoomAvatarInfoNameComponent>> = new Map();

    public lastRollOverId: number       = -1;
    public userInfoData: AvatarInfoData = new AvatarInfoData();
    public petInfoData: PetInfoData     = new PetInfoData();
    public isDancing: boolean           = false;

    private _isInitialized: boolean             = false;
    private _isRoomEnteredOwnAvatarHighlight    = false;
    private _isGameMode                         = false;

    constructor(
        private _avatarEditorService: AvatarEditorService,
        private _settingsService: SettingsService,
        private _componentFactoryResolver: ComponentFactoryResolver,
        private _ngZone: NgZone
    )
    {
        super();
    }

    public ngOnDestroy(): void
    {
        Nitro.instance.ticker.remove(this.update, this);
    }

    public registerUpdateEvents(eventDispatcher: IEventDispatcher): void
    {
        if(!eventDispatcher) return;

        eventDispatcher.addEventListener(RoomWidgetAvatarInfoEvent.RWAIE_AVATAR_INFO, this._Str_2557.bind(this));
        eventDispatcher.addEventListener(RoomObjectNameEvent.RWONE_TYPE, this._Str_2557.bind(this));
        eventDispatcher.addEventListener(RoomWidgetUpdateInfostandUserEvent.OWN_USER, this._Str_2557.bind(this));
        eventDispatcher.addEventListener(RoomWidgetUpdateInfostandUserEvent.PEER, this._Str_2557.bind(this));
        eventDispatcher.addEventListener(RoomWidgetUserDataUpdateEvent.RWUDUE_USER_DATA_UPDATED, this._Str_2557.bind(this));
        eventDispatcher.addEventListener(RoomWidgetRoomObjectUpdateEvent.USER_REMOVED, this._Str_2557.bind(this));
        eventDispatcher.addEventListener(RoomWidgetFurniInfostandUpdateEvent.FURNI, this._Str_2557.bind(this));
        eventDispatcher.addEventListener(RoomWidgetRoomObjectUpdateEvent.OBJECT_SELECTED, this._Str_2557.bind(this));
        eventDispatcher.addEventListener(RoomWidgetRoomObjectUpdateEvent.OBJECT_DESELECTED, this._Str_2557.bind(this));
        eventDispatcher.addEventListener(RoomWidgetRoomObjectUpdateEvent.OBJECT_ROLL_OVER, this._Str_2557.bind(this));
        eventDispatcher.addEventListener(RoomWidgetRoomObjectUpdateEvent.OBJECT_ROLL_OUT, this._Str_2557.bind(this));
        eventDispatcher.addEventListener(RoomWidgetRoomEngineUpdateEvent.RWREUE_NORMAL_MODE, this._Str_2557.bind(this));
        eventDispatcher.addEventListener(RoomWidgetRoomEngineUpdateEvent.RWREUE_GAME_MODE, this._Str_2557.bind(this));

        super.registerUpdateEvents(eventDispatcher);
    }

    public unregisterUpdateEvents(eventDispatcher:IEventDispatcher): void
    {
        if(!eventDispatcher) return;

        eventDispatcher.removeEventListener(RoomWidgetAvatarInfoEvent.RWAIE_AVATAR_INFO, this._Str_2557.bind(this));
        eventDispatcher.removeEventListener(RoomObjectNameEvent.RWONE_TYPE, this._Str_2557.bind(this));
        eventDispatcher.removeEventListener(RoomWidgetUpdateInfostandUserEvent.OWN_USER, this._Str_2557.bind(this));
        eventDispatcher.removeEventListener(RoomWidgetUpdateInfostandUserEvent.PEER, this._Str_2557.bind(this));
        eventDispatcher.removeEventListener(RoomWidgetUserDataUpdateEvent.RWUDUE_USER_DATA_UPDATED, this._Str_2557.bind(this));
        eventDispatcher.removeEventListener(RoomWidgetRoomObjectUpdateEvent.USER_REMOVED, this._Str_2557.bind(this));
        eventDispatcher.removeEventListener(RoomWidgetFurniInfostandUpdateEvent.FURNI, this._Str_2557.bind(this));
        eventDispatcher.removeEventListener(RoomWidgetRoomObjectUpdateEvent.OBJECT_SELECTED, this._Str_2557.bind(this));
        eventDispatcher.removeEventListener(RoomWidgetRoomObjectUpdateEvent.OBJECT_DESELECTED, this._Str_2557.bind(this));
        eventDispatcher.removeEventListener(RoomWidgetRoomObjectUpdateEvent.OBJECT_ROLL_OVER, this._Str_2557.bind(this));
        eventDispatcher.removeEventListener(RoomWidgetRoomObjectUpdateEvent.OBJECT_ROLL_OUT, this._Str_2557.bind(this));
        eventDispatcher.removeEventListener(RoomWidgetRoomEngineUpdateEvent.RWREUE_NORMAL_MODE, this._Str_2557.bind(this));
        eventDispatcher.removeEventListener(RoomWidgetRoomEngineUpdateEvent.RWREUE_GAME_MODE, this._Str_2557.bind(this));

        super.unregisterUpdateEvents(eventDispatcher);
    }

    private _Str_2557(event: RoomWidgetUpdateEvent): void
    {
        const viewInstance = ((this.view && this.view.instance) || null);

        switch (event.type)
        {
            case RoomWidgetAvatarInfoEvent.RWAIE_AVATAR_INFO:
                const avatarInfoEvent = (event as RoomWidgetAvatarInfoEvent);

                this._isRoomEnteredOwnAvatarHighlight = (!this._isInitialized && this.handler.container.roomSession && (avatarInfoEvent._Str_2707 === this.handler.container.roomSession.ownRoomIndex));

                this._Str_12674(avatarInfoEvent.userId, avatarInfoEvent.userName, avatarInfoEvent._Str_2908, avatarInfoEvent._Str_2707, avatarInfoEvent._Str_4330, null);

                this._isInitialized = true;
                break;
            case RoomObjectNameEvent.RWONE_TYPE:
                const nameEvent = (event as RoomObjectNameEvent);

                if(nameEvent.category === RoomObjectCategory.UNIT)
                {
                    this._Str_12674(nameEvent.userId, nameEvent.userName, nameEvent.userType, nameEvent.roomIndex, false, null);
                }
                break;
            case RoomWidgetUpdateInfostandUserEvent.OWN_USER:
            case RoomWidgetUpdateInfostandUserEvent.PEER:
                const infostandEvent = (event as RoomWidgetUpdateInfostandUserEvent);

                this.userInfoData.populate(infostandEvent);

                const userData = (infostandEvent.isSpectator ? null : this.userInfoData);

                this._Str_12674(infostandEvent.webID, infostandEvent.name, infostandEvent.userType, infostandEvent.roomIndex, false, userData);
                break;
            case RoomWidgetUserDataUpdateEvent.RWUDUE_USER_DATA_UPDATED:
                if(!this._isInitialized)
                {
                    this._Str_25716();
                }
                break;
            case RoomWidgetRoomObjectUpdateEvent.USER_REMOVED:
                const removedEvent = (event as RoomWidgetRoomObjectUpdateEvent);

                if(viewInstance && ((viewInstance as AvatarContextInfoView).roomIndex === removedEvent.id)) this.removeView(this.view, false);

                for(let view of this.cachedNameBubbles.values())
                {
                    const viewInstance = view.instance;

                    if(viewInstance.roomIndex == removedEvent.id)
                    {
                        this.removeView(view, false);

                        break;
                    }
                }

                break;
            case RoomWidgetFurniInfostandUpdateEvent.FURNI:
                if(this.view) this.removeView(this.view, false);
                break;
            case RoomWidgetRoomObjectUpdateEvent.OBJECT_DESELECTED:
                const deselectedEvent = (event as RoomWidgetRoomObjectUpdateEvent);

                if(this.view) this.removeView(this.view, false);
                break;
            case RoomWidgetRoomObjectUpdateEvent.OBJECT_ROLL_OVER:
                if(this._isRoomEnteredOwnAvatarHighlight) return;

                const rollOverEvent = (event as RoomWidgetRoomObjectUpdateEvent);

                if(!viewInstance || !((viewInstance instanceof RoomAvatarInfoAvatarComponent) || (viewInstance instanceof RoomAvatarInfoOwnAvatarComponent)))
                {
                    this.lastRollOverId = rollOverEvent.id;
                    this.messageListener.processWidgetMessage(new RoomWidgetRoomObjectMessage(RoomWidgetRoomObjectMessage.GET_OBJECT_NAME, rollOverEvent.id, rollOverEvent.category));
                }
                break;
            case RoomWidgetRoomObjectUpdateEvent.OBJECT_ROLL_OUT:
                if(this._isRoomEnteredOwnAvatarHighlight) return;

                const rollOutEvent = (event as RoomWidgetRoomObjectUpdateEvent);

                if(!viewInstance || !((viewInstance instanceof RoomAvatarInfoAvatarComponent) || (viewInstance instanceof RoomAvatarInfoOwnAvatarComponent)))
                {
                    if(rollOutEvent.id === this.lastRollOverId)
                    {
                        this.removeView(this.view, false);

                        this.lastRollOverId = -1;
                    }
                }
                break;
            case RoomWidgetRoomEngineUpdateEvent.RWREUE_NORMAL_MODE:
                this._isGameMode = false;
                break;
            case RoomWidgetRoomEngineUpdateEvent.RWREUE_GAME_MODE:
                this._isGameMode = true;
                break;
        }
        
        this.toggleUpdateReceiver();
    }

    private _Str_12674(userId: number, userName: string, userType: number, roomIndex: number, flag: boolean, avatarData: AvatarInfoData): void
    {
        let isAvatarMenu = !!avatarData;

        let viewInstance = (this.view && this.view.instance);

        if(isAvatarMenu && viewInstance)
        {
            if(!((viewInstance instanceof RoomAvatarInfoAvatarComponent) || (viewInstance instanceof RoomAvatarInfoOwnAvatarComponent)))
            {
                this.removeView(this.view, false);

                viewInstance = null;
            }
        }

        if(!viewInstance || (viewInstance.userId !== userId) || (viewInstance.userName !== userName) || (viewInstance.userType !== userType) || (viewInstance.roomIndex !== roomIndex))
        {
            if(this.view) this.removeView(this.view, false);

            if(!this._isGameMode)
            {
                if(isAvatarMenu)
                {
                    if(avatarData._Str_11453)
                    {
                        if(this.isDecorting) return;

                        if(RoomEnterEffect.isRunning())
                        {

                        }
                        else
                        {
                            if(!this.cachedOwnAvatarMenuView) this.cachedOwnAvatarMenuView = this.createView(RoomAvatarInfoOwnAvatarComponent);

                            this.view = this.cachedOwnAvatarMenuView;

                            this._ngZone.run(() => RoomAvatarInfoOwnAvatarComponent.setup((this.view.instance as RoomAvatarInfoOwnAvatarComponent), userId, userName, userType, roomIndex, avatarData));
                        }
                    }
                    else
                    {
                        if(!this.cachedAvatarMenuView) this.cachedAvatarMenuView = this.createView(RoomAvatarInfoAvatarComponent);

                        this.view = this.cachedAvatarMenuView;

                        this._ngZone.run(() => RoomAvatarInfoAvatarComponent.setup((this.view.instance as RoomAvatarInfoAvatarComponent), userId, userName, userType, roomIndex, avatarData));

                        for(let view of this.cachedNameBubbles.values())
                        {
                            const viewInstance = view.instance;

                            if(viewInstance.userId !== userId) continue;

                            this.removeView(view, false);

                            break;
                        }
                    }
                }
                else
                {
                    if(!this.handler.roomEngine.isDecorating)
                    {
                        if(!this.cachedNameView) this.cachedNameView = this.createView(RoomAvatarInfoNameComponent);

                        this.view = this.cachedNameView;

                        this._ngZone.run(() =>
                        {
                            if(this.handler.container.sessionDataManager.userId === userId)
                            {
                                RoomAvatarInfoNameComponent.setup(this.view.instance, userId, userName, userType, roomIndex);

                                if(this._isRoomEnteredOwnAvatarHighlight)
                                {
                                }
                            }
                            else
                            {
                                RoomAvatarInfoNameComponent.setup(this.view.instance, userId, userName, userType, roomIndex, true);
                            }
                        });
                    }
                }
            }
        }
        else
        {
            if(viewInstance && ((viewInstance instanceof RoomAvatarInfoAvatarComponent) || (viewInstance instanceof RoomAvatarInfoOwnAvatarComponent)))
            {
                if(viewInstance.userId === userId) this.removeView(this.view, false);
            }
        }
    }

    private createView<T extends ContextInfoView>(component: Type<T>): ComponentRef<T>
    {
        if(!component) return null;

        let viewRef: ComponentRef<T>    = null;
        let view: T                     = null;

        this._ngZone.run(() =>
        {
            const componentFactory = this._componentFactoryResolver.resolveComponentFactory(component);
            
            viewRef = this.contextsContainer.createComponent(componentFactory);
            view    = viewRef.instance;
        });

        if(!view || !viewRef) return null;

        view.parent         = this;
        view.componentRef   = viewRef;

        return viewRef;
    }

    public close(): void
    {
        this.removeView(this.view, false);
    }

    public removeView(view: ComponentRef<ContextInfoView>, flag: boolean): void
    {
        this._isRoomEnteredOwnAvatarHighlight = false;
        
        if(!view) return;

        const componentIndex = this.contextsContainer.indexOf(view.hostView);

        if(componentIndex === -1) return;
        
        this.cachedNameView             = null;
        this.cachedOwnAvatarMenuView    = null;
        this.cachedAvatarMenuView       = null;

        if(view === this.view) this.view = null;

        if(view instanceof RoomAvatarInfoNameComponent)
        {
            this.cachedNameBubbles.delete((view.instance as RoomAvatarInfoNameComponent).userName);

            this.toggleUpdateReceiver();
        }

        this._ngZone.run(() => this.contextsContainer.remove(componentIndex));
    }

    public toggleUpdateReceiver(): void
    {
        if(this.view || (this.cachedNameBubbles.size > 0))
        {
            Nitro.instance.ticker.add(this.update, this);
        }
        else
        {
            Nitro.instance.ticker.remove(this.update, this);
        }
    }

    public update(time: number): void
    {        
        if(this.view)
        {
            const viewInstance = this.view.instance;

            const message = (this.messageListener.processWidgetMessage(new RoomWidgetGetObjectLocationMessage(RoomWidgetGetObjectLocationMessage.RWGOI_MESSAGE_GET_OBJECT_LOCATION, viewInstance.userId, viewInstance.userType)) as RoomWidgetUserLocationUpdateEvent);

            if(message) viewInstance.update(message.rectangle, message._Str_9337, time);
        }

        for(let view of this.cachedNameBubbles.values())
        {
            if(!view) continue;

            const viewInstance = view.instance;

            const message = (this.messageListener.processWidgetMessage(new RoomWidgetGetObjectLocationMessage(RoomWidgetGetObjectLocationMessage.RWGOI_MESSAGE_GET_OBJECT_LOCATION, viewInstance.userId, viewInstance.userType)) as RoomWidgetUserLocationUpdateEvent);

            if(message) viewInstance.update(message.rectangle, message._Str_9337, time);
        }
    }

    private getOwnRoomObject(): IRoomObject
    {
        const userId        = this.handler.container.sessionDataManager.userId;
        const roomId        = this.handler.roomEngine.activeRoomId;
        const category      = RoomObjectCategory.UNIT;
        const totalObjects  = this.handler.roomEngine.getTotalObjectsForManager(roomId, category);

        let i = 0;

        while(i < totalObjects)
        {
            const roomObject = this.handler.roomEngine.getRoomObjectByIndex(roomId, i, category);

            if(roomObject)
            {
                const userData = this.handler.roomSession.userDataManager.getUserDataByIndex(roomObject.id);

                if(userData)
                {
                    if(userData.webID === userId) return roomObject;
                }
            }

            i++;
        }

        return null;
    }

    private _Str_25716(): void
    {
        this.messageListener.processWidgetMessage(new RoomWidgetRoomObjectMessage(RoomWidgetRoomObjectMessage.GET_OWN_CHARACTER_INFO, 0, 0));
    }

    public openAvatarEditor(): void
    {
        this._avatarEditorService.loadOwnAvatarInEditor();
        this._settingsService.showAvatarEditor();
    }

    public useSign(sign: number): void
    {
        this.widgetHandler.container.roomSession.sendSignMessage(sign);
    }

    public get getOwnPosture(): string
    {
        const roomObject = this.getOwnRoomObject();

        if(roomObject)
        {
            const model = roomObject.model;

            if(model)
            {
                return model.getValue<string>(RoomObjectVariable.FIGURE_POSTURE);
            }
        }

        return AvatarAction.POSTURE_STAND;
    }

    public get getCanStandUp(): boolean
    {
        const roomObject = this.getOwnRoomObject();

        if(roomObject)
        {
            const model = roomObject.model;

            if(model)
            {
                return model.getValue<boolean>(RoomObjectVariable.FIGURE_CAN_STAND_UP);
            }
        }

        return false;
    }

    public get _Str_12708(): boolean
    {
        const roomObject = this.getOwnRoomObject();

        if(roomObject)
        {
            const model = roomObject.model;

            if(model)
            {
                const effectId = model.getValue<number>(RoomObjectVariable.FIGURE_EFFECT);

                return ((effectId === RoomAvatarInfoComponent._Str_18968) || (effectId === RoomAvatarInfoComponent._Str_16970) || (effectId === RoomAvatarInfoComponent._Str_18857));
            }
        }

        return false;
    }

    public get _Str_25831(): boolean
    {
        const roomObject = this.getOwnRoomObject();

        if(roomObject)
        {
            const model = roomObject.model;

            if(model)
            {
                const effectId = model.getValue<number>(RoomObjectVariable.FIGURE_EFFECT);

                return (effectId === RoomAvatarInfoComponent._Str_17951);
            }
        }

        return false;
    }

    public get handler(): AvatarInfoWidgetHandler
    {
        return (this.widgetHandler as AvatarInfoWidgetHandler);
    }

    public get isDecorting(): boolean
    {
        return this.handler.roomSession.isDecorating;
    }

    public get hasClub(): boolean
    {
        return (this.handler.container.sessionDataManager.clubLevel >= HabboClubLevelEnum._Str_2964);
    }

    public get hasVip(): boolean
    {
        return (this.handler.container.sessionDataManager.clubLevel >= HabboClubLevelEnum._Str_2575);
    }
}