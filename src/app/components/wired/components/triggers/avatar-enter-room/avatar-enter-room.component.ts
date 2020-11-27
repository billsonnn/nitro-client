import { Component } from '@angular/core';
import { Triggerable } from '../../../../../../client/nitro/communication/messages/incoming/roomevents/Triggerable';
import { WiredTrigger } from '../WiredTrigger';
import { WiredTriggerType } from '../WiredTriggerType';

@Component({
    templateUrl: './avatar-enter-room.template.html'
})
export class AvatarEnterRoomComponent extends WiredTrigger
{
    public static CODE: number = WiredTriggerType.AVATAR_ENTERS_ROOM;

    public get code(): number
    {
        return AvatarEnterRoomComponent.CODE;
    }

    // public readStringParamFromForm(k:IWindowContainer): string
    // {
    //     var _local_2: string = this._Str_2453().text;
    //     return (this._Str_14247()._Str_2365) ? _local_2 : "";
    // }

    public onInitStart(): void
    {
        // this._Str_14247().addEventListener(WindowEvent.WINDOW_EVENT_SELECT, this._Str_22463);
        // this._Str_14247().addEventListener(WindowEvent.WINDOW_EVENT_UNSELECT, this._Str_24589);
    }

    public onEditStart(trigger: Triggerable): void
    {
        // if (_arg_2.stringData != "")
        // {
        //     this._Str_4281()._Str_2520(this._Str_14247());
        //     this._Str_2453().text = _arg_2.stringData;
        //     this._Str_2453().visible = true;
        // }
        // else
        // {
        //     this._Str_4281()._Str_2520(this._Str_16153());
        //     this._Str_2453().text = "";
        //     this._Str_2453().visible = false;
        // }
    }

    public get hasSpecialInputs(): boolean
    {
        return true;
    }

    // private _Str_2453(): HTMLInputElement
    // {
    //     return (this._cont.querySelector("[name='avatar_name_txt'") as HTMLInputElement);
    // }

    // private _Str_14247(): HTMLInputElement
    // {
    //     return (this._cont.querySelector("[name='certain_avatar_radio'") as HTMLInputElement);
    // }

    // private _Str_16153(): HTMLInputElement
    // {
    //     return (this._cont.querySelector("[name='any_avatar_radio'") as HTMLInputElement);
    // }

    // private _Str_4281(): HTMLElement
    // {
    //     return (this._cont.querySelector("[name='avatar_radio'") as HTMLElement);
    // }

    // private _Str_22463(k:WindowEvent): void
    // {
    //     this._Str_2453().visible = true;
    // }

    // private _Str_24589(k:WindowEvent): void
    // {
    //     this._Str_2453().text = "";
    //     this._Str_2453().visible = false;
    // }
}