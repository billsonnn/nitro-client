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

export class UserChooserWidgetHandler implements IRoomWidgetHandler
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
            case RoomWidgetRequestWidgetMessage.RWRWM_USER_CHOOSER:
                this.processUserChooser();
                break;
            case RoomWidgetRoomObjectMessage.SELECT_OBJECT:
                this.selectUnit(k);
                break;
        }

        return null;
    }

    private selectUnit(k: RoomWidgetMessage): void
    {
        const event = k as RoomWidgetRoomObjectMessage;

        if(event == null) return;

        if(event.category == RoomObjectCategory.UNIT)
        {
            this._container.roomEngine.selectRoomObject(this._container.roomSession.roomId, event.id, event.category);
        }
    }

    private processUserChooser(): void
    {

        if(this._container == null || this._container.roomSession == null || this._container.roomEngine == null || this._container.roomSession.userDataManager == null) return;

        const roomId = this._container.roomSession.roomId;
        const categoryId = RoomObjectCategory.UNIT;
        const units = [];
        const unitObjectsCounts = this._container.roomEngine.getRoomObjectCount(roomId, categoryId);

        for(let index = 0; index < unitObjectsCounts; index++)
        {
            const unitObject = this._container.roomEngine.getRoomObjectByIndex(roomId, index, categoryId);

            if(unitObject == null) continue;

            const unitData = this._container.roomSession.userDataManager.getUserDataByIndex(unitObject.id);

            if(unitData == null) continue;

            units.push(new RoomObjectItem(unitData.roomIndex, categoryId, unitData.name));
        }

        units.sort(this.dynamicSort('name'));
        this._container.events.dispatchEvent(new RoomWidgetChooserContentEvent(RoomWidgetChooserContentEvent.RWCCE_USER_CHOOSER_CONTENT, units));
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
        return RoomWidgetEnum.USER_CHOOSER;
    }

    public set container(k: IRoomWidgetHandlerContainer)
    {
        this._container = k;
    }

    public get messageTypes(): string[]
    {
        return [
            RoomWidgetRequestWidgetMessage.RWRWM_USER_CHOOSER,
            RoomWidgetRoomObjectMessage.SELECT_OBJECT];
    }

    public get eventTypes(): string[]
    {
        return [];
    }
}
