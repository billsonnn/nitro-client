import { Component } from '@angular/core';
import { Triggerable } from '../../../../../../client/nitro/communication/messages/incoming/roomevents/Triggerable';
import { WiredCondition } from '../WiredCondition';
import { WiredConditionType } from '../WiredConditionType';

@Component({
    templateUrl: './actor-has-hand-item.template.html'
})
export class ActorHasHandItemComponent extends WiredCondition
{
    public static CODE: number = WiredConditionType.ACTOR_HAS_HANDITEM;

    public get code(): number
    {
        return ActorHasHandItemComponent.CODE;
    }

    // public readIntegerParamsFromForm(k:IWindowContainer):Array
    // {
    //     var _local_2:Array = [];
    //     _local_2.push(this._Str_17055(k));
    //     return _local_2;
    // }

    public onEditStart(trigger: Triggerable): void
    {
        //this._Str_18464(k, _arg_2.intData[0]);
    }

    // private _Str_17055(k:IWindowContainer): number
    // {
    //     var _local_2:Array = this._Str_5671(k, "menu_handitem")._Str_4487();
    //     var _local_3: number = this._Str_5671(k, "menu_handitem").selection;
    //     if (_local_3 == -1)
    //     {
    //         return 0;
    //     }
    //     return this._Str_10826(_local_2[_local_3]);
    // }

    // private _Str_18464(k:IWindowContainer, _arg_2: number): void
    // {
    //     var _local_3:Array = this._Str_5671(k, "menu_handitem")._Str_4487();
    //     var _local_4: number = -1;
    //     var _local_5: number;
    //     while (_local_5 < _local_3.length)
    //     {
    //         if (this._Str_10826(_local_3[_local_5]) == _arg_2)
    //         {
    //             _local_4 = _local_5;
    //         }
    //         _local_5++;
    //     }
    //     this._Str_5671(k, "menu_handitem").selection = _local_4;
    // }

    private _Str_10826(k: string): number
    {
        return parseInt(k.substr(10, (k.length - 11)));
    }

    public get hasSpecialInputs(): boolean
    {
        return true;
    }

    // private _Str_5671(k:IWindowContainer, _arg_2: string):IDropMenuWindow
    // {
    //     var _local_3:IDropMenuWindow = IDropMenuWindow(k.findChildByName(_arg_2));
    //     return _local_3;
    // }
}