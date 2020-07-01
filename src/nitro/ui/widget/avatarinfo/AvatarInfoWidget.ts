import { IUpdateReceiver } from '../../../../core/common/IUpdateReceiver';
import { IEventDispatcher } from '../../../../core/events/IEventDispatcher';
import { RoomEnterEffect } from '../../../../room/utils/RoomEnterEffect';
import { Nitro } from '../../../Nitro';
import { RoomObjectCategory } from '../../../room/object/RoomObjectCategory';
import { RoomObjectType } from '../../../room/object/RoomObjectType';
import { INitroWindowManager } from '../../../window/INitroWindowManager';
import { DesktopLayoutManager } from '../../DesktopLayoutManager';
import { AvatarInfoWidgetHandler } from '../../handler/AvatarInfoWidgetHandler';
import { IRoomWidgetHandler } from '../../IRoomWidgetHandler';
import { ContextInfoView } from '../contextmenu/ContextInfoView';
import { IContextMenuParentWidget } from '../contextmenu/IContextMenuParentWidget';
import { ConversionTrackingWidget } from '../ConversionTrackingWidget';
import { RoomObjectNameEvent } from '../events/RoomObjectNameEvent';
import { RoomWidgetAvatarInfoEvent } from '../events/RoomWidgetAvatarInfoEvent';
import { RoomWidgetRoomObjectUpdateEvent } from '../events/RoomWidgetRoomObjectUpdateEvent';
import { RoomWidgetUpdateEvent } from '../events/RoomWidgetUpdateEvent';
import { RoomWidgetUpdateInfostandUserEvent } from '../events/RoomWidgetUpdateInfostandUserEvent';
import { RoomWidgetUserLocationUpdateEvent } from '../events/RoomWidgetUserLocationUpdateEvent';
import { RoomWidgetGetObjectLocationMessage } from '../messages/RoomWidgetGetObjectLocationMessage';
import { RoomWidgetRoomObjectMessage } from '../messages/RoomWidgetRoomObjectMessage';
import { AvatarContextInfoButtonView } from './AvatarContextInfoButtonView';
import { AvatarInfoData } from './AvatarInfoData';
import { AvatarMenuView } from './AvatarMenuView';
import { OwnAvatarMenuView } from './OwnAvatarMenuView';
import { PetInfoData } from './PetInfoData';
import { UserNameView } from './UserNameView';

export class AvatarInfoWidget extends ConversionTrackingWidget implements IContextMenuParentWidget, IUpdateReceiver 
{
    private _view: AvatarContextInfoButtonView;
    private _userInfoData: AvatarInfoData;
    private _petInfoData: PetInfoData;
    private _lastRollOverId: number = -1;
    private _cachedNameView: AvatarContextInfoButtonView;
    private _cachedOwnAvatarMenuView: OwnAvatarMenuView;
    private _cachedAvatarMenuView: AvatarMenuView;
    private _avatarNameBubbles: Map<string, UserNameView>;
    private _recycleViews: boolean;

    constructor(widgetHandler: IRoomWidgetHandler, windowManager: INitroWindowManager, layoutManager: DesktopLayoutManager)
    {
        super(widgetHandler, windowManager, layoutManager);

        this._view                      = null;
        this._userInfoData              = new AvatarInfoData();
        this._petInfoData               = new PetInfoData();
        this._lastRollOverId            = -1;
        this._cachedNameView            = null;
        this._cachedOwnAvatarMenuView   = null;
        this._cachedAvatarMenuView      = null;
        this._avatarNameBubbles         = new Map();
        this._recycleViews              = false;

        this.handler.widget = this;
    }

    public dispose(): void
    {
        if(this.disposed) return;

        if(this._avatarNameBubbles)
        {
            for(let view of this._avatarNameBubbles.values()) view && view.dispose();

            this._avatarNameBubbles = null;
        }

        if(this._cachedNameView)
        {
            this._cachedNameView.dispose();

            this._cachedNameView = null;
        }

        if(this._view)
        {
            if(!this._view.disposed)
            {
                this._view.dispose();

                this._view = null;
            }
        }

        Nitro.instance.ticker.remove(this.update, this);

        super.dispose();
    }

