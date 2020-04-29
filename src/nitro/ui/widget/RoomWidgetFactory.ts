import { IRoomWidgetFactory } from '../IRoomWidgetFactory';
import { IRoomWidgetHandler } from '../IRoomWidgetHandler';
import { RoomUI } from '../RoomUI';
import { RoomWidgetEnum } from './enums/RoomWidgetEnum';
import { TrophyFurniWidget } from './furniture/trophy/TrophyFurniWidget';
import { IRoomWidget } from './IRoomWidget';

export class RoomWidgetFactory implements IRoomWidgetFactory
{
    private _roomUI: RoomUI;

    constructor(roomUI: RoomUI)
    {
        this._roomUI = roomUI;
    }

    public dispose(): void
    {
        this._roomUI = null;
    }

    public createWidget(type: string, handler: IRoomWidgetHandler): IRoomWidget
    {
        switch(type)
        {
            case RoomWidgetEnum.FURNI_TROPHY_WIDGET:
                return new TrophyFurniWidget(handler, this._roomUI.windowManager);
        }

        return null;
    }
}