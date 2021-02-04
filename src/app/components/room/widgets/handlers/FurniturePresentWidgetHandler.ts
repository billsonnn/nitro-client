import { NitroEvent } from '../../../../../client/core/events/NitroEvent';
import { Nitro } from '../../../../../client/nitro/Nitro';
import { RoomObjectCategory } from '../../../../../client/nitro/room/object/RoomObjectCategory';
import { RoomObjectVariable } from '../../../../../client/nitro/room/object/RoomObjectVariable';
import { IRoomWidgetHandler } from '../../../../../client/nitro/ui/IRoomWidgetHandler';
import { IRoomWidgetHandlerContainer } from '../../../../../client/nitro/ui/IRoomWidgetHandlerContainer';
import { RoomWidgetEnum } from '../../../../../client/nitro/ui/widget/enums/RoomWidgetEnum';
import { RoomWidgetUpdateEvent } from '../../../../../client/nitro/ui/widget/events/RoomWidgetUpdateEvent';
import { RoomWidgetMessage } from '../../../../../client/nitro/ui/widget/messages/RoomWidgetMessage';
import * as sorting from '../../../../../utils/sorting';
import { RoomObjectItem } from '../events/RoomObjectItem';
import { RoomWidgetChooserContentEvent } from '../events/RoomWidgetChooserContentEvent';
import { RoomWidgetRequestWidgetMessage } from '../messages/RoomWidgetRequestWidgetMessage';
import { RoomWidgetRoomObjectMessage } from '../messages/RoomWidgetRoomObjectMessage';
import { RoomWidgetFurniToWidgetMessage } from '../messages/RoomWidgetFurniToWidgetMessage';
import { RoomWidgetPresentOpenMessage } from '../messages/RoomWidgetPresentOpenMessage';
import { Vector3d } from '../../../../../client/room/utils/Vector3d';
import { RoomWidgetPresentDataUpdateEvent } from '../events/RoomWidgetPresentDataUpdateEvent';
import { RoomSessionPresentEvent } from '../../../../../client/nitro/session/events/RoomSessionPresentEvent';
import { ProductTypeEnum } from '../../../catalog/enums/ProductTypeEnum';
import { IFurnitureData } from '../../../../../client/nitro/session/furniture/IFurnitureData';
import { IGetImageListener } from '../../../../../client/nitro/room/IGetImageListener';
import { PetFigureData } from '../../../../../client/nitro/avatar/pets/PetFigureData';
import { PetType } from '../../../../../client/nitro/avatar/pets/PetType';

export class FurniturePresentWidgetHandler implements IRoomWidgetHandler, IGetImageListener
{
    private static readonly FLOOR:string = 'floor';
    private static readonly WALLPAPER:string = 'wallpaper';
    private static readonly LANDSCAPE:string = 'landscape';
    private static readonly POSTER:string = 'poster';

    private _isDisposed: boolean = false;
    private _container: IRoomWidgetHandlerContainer = null;
    private _name: string;
    private _objectId: number = null;

    public dispose(): void
    {
        this._isDisposed = true;
        this._container = null;
    }

