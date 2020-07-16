import { NitroEvent } from '../../../core/events/NitroEvent';
import { RoomObjectCategory } from '../../room/object/RoomObjectCategory';
import { RoomObjectVariable } from '../../room/object/RoomObjectVariable';
import { IRoomWidgetHandler } from '../IRoomWidgetHandler';
import { IRoomWidgetHandlerContainer } from '../IRoomWidgetHandlerContainer';
import { RoomWidgetEnum } from '../widget/enums/RoomWidgetEnum';
import { RoomWidgetChooserContentEvent } from '../widget/events/RoomWidgetChooserContentEvent';
import { RoomWidgetUpdateEvent } from '../widget/events/RoomWidgetUpdateEvent';
import { _Str_3405 } from '../widget/events/_Str_3405';
import { RoomWidgetMessage } from '../widget/messages/RoomWidgetMessage';
import { RoomWidgetRequestWidgetMessage } from '../widget/messages/RoomWidgetRequestWidgetMessage';
import { RoomWidgetRoomObjectMessage } from '../widget/messages/RoomWidgetRoomObjectMessage';

export class FurniChooserWidgetHandler implements IRoomWidgetHandler
{
    private _container: IRoomWidgetHandlerContainer;
    private _isDisposed: boolean;

    public dispose(): void
    {
        this._container     = null;
        this._isDisposed    = true;
    }

    public processWidgetMessage(k: RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        if(!k) return null;

        switch (k.type)
        {
            case RoomWidgetRequestWidgetMessage.RWRWM_FURNI_CHOOSER:
                this._Str_23467();
                break;
            case RoomWidgetRoomObjectMessage.SELECT_OBJECT:
                const selectedMessage = (k as RoomWidgetRoomObjectMessage);

                if((selectedMessage.category === RoomObjectCategory.FLOOR) || (selectedMessage.category === RoomObjectCategory.WALL))
                {
                    this._container.roomEngine.selectRoomObject(this._container.roomSession.roomId, selectedMessage.id, selectedMessage.category);
                }
                break;
        }
        return null;
    }

    public processEvent(k: NitroEvent): void
    {
    }

    public update(): void
    {
    }

    private _Str_23467(): void
    {
        if(!this._container || !this._container.roomSession || !this._container.roomSession.userDataManager || !this._container.roomEngine) return;

        const roomId                        = this._container.roomSession.roomId;
        const chooserObjects: _Str_3405[]   = [];

        const totalFloorObjects = this._container.roomEngine.getTotalObjectsForManager(roomId, RoomObjectCategory.FLOOR);

        let i = 0;

        while(i < totalFloorObjects)
        {
            const roomObject = this._container.roomEngine.getRoomObject(roomId, i, RoomObjectCategory.FLOOR);

            if(roomObject)
            {
                let name: string = null;

                const typeId = (roomObject.model.getValue(RoomObjectVariable.FURNITURE_TYPE_ID) as number);
                const furniData = this._container.sessionDataManager.getFloorItemData(typeId);

                if(furniData && (furniData.name.length > 0))
                {
                    name = furniData.name;
                }
                else
                {
                    name = roomObject.type;
                }

                chooserObjects.push(new _Str_3405(roomObject.id, RoomObjectCategory.FLOOR, name));
            }

            i++;
        }

        const totalWallObjects = this._container.roomEngine.getTotalObjectsForManager(roomId, RoomObjectCategory.WALL);

        i = 0;

        while(i < totalWallObjects)
        {
            const roomObject = this._container.roomEngine.getRoomObject(roomId, i, RoomObjectCategory.WALL);

            if(roomObject)
            {
                let name: string = null;

                const type = roomObject.type;

                if(type.indexOf('poster') === 0)
                {
                    //_local_10 = int(_local_9.replace('poster', ''));
                    //_local_6 = this._container.localization.getLocalization((('poster_' + _local_10) + '_name'), (('poster_' + _local_10) + '_name'));
                }
                else
                {
                    const typeId = (roomObject.model.getValue(RoomObjectVariable.FURNITURE_TYPE_ID) as number);
                    const furniData = this._container.sessionDataManager.getWallItemData(typeId);

                    if(furniData && (furniData.name.length > 0))
                    {
                        name = furniData.name;
                    }
                    else
                    {
                        name = type;
                    }
                }

                chooserObjects.push(new _Str_3405(roomObject.id, RoomObjectCategory.WALL, name));
            }

            i++;
        }

        chooserObjects.sort(this._Str_16552.bind(this));

        this._container.events.dispatchEvent(new RoomWidgetChooserContentEvent(RoomWidgetChooserContentEvent.RWCCE_FURNI_CHOOSER_CONTENT, chooserObjects, this._container.sessionDataManager.isModerator));
    }

    private _Str_16552(k: _Str_3405, _arg_2: _Str_3405): number
    {
        if(!k || !_arg_2 || (k.name === _arg_2.name) || (k.name.length === 0) || (_arg_2.name.length === 0)) return 1;

        const _local_3 = new Array(k.name.toUpperCase(), _arg_2.name.toUpperCase()).sort();

        if(_local_3.indexOf(k.name.toUpperCase()) === 0) return -1;

        return 1;
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
        return [ RoomWidgetRequestWidgetMessage.RWRWM_FURNI_CHOOSER, RoomWidgetRoomObjectMessage.SELECT_OBJECT ];
    }

    public get eventTypes(): string[]
    {
        return [];
    }
}