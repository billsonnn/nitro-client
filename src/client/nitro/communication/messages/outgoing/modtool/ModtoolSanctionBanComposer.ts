import { IMessageComposer } from '../../../../../core/communication/messages/IMessageComposer';

export class ModtoolSanctionBanComposer implements IMessageComposer<any>
{
    private _data: any[] = [];

    constructor(k: number, arg2: string, arg3: number, arg4:number, arg5: boolean, arg6: number = -1)
    {
        this._data.push(k);
        this._data.push(arg2);
        this._data.push(arg3);
        this._data.push(arg4);
        this._data.push(arg5);
        if(arg6 != -1)
        {
            this._data.push(arg6);
        }
    }

    public getMessageArray()
    {
        return this._data;
    }

    public dispose(): void
    {
        return;
    }
}