    public processWidgetMessage(k: RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        if(!k) return null;

        switch(k.type)
        {
            case RoomWidgetFurniToWidgetMessage.REQUEST_PRESENT: {
                const widgetMessage = <RoomWidgetFurniToWidgetMessage>k;
                if(!widgetMessage) return;

                const roomObject = this._container.roomEngine.getRoomObject(widgetMessage.roomId, widgetMessage.objectId, widgetMessage.category);
                if(!roomObject) return;

                const model = roomObject.model;
                if(!model) return;

                this._objectId = widgetMessage.objectId;

                let data = <string>model.getValue(RoomObjectVariable.FURNITURE_DATA);
                if(!data) data = '';

                const purchaserName = <string>model.getValue(RoomObjectVariable.FURNITURE_PURCHASER_NAME);
                const purchaserFigure = <string>model.getValue(RoomObjectVariable.FURNITURE_PURCHASER_FIGURE);
                const typeId = <string>model.getValue(RoomObjectVariable.FURNITURE_TYPE_ID);
                const extras = <string>model.getValue(RoomObjectVariable.FURNITURE_EXTRAS);

                const local11 = 32;
                const furniImage = this._container.roomEngine.getFurnitureFloorImage(Number.parseInt(typeId), new Vector3d(180), local11, null, 0, extras);
                this._container.events.dispatchEvent(new RoomWidgetPresentDataUpdateEvent(RoomWidgetPresentDataUpdateEvent.RWPDUE_PACKAGEINFO,
                    widgetMessage.objectId,
                    data,
                    this._container.isOwnerOfFurniture(roomObject),
                    furniImage.data,
                    purchaserName,
                    purchaserFigure
                ));

            }
                break;
            case RoomWidgetPresentOpenMessage.RWPOM_OPEN_PRESENT: {
                const openMessage = <RoomWidgetPresentOpenMessage>k;

                if(!openMessage) return;

                if(openMessage._Str_1577 != this._objectId) return null;

                if(!this._container) return null;

                this._container.roomSession.openGift(openMessage._Str_1577);

                this._container.roomEngine.changeObjectModelData(this._container.roomEngine.activeRoomId, openMessage._Str_1577, RoomObjectCategory.FLOOR, RoomObjectVariable.FURNITURE_DISABLE_PICKING_ANIMATION, 1);
            }
                break;

        }

        return null;
    }

