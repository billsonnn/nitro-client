import { RoomControllerLevel } from '../../../session/enum/RoomControllerLevel';
import { WindowTemplates } from '../../../window/WindowTemplates';
import { MouseEventType } from '../../MouseEventType';
import { RoomWidgetEnumItemExtradataParameter } from '../enums/RoomWidgetEnumItemExtradataParameter';
import { RoomWidgetFurniInfoUsagePolicyEnum } from '../enums/RoomWidgetFurniInfoUsagePolicyEnum';
import { RoomWidgetFurniInfostandUpdateEvent } from '../events/RoomWidgetFurniInfostandUpdateEvent';
import { RoomWidgetFurniActionMessage } from '../messages/RoomWidgetFurniActionMessage';
import { RoomWidgetMessage } from '../messages/RoomWidgetMessage';
import { InfoStandWidget } from './InfoStandWidget';

export class InfoStandFurniView 
{
    private _widget: InfoStandWidget;
    private _window: HTMLElement;

    constructor(k: InfoStandWidget, _arg_2: string)
    {
        this._widget    = k;
        this._window    = null;

        this.createWindow(_arg_2);
    }

    public dispose(): void
    {
        if(this._window)
        {
            if(this._window.parentElement) this._window.parentElement.removeChild(this._window);

            this._window = null;
        }

        this._widget = null;
    }

    public get window(): HTMLElement
    {
        return this._window;
    }

    protected updateWindow(): void
    {
        
    }

    protected createWindow(k: string): void
    {
        this._window = this._widget.windowManager.renderElement(this.getTemplate(), {});

        this._window.style.display = 'none';

        if(this._widget.mainContainer) this._widget.mainContainer.appendChild(this._window);

        const closeElement = (this._window.querySelector('[data-tag="close"]') as HTMLElement);

        if(closeElement)
        {
            closeElement.onclick = event => this.onCloseHandler(event);
        }

        const buttonContainer = (this._window.querySelector('[data-tag="buttons"]') as HTMLElement);

        if(buttonContainer)
        {
            buttonContainer.onclick = event => this.onButtonHandler(event);
        }
    }

    private onCloseHandler(k: MouseEvent): void
    {
        this._widget.close();
    }

    private onButtonHandler(event: MouseEvent): void
    {
        if(!event || !this._window) return;

        let message: RoomWidgetMessage  = null;
        let messageType: string         = null;
        let data: string                = null;
        let hideMenu: boolean           = false;

        if(event.type === MouseEventType.MOUSE_CLICK)
        {
            const target = (event.target as HTMLElement);

            if(target)
            {
                const tag = target.getAttribute('data-tag');

                if(tag && (tag !== ''))
                {
                    switch(tag)
                    {
                        case 'move':
                            messageType = RoomWidgetFurniActionMessage.RWFAM_MOVE;
                            break;
                        case 'rotate':
                            messageType = RoomWidgetFurniActionMessage.RWFUAM_ROTATE;
                            break;
                        case 'pickup':
                            messageType = RoomWidgetFurniActionMessage.RWFAM_PICKUP;
                            break;
                        case 'use':
                            messageType = RoomWidgetFurniActionMessage.RWFAM_USE;
                            break;
                    }
                }
            }

            if(messageType)
            {
                message = new RoomWidgetFurniActionMessage(messageType, this._widget.furniData.id, this._widget.furniData.category, this._widget.furniData.purchaseOfferId, data);
            }

            if(message)
            {
                this._widget.messageListener.processWidgetMessage(message);
            }
        }
    }

    public update(event: RoomWidgetFurniInfostandUpdateEvent): void
    {
        this.name           = event.name;
        this.description    = event.description;
        this.image          = event.image;
        this.ownerName      = event.ownerName;

        let canMove     = false;
        let canRotate   = false;
        let canUse      = false;

        if((event.roomControllerLevel >= RoomControllerLevel.GUEST) || event.isOwner || event.isRoomOwner || event.isAnyRoomOwner)
        {
            canMove = true;
            canRotate = (!event.isWallItem);
        }
        
        let _local_6 = (event.roomControllerLevel >= RoomControllerLevel.GUEST);

        if((((event.usagePolicy === RoomWidgetFurniInfoUsagePolicyEnum._Str_18353) || ((event.usagePolicy === RoomWidgetFurniInfoUsagePolicyEnum._Str_18194) && _local_6)) || ((event.extraParam === RoomWidgetEnumItemExtradataParameter.JUKEBOX) && _local_6)) || ((event.extraParam == RoomWidgetEnumItemExtradataParameter.USABLE_PRODUCT) && _local_6))
        {
            canUse = true;
        }

        this.toggleButton('move', canMove);
        this.toggleButton('rotate', canRotate);
        this.toggleButton('use', canUse);

        this.togglePickupButton(event);

        // this._Str_24537(_local_4);
        // this._Str_22883((k.groupId > 0));
        // this._Str_22377(k._Str_3233, (k.expiration >= 0), (k._Str_3473 >= 0), (k._Str_3693 >= 0), k._Str_7629, k._Str_8116);
        // this._Str_22365((k.stuffData.uniqueSerialNumber > 0), k.stuffData);
        // this._Str_16559((k.stuffData.rarityLevel >= 0), k.stuffData);
        // this._Str_2374.visible = ((((_local_2) || (_local_3)) || (!(this._Str_5729 == this._Str_9953))) || (_local_5));
        // this._Str_25743();
    }

    private toggleButton(name: string, visible: boolean): void
    {
        if(!name) return;

        const button = (this._window.querySelector('[data-tag="' + name + '"]') as HTMLElement);

        if(button)
        {
            if(visible) button.style.display = 'inherit';
            else button.style.display = 'none';
        }
    }

    private togglePickupButton(event: RoomWidgetFurniInfostandUpdateEvent): void
    {
        let canPickup = false;

        if(event.isOwner || event.isRoomOwner || (event.roomControllerLevel >= RoomControllerLevel.GUILD_ADMIN))
        {
            canPickup = true;
        }

        if(canPickup) this.setPickupButtonText(event);

        this.toggleButton('pickup', canPickup);
    }

    private setPickupButtonText(event: RoomWidgetFurniInfostandUpdateEvent): void
    {
        const element = (this._window.querySelector('[data-tag="pickup"]') as HTMLElement);

        if(!element) return;

        if(event.isOwner)
        {
            element.innerText = 'pickup';
        }
        else
        {
            element.innerText = 'eject';
        }
    }

    private getTemplate(): string
    {
        return this._widget.windowManager.getTemplate(WindowTemplates.INFOSTAND_MENU_FURNI_VIEW);
    }

    private set name(value: string)
    {
        const element = (this._window.querySelector('[data-tag="name-text"]') as HTMLElement);

        if(!element) return;

        element.innerText = value;
    }

    private set description(value: string)
    {
        const element = (this._window.querySelector('[data-tag="desc-text"]') as HTMLElement);

        if(!element) return;

        element.innerText = value;
    }

    private set ownerName(value: string)
    {
        const element = (this._window.querySelector('[data-tag="owner-text"]') as HTMLElement);

        if(!element) return;

        element.innerText = value;
    }

    private set image(image: HTMLImageElement)
    {
        if(!image) return;
        
        const element = (this._window.querySelector('[data-tag="image"]'));

        if(element)
        {
            element.innerHTML = null;
            
            element.appendChild(image);
        }
    }
}