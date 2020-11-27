import { Component } from '@angular/core';
import { Triggerable } from '../../../../../../client/nitro/communication/messages/incoming/roomevents/Triggerable';
import { WiredMainComponent } from '../../main/main.component';
import { WiredTrigger } from '../WiredTrigger';
import { WiredTriggerType } from '../WiredTriggerType';

@Component({
    templateUrl: './bot-reached-stuff.template.html'
})
export class BotReachedStuffComponent extends WiredTrigger
{
    public static CODE: number = WiredTriggerType.BOT_REACHED_STUFF;

    public get code(): number
    {
        return BotReachedStuffComponent.CODE;
    }

    public get requiresFurni(): number
    {
        return WiredMainComponent._Str_4991;
    }

    // public readStringParamFromForm(k:IWindowContainer): string
    // {
    //     return this._Str_2453(k).text;
    // }

    public onEditStart(_arg_2: Triggerable): void
    {
        //this._Str_2453(k).text = _arg_2.stringData;
    }

    public get hasSpecialInputs(): boolean
    {
        return true;
    }

    // private _Str_2453(k:IWindowContainer):ITextFieldWindow
    // {
    //     var _local_2:ITextFieldWindow = ITextFieldWindow(k.findChildByName("bot_name"));
    //     return _local_2;
    // }
}