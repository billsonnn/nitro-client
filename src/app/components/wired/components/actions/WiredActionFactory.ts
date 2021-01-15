import { ChaseComponent } from './chase/chase.component';
import { TeleportComponent } from './teleport/teleport.component';
import { ActionDefinition } from '../../../../../client/nitro/communication/messages/incoming/roomevents/ActionDefinition';
import { Triggerable } from '../../../../../client/nitro/communication/messages/incoming/roomevents/Triggerable';
import { IUserDefinedRoomEventsCtrl } from '../../IUserDefinedRoomEventsCtrl';
import { WiredFurniture } from '../../WiredFurniture';
import { WiredAction } from './WiredAction';
import { ToggleFurniStateComponent } from './toggle-furni-state/toggle-furni-state.component';

export class WiredActionFactory implements IUserDefinedRoomEventsCtrl
{
    public _Str_9781(code: number): typeof WiredAction
    {
        switch(code)
        {
			case ToggleFurniStateComponent.CODE:
				return ToggleFurniStateComponent;
			case TeleportComponent.CODE:
				return TeleportComponent;
			case ChaseComponent.CODE:
				return ChaseComponent;
        }

        return null;
    }

    public _Str_15652(code: number): typeof WiredFurniture
    {
        return this._Str_9781(code);
    }

    public _Str_14545(trigger: Triggerable): boolean
    {
        return (trigger instanceof ActionDefinition);
    }

    public _Str_1196(): string
    {
        return 'action';
	}
}