    public processEvent(event: NitroEvent): void
    {
        if(!event || !this._container || !this._container.events) return;

        switch(event.type)
        {
            case RoomSessionPresentEvent.RSPE_PRESENT_OPENED: {

                if(!(event instanceof RoomSessionPresentEvent)) return;

                const sessionEvent = <RoomSessionPresentEvent>event;
                let local4 = null;
                let local7;
                let local3: IFurnitureData = null;

                if(sessionEvent._Str_2887 == ProductTypeEnum.FLOOR)
                {
                    local3 = this._container.sessionDataManager.getFloorItemData(sessionEvent.classId);
                }
                else if(sessionEvent._Str_2887 == ProductTypeEnum.WALL)
                {
                    local3 = this._container.sessionDataManager.getWallItemData(sessionEvent.classId);
                }

                let local6 = false;

                if(event._Str_4057)
                {
                    const local8 = this._container.roomEngine.getRoomObject(this._container.roomSession.roomId, event.placedItemId, RoomObjectCategory.FLOOR);
                    if(local8) local6 = this._container.isOwnerOfFurniture(local8);
                }

                let local5:RoomWidgetPresentDataUpdateEvent = null;
                switch(sessionEvent._Str_2887)
                {
                    case ProductTypeEnum.WALL: {
                        if(local3)
                        {
                            switch(local3.className)
                            {
                                case FurniturePresentWidgetHandler.FLOOR:
                                    local5 = new RoomWidgetPresentDataUpdateEvent(RoomWidgetPresentDataUpdateEvent.RWPDUE_CONTENTS_FLOOR,
                                        0, Nitro.instance.localization.getValue('inventory.furni.item.floor.name'), local6, null);
                                    break;
                                case FurniturePresentWidgetHandler.LANDSCAPE:
                                    local5 = new RoomWidgetPresentDataUpdateEvent(RoomWidgetPresentDataUpdateEvent.RWPDUE_CONTENTS_LANDSCAPE,
                                        0, Nitro.instance.localization.getValue('inventory.furni.item.landscape.name'), local6, null);
                                    break;
                                case FurniturePresentWidgetHandler.WALLPAPER:
                                    local5 = new RoomWidgetPresentDataUpdateEvent(RoomWidgetPresentDataUpdateEvent.RWPDUE_CONTENTS_WALLPAPER,
                                        0, Nitro.instance.localization.getValue('inventory.furni.item.wallpaper.name'), local6, null);
                                    break;
                                case FurniturePresentWidgetHandler.POSTER: {
                                    const local9 = sessionEvent.productCode;
                                    let local10= null;
                                    let local11;
                                    if(local9.indexOf('poster') == 0)
                                    {
                                        local11 = Number.parseInt(local9.replace('poster', ''));
                                        local10 = <string>local11;
                                    }

                                    local4 = this._container.roomEngine.getFurnitureWallIcon(sessionEvent.classId, this, local10);
                                    local7 = this._container.sessionDataManager.getWallItemData(local11); // was local9
                                    if(local7)
                                    {
                                        this._name = local7.name;
                                    }
                                    else
                                    {
                                        if(local3)
                                        {
                                            this._name = local3.name;
                                        }
                                    }

                                    if(local4)
                                    {
                                        local5 = new RoomWidgetPresentDataUpdateEvent(RoomWidgetPresentDataUpdateEvent.RWPDUE_CONTENTS, 0, this._name, local6,local4.data);
                                    }
                                }
                                    break;
                                default: {
                                    local4 = this._container.roomEngine.getFurnitureWallIcon(sessionEvent.classId, this);
                                    if(local3)
                                    {
                                        this._name = local3.name;
                                    }
                                    if(local4)
                                    {
                                        local5 = new RoomWidgetPresentDataUpdateEvent(RoomWidgetPresentDataUpdateEvent.RWPDUE_CONTENTS, 0, this._name, local6, local4.data);
                                    }
                                }
                                    break;
                            }
                        }
                    }
                        break;
                    case ProductTypeEnum.HABBO_CLUB:
                        local5 = new RoomWidgetPresentDataUpdateEvent(RoomWidgetPresentDataUpdateEvent.RWPDUE_CONTENTS_CLUB,
                            0, Nitro.instance.localization.getValue('widget.furni.present.hc'), false, null);
                        break;
                    default: {
                        if(sessionEvent.placedItemType == ProductTypeEnum.PET)
                        {
                            const petfigureString = sessionEvent.petFigureString;
                            if(petfigureString && petfigureString.trim().length > 0)
                            {
                                const petFigureData = new PetFigureData(petfigureString);
                                const local14 = 2;
                                let local15 = 64;
                                if(petFigureData.typeId == PetType.HORSE)
                                {
                                    local15 = 32;
                                }
                                const petImage = this._container.roomEngine.getRoomObjectPetImage(petFigureData.typeId, petFigureData.paletteId, petFigureData.color,
                                    new Vector3d(local14 * 45), local15, this, true, 0, petFigureData.customParts);

                                if(petImage)
                                {
                                    local4 = petImage;
                                }

                            }
                        }

                        if(!local4)
                        {
                            local4 = this._container.roomEngine.getFurnitureFloorImage(sessionEvent.classId, new Vector3d(90), 64, this);
                        }

                        local7 = this._container.sessionDataManager.getFloorItemData(sessionEvent.classId);

                        if(local7)
                        {
                            this._name = local7.name;
                        }
                        else
                        {
                            if(local3)
                            {
                                this._name = local3.name;
                            }
                        }

                        if(local4)
                        {
                            local5 =  new RoomWidgetPresentDataUpdateEvent(RoomWidgetPresentDataUpdateEvent.RWPDUE_CONTENTS,0, this._name, local6, local4.data);
                        }
                    }
                        break;
                }

                if(local5)
                {
                    local5.classId = sessionEvent.classId;
                    local5._Str_2887 = sessionEvent._Str_2887;
                    local5.placedItemId = sessionEvent.placedItemId;
                    local5._Str_4057 = sessionEvent._Str_4057;
                    local5.placedItemType = sessionEvent.placedItemType;
                    this._container.events.dispatchEvent(local5);
                }
            }
                break;

        }
    }

    public update(): void
    {
    }


    public get disposed(): boolean
    {
        return this._isDisposed;
    }

    public get type(): string
    {
        return RoomWidgetEnum.FURNI_PRESENT_WIDGET;
    }

    public set container(k: IRoomWidgetHandlerContainer)
    {
        this._container = k;
    }

    public get messageTypes(): string[]
    {
        return [
            RoomWidgetFurniToWidgetMessage.REQUEST_PRESENT,
            RoomWidgetPresentOpenMessage.RWPOM_OPEN_PRESENT
        ];
    }

    public get eventTypes(): string[]
    {
        return [
            RoomSessionPresentEvent.RSPE_PRESENT_OPENED
        ];
    }

    imageFailed(id: number): void
    {
    }

    imageReady(id: number, texture: PIXI.Texture, image?: HTMLImageElement): void
    {
    }
}
