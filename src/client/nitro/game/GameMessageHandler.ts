import { IConnection } from '../../core/communication/connections/IConnection';
import { LoadGameUrlEvent } from '../communication/messages/incoming/game/LoadGameUrlEvent';
import { Nitro } from '../Nitro';

export class GameMessageHandler
{
    constructor(connection: IConnection)
    {
        connection.addMessageEvent(new LoadGameUrlEvent(this.onLoadGameUrl.bind(this)));
    }

    private onLoadGameUrl(event: LoadGameUrlEvent): void
    {
        if(!(event instanceof LoadGameUrlEvent)) return;

        const parser = event.getParser();

        if(!parser) return;

        Nitro.instance.externalInterface.callGame('showGame', parser.url);
    }
}