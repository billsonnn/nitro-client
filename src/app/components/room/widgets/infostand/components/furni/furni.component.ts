import { Component } from '@angular/core';
import { Nitro } from '../../../../../../../client/nitro/Nitro';
import { RoomControllerLevel } from '../../../../../../../client/nitro/session/enum/RoomControllerLevel';
import { RoomWidgetEnumItemExtradataParameter } from '../../../../../../../client/nitro/ui/widget/enums/RoomWidgetEnumItemExtradataParameter';
import { RoomWidgetFurniInfoUsagePolicyEnum } from '../../../../../../../client/nitro/ui/widget/enums/RoomWidgetFurniInfoUsagePolicyEnum';
import { RoomWidgetFurniInfostandUpdateEvent } from '../../../events/RoomWidgetFurniInfostandUpdateEvent';
import { RoomWidgetFurniActionMessage } from '../../../messages/RoomWidgetFurniActionMessage';
import { InfoStandFurniData } from '../../data/InfoStandFurniData';
import { InfoStandType } from '../../InfoStandType';
import { RoomInfoStandBaseComponent } from '../base/base.component';

@Component({
	templateUrl: './furni.template.html'
})
export class RoomInfoStandFurniComponent extends RoomInfoStandBaseComponent
{
    private static PICKUP_MODE_NONE: number     = 0;
    private static PICKUP_MODE_EJECT: number    = 1;
    private static PICKUP_MODE_FULL: number     = 2;

    public furniData: InfoStandFurniData = null;

    public pickupMode   = 0;
    public canMove      = false;
    public canRotate    = false;
    public canUse       = false;
    public updateCount  = 0;

    public update(event: RoomWidgetFurniInfostandUpdateEvent): void
    {
        Nitro.instance.localization.registerParameter('furni.owner', 'name', this.furniData.ownerName);
        
        let canMove     = false;
        let canRotate   = false;
        let canUse      = false;

        if((event.roomControllerLevel >= RoomControllerLevel.GUEST) || event.isOwner || event.isRoomOwner || event.isAnyRoomOwner)
        {
            canMove     = true;
            canRotate   = (!event.isWallItem);
        }
        
        let isValidController = (event.roomControllerLevel >= RoomControllerLevel.GUEST);

        if((((event.usagePolicy === RoomWidgetFurniInfoUsagePolicyEnum._Str_18353) || ((event.usagePolicy === RoomWidgetFurniInfoUsagePolicyEnum._Str_18194) && isValidController)) || ((event.extraParam === RoomWidgetEnumItemExtradataParameter.JUKEBOX) && isValidController)) || ((event.extraParam == RoomWidgetEnumItemExtradataParameter.USABLE_PRODUCT) && isValidController))
        {
            canUse = true;
        }

        this.canMove    = canMove;
        this.canRotate  = canRotate;
        this.canUse     = canUse;

        this.togglePickupButton(event);

        this.updateCount++;
    }

    private togglePickupButton(event: RoomWidgetFurniInfostandUpdateEvent): void
    {
        if(!event) return;

        this.pickupMode = RoomInfoStandFurniComponent.PICKUP_MODE_NONE;

        if(event.isOwner || event.isAnyRoomOwner)
        {
            this.pickupMode = RoomInfoStandFurniComponent.PICKUP_MODE_FULL;
        }

        else if(event.isRoomOwner || (event.roomControllerLevel >= RoomControllerLevel.GUILD_ADMIN))
        {
            this.pickupMode = RoomInfoStandFurniComponent.PICKUP_MODE_EJECT;
        }

        if(event.isStickie) this.pickupMode = RoomInfoStandFurniComponent.PICKUP_MODE_NONE;
    }

    public processButtonAction(action: string): void
    {
        if(!action || (action === '')) return;

        let messageType: string = null;

        switch(action)
        {
            case 'move':
                messageType = RoomWidgetFurniActionMessage.RWFAM_MOVE;
                break;
            case 'rotate':
                messageType = RoomWidgetFurniActionMessage.RWFUAM_ROTATE;
                break;
            case 'pickup':
                if(this.pickupMode === RoomInfoStandFurniComponent.PICKUP_MODE_FULL)
                {
                    messageType = RoomWidgetFurniActionMessage.RWFAM_PICKUP;
                }
                else
                {
                    messageType = RoomWidgetFurniActionMessage.RWFAM_EJECT;
                }
                break;
            case 'use':
                messageType = RoomWidgetFurniActionMessage.RWFAM_USE;
                break;
        }

        if(!messageType) return;

        this.widget.messageListener.processWidgetMessage(new RoomWidgetFurniActionMessage(messageType, this.furniData.id, this.furniData.category, this.furniData.purchaseOfferId, null));
    }

    public get type(): number
    {
        return InfoStandType.FURNI;
    }
}