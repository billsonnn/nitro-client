import { Component } from '@angular/core';
import { ConversionTrackingWidget } from '../../../../../client/nitro/ui/widget/ConversionTrackingWidget';

@Component({
	selector: 'nitro-room-infostand-component',
    template: `
    <div class="nitro-room-infostand-component">
        
    </div>`
})
export class RoomInfoStandComponent extends ConversionTrackingWidget
{
    // constructor(
    //     private ngZone: NgZone
    // )
    // {
    //     super();
    // }

    // public ngOnInit(): void
    // {
    //     Nitro.instance;
    //     console.log('hellooooooooooo')
    // }

    // public ngAfterViewInit(): void
    // {
    //     console.log('helloooo')
    //     this.ngZone.runOutsideAngular(() =>
    //     {
    //         console.log('truu')
    //         document.body.addEventListener('keydown', this.onKeyDownEvent.bind(this));

    //         this.inputView.addEventListener('mousedown', this.onInputMouseDownEvent.bind(this));
    //         this.inputView.addEventListener('input', this.onInputChangeEvent.bind(this));
    //     });
    // }

    // public ngOnDestroy(): void
    // {
    //     this.ngZone.runOutsideAngular(() =>
    //     {
    //         document.body.removeEventListener('keydown', this.onKeyDownEvent.bind(this));

    //         this.inputView.removeEventListener('mousedown', this.onInputMouseDownEvent.bind(this));
    //         this.inputView.removeEventListener('input', this.onInputChangeEvent.bind(this));
    //     });
    // }

    // public registerUpdateEvents(eventDispatcher: IEventDispatcher): void
    // {
    //     if(!eventDispatcher) return;

    //     eventDispatcher.addEventListener(RoomWidgetRoomObjectUpdateEvent.OBJECT_SELECTED, this.objectSelectedHandler.bind(this));
    //     eventDispatcher.addEventListener(RoomWidgetRoomObjectUpdateEvent.OBJECT_DESELECTED, this.objectDeselectedHandler.bind(this));
    //     eventDispatcher.addEventListener(RoomWidgetRoomObjectUpdateEvent.USER_REMOVED, this.objectRemovedHandler.bind(this));
    //     eventDispatcher.addEventListener(RoomWidgetRoomObjectUpdateEvent.FURNI_REMOVED, this.objectRemovedHandler.bind(this));
    //     eventDispatcher.addEventListener(RoomWidgetUserInfostandUpdateEvent.OWN_USER, this.userInfostandUpdateHandler.bind(this));
    //     eventDispatcher.addEventListener(RoomWidgetUserInfostandUpdateEvent.PEER, this.userInfostandUpdateHandler.bind(this));
    //     eventDispatcher.addEventListener(RoomWidgetUserInfostandUpdateEvent.BOT, this.userInfostandUpdateHandler.bind(this));
    //     eventDispatcher.addEventListener(RoomWidgetFurniInfostandUpdateEvent.FURNI, this.furniInfostandUpdateHandler.bind(this));
        
    //     super.registerUpdateEvents(eventDispatcher);
    // }

    // public unregisterUpdateEvents(eventDispatcher: IEventDispatcher): void
    // {
    //     if(!eventDispatcher) return;

    //     eventDispatcher.removeEventListener(RoomWidgetRoomObjectUpdateEvent.OBJECT_SELECTED, this.objectSelectedHandler.bind(this));
    //     eventDispatcher.removeEventListener(RoomWidgetRoomObjectUpdateEvent.OBJECT_DESELECTED, this.objectDeselectedHandler.bind(this));
    //     eventDispatcher.removeEventListener(RoomWidgetRoomObjectUpdateEvent.USER_REMOVED, this.objectRemovedHandler.bind(this));
    //     eventDispatcher.removeEventListener(RoomWidgetRoomObjectUpdateEvent.FURNI_REMOVED, this.objectRemovedHandler.bind(this));
    //     eventDispatcher.removeEventListener(RoomWidgetUserInfostandUpdateEvent.OWN_USER, this.userInfostandUpdateHandler.bind(this));
    //     eventDispatcher.removeEventListener(RoomWidgetUserInfostandUpdateEvent.PEER, this.userInfostandUpdateHandler.bind(this));
    //     eventDispatcher.removeEventListener(RoomWidgetUserInfostandUpdateEvent.BOT, this.userInfostandUpdateHandler.bind(this));
    //     eventDispatcher.removeEventListener(RoomWidgetFurniInfostandUpdateEvent.FURNI, this.furniInfostandUpdateHandler.bind(this));

    //     super.unregisterUpdateEvents(eventDispatcher);
    // }

    // public close(): void
    // {
    //     this.hideAllInfoStands();
    // }

    // private objectSelectedHandler(k: RoomWidgetRoomObjectUpdateEvent): void
    // {
    //     this.messageListener.processWidgetMessage(new RoomWidgetRoomObjectMessage(RoomWidgetRoomObjectMessage.GET_OBJECT_INFO, k.id, k.category));
    // }

    // private objectDeselectedHandler(k: RoomWidgetRoomObjectUpdateEvent): void
    // {
    //     this.close();

    //     // if (this._updateTimer)
    //     // {
    //     //     this._updateTimer.stop();
    //     // }
    // }

    // private objectRemovedHandler(event: RoomWidgetRoomObjectUpdateEvent): void
    // {
    //     let remove = false;
    //     switch (event.type)
    //     {
    //         case RoomWidgetRoomObjectUpdateEvent.FURNI_REMOVED:
    //             if(this._furniView && this._furniView.window && (this._furniView.window.style.display !== 'none'))
    //             {
    //                 remove = (event.id === this._furniData.id);
                    
    //                 break;
    //             }
    //             break;
    //         case RoomWidgetRoomObjectUpdateEvent.USER_REMOVED:
    //             if(this._userView && this._userView.window && (this._userView.window.style.display !== 'none'))
    //             {
    //                 remove = (event.id === this._userData._Str_3313);

    //                 break;
    //             }
    //             // if ((((!(this._petView == null)) && (!(this._petView.window == null))) && (this._petView.window.visible)))
    //             // {
    //             //     _local_2 = (k.id == this._petData._Str_2707);
    //             //     break;
    //             // }
    //             // if ((((!(this._botView == null)) && (!(this._botView.window == null))) && (this._botView.window.visible)))
    //             // {
    //             //     _local_2 = (k.id == this._userData._Str_3313);
    //             //     break;
    //             // }
    //             // if ((((!(this._rentableBotView == null)) && (!(this._rentableBotView.window == null))) && (this._rentableBotView.window.visible)))
    //             // {
    //             //     _local_2 = (k.id == this._rentableBotdata._Str_3313);
    //             //     break;
    //             // }
    //             break;
    //     }

    //     if(remove) this.close();
    // }
}