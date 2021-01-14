import { Triggerable } from '../../../../client/nitro/communication/messages/incoming/roomevents/Triggerable';
import { WiredMainComponent } from '../components/main/main.component';
import { WiredService } from '../services/wired.service';
import { ActionTypeCodes } from './ActionTypeCodes';
import { DefaultActionType } from './DefaultActionType';

export class MoveFurniTo extends DefaultActionType
{
    private _roomEvents: WiredService;
    //private _slider:SliderWindowController;

    public get code(): number
    {
        return ActionTypeCodes.MOVE_FURNI_TO;
    }

    public get requiresFurni(): number
    {
        return WiredMainComponent._Str_4991;
    }

    // public readIntegerParamsFromForm(k:IWindowContainer):Array
    // {
    //     var _local_2:Array = new Array();
    //     _local_2.push(this._Str_19308(k)._Str_2657().id);
    //     _local_2.push(int(this._slider.getValue()));
    //     return _local_2;
    // }

    public onInit(k: WiredMainComponent, _arg_2: WiredService): void
    {
        this._roomEvents = _arg_2;
        // this._slider = new SliderWindowController(_arg_2, this._Str_2453(k), _arg_2.assets, 1, 5, 1);
        // this._slider._Str_2526(1);
        // this._slider.addEventListener(Event.CHANGE, this.onSliderChange);
        // _arg_2.refreshButton(k, "move_0", true, null, 0);
        // _arg_2.refreshButton(k, "move_2", true, null, 0);
        // _arg_2.refreshButton(k, "move_4", true, null, 0);
        // _arg_2.refreshButton(k, "move_6", true, null, 0);
    }

    public onEditStart(k: WiredMainComponent, _arg_2: Triggerable): void
    {
        const _local_3: number = _arg_2.intData[0];
        // this._Str_19308(k)._Str_2520(this._Str_24416(k, _local_3));
        // this._slider._Str_2526(_arg_2.intData[1]);
    }

    public get hasSpecialInputs(): boolean
    {
        return true;
    }

    // private _Str_2453(k:IWindowContainer):IWindowContainer
    // {
    //     return k.findChildByName("slider_container") as IWindowContainer;
    // }

    // private onSliderChange(k:Event): void
    // {
    //     var _local_2:SliderWindowController;
    //     var _local_3:Number;
    //     var _local_4: number;
    //     if (k.type == Event.CHANGE)
    //     {
    //         _local_2 = (k.target as SliderWindowController);
    //         if (_local_2)
    //         {
    //             _local_3 = _local_2.getValue();
    //             _local_4 = int(_local_3);
    //             this._roomEvents.localization.registerParameter("wiredfurni.params.emptytiles", "tiles", ("" + _local_4));
    //         }
    //     }
    // }

    // private _Str_24416(k:IWindowContainer, _arg_2: number):IRadioButtonWindow
    // {
    //     return IRadioButtonWindow(k.findChildByName((("direction_" + _arg_2) + "_radio")));
    // }

    // private _Str_19308(k:IWindowContainer):ISelectorWindow
    // {
    //     return ISelectorWindow(k.findChildByName("direction_selector"));
    // }
}