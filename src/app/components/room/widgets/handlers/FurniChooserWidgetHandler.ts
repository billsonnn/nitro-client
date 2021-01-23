import { NitroEvent } from '../../../../../client/core/events/NitroEvent';
import { IRoomWidgetHandler } from '../../../../../client/nitro/ui/IRoomWidgetHandler';
import { IRoomWidgetHandlerContainer } from '../../../../../client/nitro/ui/IRoomWidgetHandlerContainer';
import { RoomWidgetEnum } from '../../../../../client/nitro/ui/widget/enums/RoomWidgetEnum';
import { RoomWidgetUpdateEvent } from '../../../../../client/nitro/ui/widget/events/RoomWidgetUpdateEvent';
import { RoomWidgetMessage } from '../../../../../client/nitro/ui/widget/messages/RoomWidgetMessage';
import { RoomWidgetRequestWidgetMessage } from '../messages/RoomWidgetRequestWidgetMessage';
import { RoomObjectCategory } from '../../../../../client/nitro/room/object/RoomObjectCategory';
import { RoomObjectVariable } from '../../../../../client/nitro/room/object/RoomObjectVariable';
import { RoomObjectItem } from '../events/RoomObjectItem';
import { Nitro } from '../../../../../client/nitro/Nitro';
import { RoomWidgetChooserContentEvent } from '../events/RoomWidgetChooserContentEvent';
import { RoomWidgetRoomObjectMessage } from '../messages/RoomWidgetRoomObjectMessage';

export class FurniChooserWidgetHandler implements IRoomWidgetHandler
{
    private _isDisposed: boolean = false;
    private _container: IRoomWidgetHandlerContainer = null;

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
            case RoomWidgetRequestWidgetMessage.RWRWM_FURNI_CHOOSER:
                this.processFurniChooser();
                break;
            case RoomWidgetRoomObjectMessage.SELECT_OBJECT:
                this.selectFurni(k);
                break;
        }

        return null;
    }

    private selectFurni(k: RoomWidgetMessage): void
    {
        const event = k as RoomWidgetRoomObjectMessage;

        if(event == null) return;

        if(event.category == RoomObjectCategory.WALL || event.category == RoomObjectCategory.FLOOR)
        {
            this._container.roomEngine.selectRoomObject(this._container.roomSession.roomId, event.id, event.category);
        }
    }

    private processFurniChooser(): void
    {

        if(this._container == null || this._container.roomSession == null || this._container.roomEngine == null || this._container.roomSession.userDataManager == null) return;

        const roomId = this._container.roomSession.roomId;
        const furniInRoom = [];

        this.processFloorFurni(roomId, furniInRoom);
        this.processWallFurni(roomId, furniInRoom);

        furniInRoom.sort(this.dynamicSort('name'));

        this._container.events.dispatchEvent(new RoomWidgetChooserContentEvent(RoomWidgetChooserContentEvent.RWCCE_FURNI_CHOOSER_CONTENT, furniInRoom, false));
    }

    private dynamicSort(property)
    {
        // Source: https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value
        let sortOrder = 1;
        if(property[0] === '-')
        {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a,b)
        {
            /* next line works with strings and numbers,
             * and you may want to customize it to your needs
             */
            const result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        };
    }

    private processWallFurni(roomId: number, furniInRoom: any[])
    {
        const objectsCount = this._container.roomEngine.getRoomObjectCount(roomId, RoomObjectCategory.WALL);
        for(let index = 0; index < objectsCount; index++)
        {
            const roomObject = this._container.roomEngine.getRoomObjectByIndex(roomId, index, RoomObjectCategory.WALL);

            if(roomObject == null) continue;

            const type = roomObject.type;
            let name = null;
            if(type.startsWith('poster'))
            {
                const posterNumber = Number.parseInt(type.replace('poster', ''));
                name = Nitro.instance.localization.getValue('poster_' + posterNumber + '_name');
            }
            else
            {
                const furniTypeId = Number.parseInt(roomObject.model.getValue(RoomObjectVariable.FURNITURE_TYPE_ID));
                const wallItemData = this._container.sessionDataManager.getWallItemData(furniTypeId);
                if(wallItemData != null && wallItemData.name.length > 0)
                {
                    name = wallItemData.name;
                }
                else
                {
                    name = type;
                }
            }

            furniInRoom.push(new RoomObjectItem(roomObject.id, RoomObjectCategory.WALL, name));

        }
    }

    private processFloorFurni(roomId: number, furniInRoom: RoomObjectItem[])
    {
        const roomObjectCounts = this._container.roomEngine.getRoomObjectCount(roomId, RoomObjectCategory.FLOOR);
        for(let index = 0; index < roomObjectCounts; index++)
        {
            const roomObject = this._container.roomEngine.getRoomObjectByIndex(roomId, index, RoomObjectCategory.FLOOR);

            if(roomObject == null) continue;

            const furniTypeId = Number.parseInt(roomObject.model.getValue(RoomObjectVariable.FURNITURE_TYPE_ID));
            const floorItemData = this._container.sessionDataManager.getFloorItemData(furniTypeId);
            const name = floorItemData != null ? floorItemData.name : roomObject.type;

            furniInRoom.push(new RoomObjectItem(roomObject.id, RoomObjectCategory.FLOOR, name));
        }
    }

    public processEvent(event: NitroEvent): void
    {

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
        return RoomWidgetEnum.FURNI_CHOOSER;
    }

    public set container(k: IRoomWidgetHandlerContainer)
    {
        this._container = k;
    }

    public get messageTypes(): string[]
    {
        return [
            RoomWidgetRequestWidgetMessage.RWRWM_FURNI_CHOOSER,
            RoomWidgetRoomObjectMessage.SELECT_OBJECT];
    }

    public get eventTypes(): string[]
    {
        return [];
    }
}