    public registerUpdateEvents(eventDispatcher: IEventDispatcher): void
    {
        if(!eventDispatcher) return;

        eventDispatcher.addEventListener(RoomWidgetAvatarInfoEvent.RWAIE_AVATAR_INFO, this._Str_2557.bind(this));
        eventDispatcher.addEventListener(RoomObjectNameEvent.RWONE_TYPE, this._Str_2557.bind(this));
        eventDispatcher.addEventListener(RoomWidgetUpdateInfostandUserEvent.OWN_USER, this._Str_2557.bind(this));
        eventDispatcher.addEventListener(RoomWidgetUpdateInfostandUserEvent.PEER, this._Str_2557.bind(this));
        eventDispatcher.addEventListener(RoomWidgetRoomObjectUpdateEvent.USER_REMOVED, this._Str_2557.bind(this));
        eventDispatcher.addEventListener(RoomWidgetRoomObjectUpdateEvent.OBJECT_SELECTED, this._Str_2557.bind(this));
        eventDispatcher.addEventListener(RoomWidgetRoomObjectUpdateEvent.OBJECT_DESELECTED, this._Str_2557.bind(this));
        eventDispatcher.addEventListener(RoomWidgetRoomObjectUpdateEvent.OBJECT_ROLL_OVER, this._Str_2557.bind(this));
        eventDispatcher.addEventListener(RoomWidgetRoomObjectUpdateEvent.OBJECT_ROLL_OUT, this._Str_2557.bind(this));

        super.registerUpdateEvents(eventDispatcher);
    }

    public unregisterUpdateEvents(eventDispatcher:IEventDispatcher): void
    {
        if(!eventDispatcher) return;

        eventDispatcher.removeEventListener(RoomWidgetAvatarInfoEvent.RWAIE_AVATAR_INFO, this._Str_2557.bind(this));
        eventDispatcher.removeEventListener(RoomObjectNameEvent.RWONE_TYPE, this._Str_2557.bind(this));
        eventDispatcher.removeEventListener(RoomWidgetUpdateInfostandUserEvent.OWN_USER, this._Str_2557.bind(this));
        eventDispatcher.removeEventListener(RoomWidgetUpdateInfostandUserEvent.PEER, this._Str_2557.bind(this));
        eventDispatcher.removeEventListener(RoomWidgetRoomObjectUpdateEvent.USER_REMOVED, this._Str_2557.bind(this));
        eventDispatcher.removeEventListener(RoomWidgetRoomObjectUpdateEvent.OBJECT_SELECTED, this._Str_2557.bind(this));
        eventDispatcher.removeEventListener(RoomWidgetRoomObjectUpdateEvent.OBJECT_DESELECTED, this._Str_2557.bind(this));
        eventDispatcher.removeEventListener(RoomWidgetRoomObjectUpdateEvent.OBJECT_ROLL_OVER, this._Str_2557.bind(this));
        eventDispatcher.removeEventListener(RoomWidgetRoomObjectUpdateEvent.OBJECT_ROLL_OUT, this._Str_2557.bind(this));

        super.unregisterUpdateEvents(eventDispatcher);
    }

    private _Str_2557(event: RoomWidgetUpdateEvent): void
    {
        switch (event.type)
        {
            case RoomWidgetAvatarInfoEvent.RWAIE_AVATAR_INFO:
                console.log(event);
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

                this._userInfoData.populate(infostandEvent);

                const userData = (infostandEvent.isSpectator ? null : this._userInfoData);
                this._Str_12674(infostandEvent.webID, infostandEvent.name, infostandEvent.userType, infostandEvent.roomIndex, this._userInfoData.allowNameChange, userData);
                break;
            case RoomWidgetRoomObjectUpdateEvent.USER_REMOVED:
                const removedEvent = (event as RoomWidgetRoomObjectUpdateEvent);

                if(this._view && (this._view.roomIndex === removedEvent.id)) this.removeView(this._view, false);

                for(let view of this._avatarNameBubbles.values())
                {
                    if (view.objectId == removedEvent.id)
                    {
                        this.removeView(view, false);

                        break;
                    }
                }
                break;
            case RoomWidgetRoomObjectUpdateEvent.OBJECT_ROLL_OVER:
                const rollOverEvent = (event as RoomWidgetRoomObjectUpdateEvent);

                if(!((this._view instanceof AvatarMenuView) || (this._view instanceof OwnAvatarMenuView)))
                {
                    this._lastRollOverId = rollOverEvent.id;
                    this.messageListener.processWidgetMessage(new RoomWidgetRoomObjectMessage(RoomWidgetRoomObjectMessage.GET_OBJECT_NAME, rollOverEvent.id, rollOverEvent.category));
                }
                break;
            case RoomWidgetRoomObjectUpdateEvent.OBJECT_ROLL_OUT:
                const rollOutEvent = (event as RoomWidgetRoomObjectUpdateEvent);

                if(!((this._view instanceof AvatarMenuView) || (this._view instanceof OwnAvatarMenuView)))
                {
                    if(rollOutEvent.id === this._lastRollOverId)
                    {
                        if(this._view && !this._view._Str_4330)
                        {
                            this.removeView(this._view, false);
                            this._lastRollOverId = -1;
                        }
                    }
                }
                break;
            case RoomWidgetRoomObjectUpdateEvent.OBJECT_DESELECTED:
                const deselectedEvent = (event as RoomWidgetRoomObjectUpdateEvent);

                if(this._view) this.removeView(this._view, false);
                break;
        }
        
        this.toggleUpdateReceiver();
    }

