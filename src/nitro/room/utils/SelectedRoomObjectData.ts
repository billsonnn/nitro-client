import { IRoomObjectController } from '../../../room/object/IRoomObjectController';

export class SelectedRoomObjectData
{
    private _object: IRoomObjectController;
    private _operation: string;

    constructor(object: IRoomObjectController, operation: string)
    {
        this._object    = object;
        this._operation = operation;
    }

    public dispose(): void
    {
        return;
    }

    public get object(): IRoomObjectController
    {
        return this._object;
    }

    public get operation(): string
    {
        return this._operation;
    }
}