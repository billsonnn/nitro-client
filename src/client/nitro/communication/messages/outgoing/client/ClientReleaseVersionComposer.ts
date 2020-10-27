import { ClientDeviceCategoryEnum } from '../../../../../core/communication/connections/enums/ClientDeviceCategoryEnum';
import { ClientPlatformEnum } from '../../../../../core/communication/connections/enums/ClientPlatformEnum';
import { IMessageComposer } from '../../../../../core/communication/messages/IMessageComposer';
import { Nitro } from '../../../../Nitro';

export class ClientReleaseVersionComposer implements IMessageComposer
{
    private _data: any[];

    constructor()
    {
        this._data = [ Nitro.RELEASE_VERSION, ClientPlatformEnum.HTML5, ClientPlatformEnum.HTML5, ClientDeviceCategoryEnum.BROWSER ];
    }

    public getMessageArray(): any[]
    {
        return this._data;
    }

    public dispose(): void
    {
        return;
    }
}