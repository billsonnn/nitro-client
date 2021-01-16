import { ActionDefinition } from '../../../../../client/nitro/communication/messages/incoming/roomevents/ActionDefinition';
import { Triggerable } from '../../../../../client/nitro/communication/messages/incoming/roomevents/Triggerable';
import { IUserDefinedRoomEventsCtrl } from '../../IUserDefinedRoomEventsCtrl';
import { WiredFurniture } from '../../WiredFurniture';
import { CallAnotherStackComponent } from './call-another-stack/call-another-stack.component';
import { ChaseComponent } from './chase/chase.component';
import { ChatComponent } from './chat/chat.component';
import { FleeComponent } from './flee/flee.component';
import { TeleportComponent } from './teleport/teleport.component';
import { ToggleFurniStateComponent } from './toggle-furni-state/toggle-furni-state.component';
import { WiredAction } from './WiredAction';

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
			case FleeComponent.CODE:
				return FleeComponent;
			case CallAnotherStackComponent.CODE:
				return CallAnotherStackComponent;
			case ChatComponent.CODE:
				return ChatComponent;
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
