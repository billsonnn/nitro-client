import { Component } from '@angular/core';
import { RoomControllerLevel } from '../../../../../../../client/nitro/session/enum/RoomControllerLevel';
import { RoomWidgetEnumItemExtradataParameter } from '../../../../../../../client/nitro/ui/widget/enums/RoomWidgetEnumItemExtradataParameter';
import { RoomWidgetFurniInfoUsagePolicyEnum } from '../../../../../../../client/nitro/ui/widget/enums/RoomWidgetFurniInfoUsagePolicyEnum';
import { RoomWidgetFurniInfostandUpdateEvent } from '../../../events/RoomWidgetFurniInfostandUpdateEvent';
import { RoomWidgetFurniActionMessage } from '../../../messages/RoomWidgetFurniActionMessage';
import { InfoStandFurniData } from '../../data/InfoStandFurniData';
import { InfoStandType } from '../../InfoStandType';
import { RoomInfoStandBaseComponent } from '../base/base.component';
import { MapDataType } from '../../../../../../../client/nitro/room/object/data/type/MapDataType';
import { FurnitureRoomBrandingLogic } from '../../../../../../../client/nitro/room/object/logic/furniture/FurnitureRoomBrandingLogic';

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
    public isGodMode: boolean = false;

    public furniSettings: SettingsRow[] = [];

    public update(event: RoomWidgetFurniInfostandUpdateEvent): void
    {
        let canMove     = false;
        let canRotate   = false;
        let canUse      = false;

        if((event.roomControllerLevel >= RoomControllerLevel.GUEST) || event.isOwner || event.isRoomOwner || event.isAnyRoomOwner)
        {
            canMove     = true;
            canRotate   = (!event.isWallItem);
        }

        const isValidController = (event.roomControllerLevel >= RoomControllerLevel.GUEST);

        if((((event.usagePolicy === RoomWidgetFurniInfoUsagePolicyEnum._Str_18353) || ((event.usagePolicy === RoomWidgetFurniInfoUsagePolicyEnum._Str_18194) && isValidController)) || ((event.extraParam === RoomWidgetEnumItemExtradataParameter.JUKEBOX) && isValidController)) || ((event.extraParam == RoomWidgetEnumItemExtradataParameter.USABLE_PRODUCT) && isValidController))
        {
            canUse = true;
        }

        if(event.isGodMode && event.stuffData instanceof MapDataType)
        {
            const mappedData = <MapDataType> event.stuffData;

            const localSettings = [];
            const adSettings =
            [
                FurnitureRoomBrandingLogic.IMAGEURL_KEY,
                FurnitureRoomBrandingLogic.OFFSETX_KEY,
                FurnitureRoomBrandingLogic.OFFSETY_KEY,
                FurnitureRoomBrandingLogic.OFFSETZ_KEY
            ];

            adSettings.forEach(function(item)
            {
                const value = mappedData.getValue(item);

                if(value)
                {
                    localSettings.push({ name: item, value });
                }
            });

            this.furniSettings = localSettings;
        }

        this.isGodMode  = event.isGodMode;
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

    // see _Str_2608
    public processButtonAction(action: string): void
    {
        if(!action || (action === '')) return;

        let messageType: string = null;

        let objectData = null;

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
            case 'save_branding_configuration':
                messageType = RoomWidgetFurniActionMessage.RWFAM_SAVE_STUFF_DATA;
                objectData = this.getConfig();
                break;

        }

        if(!messageType) return;

        this.widget.messageListener.processWidgetMessage(new RoomWidgetFurniActionMessage(messageType, this.furniData.id, this.furniData.category, this.furniData.purchaseOfferId, objectData));
    }

    private getConfig(): string
    {
        const settings = this.furniSettings;
        let content = '';
        for(let index = 0; index < settings.length; index++ )
        {
            const setting = settings[index];
            let { name, value } = setting;
            name = name.replace('\t', '');
            value = value.replace('\t', '');
            content = content + name + '=' + value + '\t';
        }
        return content;
    }

    public get type(): number
    {
        return InfoStandType.FURNI;
    }
}

export interface SettingsRow {
    name: string;
    value: string;
}
