import { IEventDispatcher } from '../../../../core/events/IEventDispatcher';
import { INitroWindowManager } from '../../../window/INitroWindowManager';
import { WindowTemplates } from '../../../window/WindowTemplates';
import { DesktopLayoutManager } from '../../DesktopLayoutManager';
import { InfoStandWidgetHandler } from '../../handler/InfoStandWidgetHandler';
import { IRoomWidgetHandler } from '../../IRoomWidgetHandler';
import { ConversionTrackingWidget } from '../ConversionTrackingWidget';
import { RoomWidgetFurniInfostandUpdateEvent } from '../events/RoomWidgetFurniInfostandUpdateEvent';
import { RoomWidgetRoomObjectUpdateEvent } from '../events/RoomWidgetRoomObjectUpdateEvent';
import { RoomWidgetUserInfostandUpdateEvent } from '../events/RoomWidgetUserInfostandUpdateEvent';
import { RoomWidgetRoomObjectMessage } from '../messages/RoomWidgetRoomObjectMessage';
import { InfoStandFurniData } from './InfoStandFurniData';
import { InfoStandFurniView } from './InfoStandFurniView';
import { InfoStandPetData } from './InfoStandPetData';
import { InfoStandUserData } from './InfoStandUserData';
import { InfoStandUserView } from './InfoStandUserView';

export class InfoStandWidget extends ConversionTrackingWidget
{
    private static USER_VIEW: string            = 'infostand-user-view';
    private static FURNI_VIEW: string           = 'infostand-furni-view';
    private static PET_VIEW: string             = 'infostand-pet-view';
    private static BOT_VIEW: string             = 'infostand-bot-view';
    private static RENTABLE_BOT_VIEW: string    = 'infostand-rentable-bot-view';
    private static JUKEBOX_VIEW: string         = 'infostand-jukebox-view';
    private static CRACKABLE_FURNI_VIEW: string = 'infostand-crackable-view';
    private static SONGDISK_VIEW: string        = 'infostand-songdisk-view';
    private static UPDATE_VIEW_INTERVAL: number = 3000;

    private _mainContainer: HTMLElement;

    private _userData: InfoStandUserData;
    private _furniData: InfoStandFurniData;
    private _petData: InfoStandPetData;

    private _userView: InfoStandUserView;
    private _furniView: InfoStandFurniView;

    private _updateTimer: any;

    constructor(widgetHandler: IRoomWidgetHandler, windowManager: INitroWindowManager, layoutManager: DesktopLayoutManager)
    {
        super(widgetHandler, windowManager, layoutManager);

        this._mainContainer = null;

        this._userData          = new InfoStandUserData();
        this._furniData         = new InfoStandFurniData();
        this._petData           = new InfoStandPetData();

        this._userView          = new InfoStandUserView(this, InfoStandWidget.USER_VIEW);
        this._furniView         = new InfoStandFurniView(this, InfoStandWidget.FURNI_VIEW);

        this.handler.widget = this;
    }

    public dispose(): void
    {
        if(this.disposed) return;
        
        super.dispose();
    }

    public registerUpdateEvents(eventDispatcher: IEventDispatcher): void
    {
        if(!eventDispatcher) return;

        eventDispatcher.addEventListener(RoomWidgetRoomObjectUpdateEvent.OBJECT_SELECTED, this.objectSelectedHandler.bind(this));
        eventDispatcher.addEventListener(RoomWidgetRoomObjectUpdateEvent.OBJECT_DESELECTED, this.objectDeselectedHandler.bind(this));
        eventDispatcher.addEventListener(RoomWidgetRoomObjectUpdateEvent.USER_REMOVED, this.objectRemovedHandler.bind(this));
        eventDispatcher.addEventListener(RoomWidgetRoomObjectUpdateEvent.FURNI_REMOVED, this.objectRemovedHandler.bind(this));
        eventDispatcher.addEventListener(RoomWidgetUserInfostandUpdateEvent.OWN_USER, this.userInfostandUpdateHandler.bind(this));
        eventDispatcher.addEventListener(RoomWidgetUserInfostandUpdateEvent.PEER, this.userInfostandUpdateHandler.bind(this));
        eventDispatcher.addEventListener(RoomWidgetUserInfostandUpdateEvent.BOT, this.userInfostandUpdateHandler.bind(this));
        eventDispatcher.addEventListener(RoomWidgetFurniInfostandUpdateEvent.FURNI, this.furniInfostandUpdateHandler.bind(this));
        
        super.registerUpdateEvents(eventDispatcher);
    }

