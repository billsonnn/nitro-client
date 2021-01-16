import { Component } from '@angular/core';
import { Triggerable } from '../../../../../../client/nitro/communication/messages/incoming/roomevents/Triggerable';
import { Nitro } from '../../../../../../client/nitro/Nitro';
import { WiredActionType } from '../WiredActionType';
import { WiredAction } from './../WiredAction';

@Component({
    templateUrl: './chat.template.html'
})
export class ChatComponent extends WiredAction
{
    public static CODE: number = WiredActionType.CHAT;

	public message: string;

    public get code(): number
    {
        return ChatComponent.CODE;
    }

	public get hasSpecialInputs(): boolean
    {
        return true;
	}

	public readStringParamFromForm(): string
    {
        return this.message;
	}

    public onEditStart(trigger: Triggerable): void
    {
        this.message = trigger.stringData;
	}

	public validate(): string
    {
        var messageMaxSize: number = 100;
        if (this.message.length > messageMaxSize)
        {
			return Nitro.instance.localization.getValue('wiredfurni.chatmsgtoolong', false);
        }
        return null;
	}
}