    public update(k: number): void
    {        
        if(this._view)
        {
            const message = (this.messageListener.processWidgetMessage(new RoomWidgetGetObjectLocationMessage(RoomWidgetGetObjectLocationMessage.RWGOI_MESSAGE_GET_OBJECT_LOCATION, this._view.userId, this._view.userType)) as RoomWidgetUserLocationUpdateEvent);

            if(message) this._view.update(message.rectangle, message._Str_9337, k);
        }

        for(let view of this._avatarNameBubbles.values())
        {
            if(!view) continue;

            const message = (this.messageListener.processWidgetMessage(new RoomWidgetGetObjectLocationMessage(RoomWidgetGetObjectLocationMessage.RWGOI_MESSAGE_GET_OBJECT_LOCATION, this._view.userId, this._view.userType)) as RoomWidgetUserLocationUpdateEvent);

            if(message) view.update(message.rectangle, message._Str_9337, k);
        }
    }

    public close(): void
    {
        this.removeView(this._view, false);
    }

    public removeView(view: ContextInfoView, some: boolean): void
    {
        if(!view) return;

        if(this._recycleViews)
        {
            view.hide(some);
        }
        else
        {
            view.dispose();

            this._cachedNameView            = null;
            this._cachedOwnAvatarMenuView   = null;
            this._cachedAvatarMenuView      = null;
        }

        if(view === this._view) this._view = null;

        if(view instanceof UserNameView)
        {
            this._avatarNameBubbles.delete(view.userName);

            view.dispose();

            this.toggleUpdateReceiver();
        }
    }

    private _Str_12674(userId: number, userName: string, userType: number, roomIndex: number, _arg_5: boolean, avatarData: AvatarInfoData): void
    {
        let isAvatarMenu = !!avatarData;

        if((isAvatarMenu && this._view) && (!((this._view instanceof AvatarMenuView) || (this._view instanceof OwnAvatarMenuView))))
        {
            // PetMenuView, OwnPetMenuView, RentableBotMenuView
            this.removeView(this._view, false);
        }

        this.removeAllProductBubbles();

        if(!this._view || (this._view.userId !== userId) || (this._view.userName !== userName) || (this._view.userType !== roomIndex) || (this._view.roomIndex !== RoomObjectType.USER) || _arg_5)
        {
            if(this._view) this.removeView(this._view, false);

            if(isAvatarMenu)
            {
                if(avatarData._Str_11453)
                {
                    if(this.isDecorting) return;

                    if(RoomEnterEffect._Str_1349())
                    {
                        // new user help view
                    }
                    else
                    {
                        console.log('create own view');
                        if(!this._cachedOwnAvatarMenuView) this._cachedOwnAvatarMenuView = new OwnAvatarMenuView(this);

                        this._view = this._cachedOwnAvatarMenuView;

                        OwnAvatarMenuView.setup((this._view as OwnAvatarMenuView), userId, userName, userType, roomIndex, avatarData);
                    }
                }
                else
                {
                    console.log('create standard view')
                    if(!this._cachedAvatarMenuView) this._cachedAvatarMenuView = new AvatarMenuView(this);

                    this._view = this._cachedAvatarMenuView;

                    AvatarMenuView.setup((this._view as AvatarMenuView), userId, userName, userType, roomIndex, avatarData);

                    for(let view of this._avatarNameBubbles.values())
                    {
                        if(view.userId !== userId) continue;

                        this.removeView(view, false);

                        break;
                    }
                }
            }
            else
            {
                if(!this.handler.roomEngine.isDecorating)
                {
                    if(!this._cachedNameView) this._cachedNameView = new AvatarContextInfoButtonView(this);

                    this._view = this._cachedNameView;

                    if(this.handler.container.sessionDataManager.userId === userId)
                    {
                        AvatarContextInfoButtonView.extendedSetup(this._view, userId, userName, userType, roomIndex);
                    }
                    else
                    {
                        AvatarContextInfoButtonView.extendedSetup(this._view, userId, userName, userType, roomIndex, _arg_5, true);
                    }
                }
            }
        }
        else
        {
            if((this._view instanceof AvatarMenuView) || (this._view instanceof OwnAvatarMenuView))
            {
                if(this._view.userId === userId) this.removeView(this._view, false);
            }
        }
    }

    public removeAllProductBubbles(): void
    {
        // remove them

        this.toggleUpdateReceiver();
    }

    public toggleUpdateReceiver():void
    {
        if(this._view || (this._avatarNameBubbles.size > 0))
        {
            Nitro.instance.ticker.add(this.update, this);
        }
        else
        {
            Nitro.instance.ticker.remove(this.update, this);
        }
    }

    public get handler(): AvatarInfoWidgetHandler
    {
        return (this.widgetHandler as AvatarInfoWidgetHandler);
    }

    public get isDecorting(): boolean
    {
        return this.handler.roomSession.isDecorating;
    }
}