    public unregisterUpdateEvents(eventDispatcher: IEventDispatcher): void
    {
        if(!eventDispatcher) return;

        eventDispatcher.removeEventListener(RoomWidgetRoomObjectUpdateEvent.OBJECT_SELECTED, this.objectSelectedHandler.bind(this));
        eventDispatcher.removeEventListener(RoomWidgetRoomObjectUpdateEvent.OBJECT_DESELECTED, this.objectDeselectedHandler.bind(this));
        eventDispatcher.removeEventListener(RoomWidgetRoomObjectUpdateEvent.USER_REMOVED, this.objectRemovedHandler.bind(this));
        eventDispatcher.removeEventListener(RoomWidgetRoomObjectUpdateEvent.FURNI_REMOVED, this.objectRemovedHandler.bind(this));
        eventDispatcher.removeEventListener(RoomWidgetUserInfostandUpdateEvent.OWN_USER, this.userInfostandUpdateHandler.bind(this));
        eventDispatcher.removeEventListener(RoomWidgetUserInfostandUpdateEvent.PEER, this.userInfostandUpdateHandler.bind(this));
        eventDispatcher.removeEventListener(RoomWidgetUserInfostandUpdateEvent.BOT, this.userInfostandUpdateHandler.bind(this));
        eventDispatcher.removeEventListener(RoomWidgetFurniInfostandUpdateEvent.FURNI, this.furniInfostandUpdateHandler.bind(this));

        super.unregisterUpdateEvents(eventDispatcher);
    }

    private objectSelectedHandler(k: RoomWidgetRoomObjectUpdateEvent): void
    {
        this.messageListener.processWidgetMessage(new RoomWidgetRoomObjectMessage(RoomWidgetRoomObjectMessage.GET_OBJECT_INFO, k.id, k.category));
    }

    private objectDeselectedHandler(k: RoomWidgetRoomObjectUpdateEvent): void
    {
        this.close();

        // if (this._updateTimer)
        // {
        //     this._updateTimer.stop();
        // }
    }

    private objectRemovedHandler(event: RoomWidgetRoomObjectUpdateEvent): void
    {
        let remove = false;
        switch (event.type)
        {
            case RoomWidgetRoomObjectUpdateEvent.FURNI_REMOVED:
                if(this._furniView && this._furniView.window && (this._furniView.window.style.display !== 'none'))
                {
                    remove = (event.id === this._furniData.id);
                    
                    break;
                }
                break;
            case RoomWidgetRoomObjectUpdateEvent.USER_REMOVED:
                if(this._userView && this._userView.window && (this._userView.window.style.display !== 'none'))
                {
                    remove = (event.id === this._userData._Str_3313);

                    break;
                }
                // if ((((!(this._petView == null)) && (!(this._petView.window == null))) && (this._petView.window.visible)))
                // {
                //     _local_2 = (k.id == this._petData._Str_2707);
                //     break;
                // }
                // if ((((!(this._botView == null)) && (!(this._botView.window == null))) && (this._botView.window.visible)))
                // {
                //     _local_2 = (k.id == this._userData._Str_3313);
                //     break;
                // }
                // if ((((!(this._rentableBotView == null)) && (!(this._rentableBotView.window == null))) && (this._rentableBotView.window.visible)))
                // {
                //     _local_2 = (k.id == this._rentableBotdata._Str_3313);
                //     break;
                // }
                break;
        }

        if(remove) this.close();
    }

    private userInfostandUpdateHandler(event: RoomWidgetUserInfostandUpdateEvent): void
    {
        if(!event) return;

        this._userData._Str_5479(event);
        this._userView.update(event);
        
        this.setVisibleView(InfoStandWidget.USER_VIEW);
    }

    private furniInfostandUpdateHandler(event: RoomWidgetFurniInfostandUpdateEvent): void
    {
        if(!event) return;

        this._furniData.populate(event);
        this._furniView.update(event);

        this.setVisibleView(InfoStandWidget.FURNI_VIEW);
    }

    public close(): void
    {
        this.hideAllInfoStands();
    }

    private hideAllInfoStands(): void
    {
        if(!this._mainContainer) return;

        const asArray = (Array.from(this._mainContainer.children) as HTMLElement[]);

        if(asArray) for(let element of asArray) element && (element.style.display = 'none');
    }

    private setVisibleView(name: string): void
    {
        this.hideAllInfoStands();
        
        const element = (this.mainContainer.getElementsByClassName(name)[0] as HTMLElement);

        if(!element) return;

        element.style.display = 'inherit';
    }

    private getTemplate(): string
    {
        return this.windowManager.getTemplate(WindowTemplates.INFOSTAND_MENU);
    }

    public get handler(): InfoStandWidgetHandler
    {
        return (this.widgetHandler as InfoStandWidgetHandler);
    }

    public get mainWindow(): HTMLElement
    {
        return this.mainContainer;
    }

    public get mainContainer(): HTMLElement
    {
        if(!this._mainContainer)
        {
            this._mainContainer = this.windowManager.renderElement(this.getTemplate(), {});
        }

        return this._mainContainer;
    }
}