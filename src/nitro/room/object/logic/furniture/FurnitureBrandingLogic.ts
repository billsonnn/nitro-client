import { RoomObjectUpdateMessage } from '../../../../../room/messages/RoomObjectUpdateMessage';
import { ObjectAdUpdateMessage } from '../../../messages/ObjectAdUpdateMessage';
import { ObjectDataUpdateMessage } from '../../../messages/ObjectDataUpdateMessage';
import { MapDataType } from '../../data/type/MapDataType';
import { RoomObjectModelKey } from '../../RoomObjectModelKey';
import { FurnitureLogic } from './FurnitureLogic';

export class FurnitureBrandingLogic extends FurnitureLogic
{
    public static IMAGEURL_KEY: string  = 'imageUrl';
    public static CLICKURL_KEY: string  = 'clickUrl';
    public static OFFSETX_KEY: string   = 'offsetX';
    public static OFFSETY_KEY: string   = 'offsetY';
    public static OFFSETZ_KEY: string   = 'offsetZ';

    public processUpdateMessage(message: RoomObjectUpdateMessage): void
    {
        super.processUpdateMessage(message);

        if(message instanceof ObjectDataUpdateMessage) this.processAdDataUpdate(message);

        if(message instanceof ObjectAdUpdateMessage) this.processAdUpdate(message);
    }

    private processAdDataUpdate(message: ObjectDataUpdateMessage): void
    {
        if(!message) return;

        const objectData = new MapDataType();

        objectData.initializeFromRoomObjectModel(this.object.model);

        const imageUrl = objectData.getValue(FurnitureBrandingLogic.IMAGEURL_KEY);

        if(imageUrl)
        {
            const existingUrl = this.object.model.getValue(RoomObjectModelKey.FURNITURE_BRANDING_IMAGE_URL);

            if(!existingUrl || existingUrl !== imageUrl)
            {
                this.object.model.setValue(RoomObjectModelKey.FURNITURE_BRANDING_IMAGE_URL, imageUrl);
                this.object.model.setValue(RoomObjectModelKey.FURNITURE_BRANDING_IMAGE_STATUS, 0);
            }
        }

        const clickUrl = objectData.getValue(FurnitureBrandingLogic.CLICKURL_KEY);

        if(clickUrl)
        {
            const existingUrl = this.object.model.getValue(RoomObjectModelKey.FURNITURE_BRANDING_URL);

            if(!existingUrl || existingUrl !== clickUrl)
            {
                this.object.model.setValue(RoomObjectModelKey.FURNITURE_BRANDING_URL, clickUrl);
            }
        }
    }

    private processAdUpdate(message: ObjectAdUpdateMessage): void
    {
        if(!message) return;

        switch(message.type)
        {
            case ObjectAdUpdateMessage.IMAGE_LOADED:
                this.object.model.setValue(RoomObjectModelKey.FURNITURE_BRANDING_IMAGE_STATUS, 1);
                break;
            case ObjectAdUpdateMessage.IMAGE_LOADING_FAILED:
                this.object.model.setValue(RoomObjectModelKey.FURNITURE_BRANDING_IMAGE_STATUS, -1);
                break;
        }
    }
}