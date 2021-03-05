import { Component } from '@angular/core';
import { BotRemoveComposer } from '../../../../../../../client/nitro/communication/messages/outgoing/room/engine/BotRemoveComposer';
import { Nitro } from '../../../../../../../client/nitro/Nitro';
import { RoomWidgetRentableBotInfostandUpdateEvent } from '../../../events/RoomWidgetRentableBotInfostandUpdateEvent';
import { InfoStandRentableBotData } from '../../data/InfoStandRentableBotData';
import { InfoStandType } from '../../InfoStandType';
import { RoomInfoStandBaseComponent } from '../base/base.component';

@Component({
    templateUrl: './rentablebot.template.html'
})
export class RoomInfoStandRentableBotComponent extends RoomInfoStandBaseComponent
{
    public botData: InfoStandRentableBotData = null;

    public update(event: RoomWidgetRentableBotInfostandUpdateEvent): void
    {
        if(!event) return;

        Nitro.instance.localization.registerParameter('infostand.text.botowner', 'name', Nitro.instance.getLocalization(this.botData.ownerName));

        if(event.carryId > 0)
        {
            Nitro.instance.localization.registerParameter('infostand.text.handitem', 'item', Nitro.instance.getLocalization('handitem' + event.carryId));
        }
    }

    public get type(): number
    {
        return InfoStandType.RENTABLE_BOT;
    }

    public pickup(): void
    {
        this.hide();
        Nitro.instance.communication.connection.send(new BotRemoveComposer(this.botData.id));
    }
}
