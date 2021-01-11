import { Triggerable } from '../../../../client/nitro/communication/messages/incoming/roomevents/Triggerable';
import { WiredMainComponent } from '../components/main/main.component';
import { WiredService } from '../services/wired.service';
import { ActionTypeCodes } from './ActionTypeCodes';
import { DefaultActionType } from './DefaultActionType';

export class MuteUser extends DefaultActionType
{
    private _roomEvents: WiredService;
    //private _slider:SliderWindowController;

    public get code(): number
    {
        return ActionTypeCodes.MUTE_USER;
    }

    // public readStringParamFromForm(k:IWindowContainer): string
    // {
    //     var _local_2: string = this._Str_17881(k).text;
    //     return _local_2;
    // }

    // public readIntegerParamsFromForm(k:IWindowContainer):Array
    // {
    //     var _local_2:Array = new Array();
    //     _local_2.push(this._slider.getValue());
    //     return _local_2;
    // }

    public onEditStart(k: WiredMainComponent, _arg_2: Triggerable): void
    {
        // this._Str_17881(k).text = _arg_2.stringData;
        // var _local_3: number = _arg_2.intData[0];
        // this._slider._Str_2526(_local_3);
    }

    public get hasSpecialInputs(): boolean
    {
        return true;
    }

    // private _Str_17881(k:IWindowContainer):ITextFieldWindow
    // {
    //     var _local_2:ITextFieldWindow = ITextFieldWindow(k.findChildByName("chat_message"));
    //     return _local_2;
    // }

    // public validate(k:IWindowContainer, _arg_2:HabboUserDefinedRoomEvents): string
    // {
    //     var _local_4: string;
    //     var _local_3: number = 100;
    //     if (this._Str_17881(k).text.length > _local_3)
    //     {
    //         _local_4 = "wiredfurni.chatmsgtoolong";
    //         return _arg_2.localization.getLocalization(_local_4, _local_4);
    //     }
    //     return null;
    // }

    public onInit(k: WiredMainComponent, _arg_2: WiredService): void
    {
        this._roomEvents = _arg_2;
        // this._slider = new SliderWindowController(_arg_2, this._Str_25532(k), _arg_2.assets, 0, 10, 1);
        // this._slider._Str_2526(1);
        // this._slider.addEventListener(Event.CHANGE, this.onSliderChange);
    }

    // private _Str_25532(k:IWindowContainer):IWindowContainer
    // {
    //     return k.findChildByName("slider_container") as IWindowContainer;
    // }

    // protected onSliderChange(k:Event): void
    // {
    //     var _local_2:SliderWindowController;
    //     var _local_3:Number;
    //     var _local_4: string;
    //     if (k.type == Event.CHANGE)
    //     {
    //         _local_2 = (k.target as SliderWindowController);
    //         if (_local_2)
    //         {
    //             _local_3 = _local_2.getValue();
    //             _local_4 = int(_local_3).toString();
    //             this._roomEvents.localization.registerParameter("wiredfurni.params.length.minutes", "minutes", _local_4);
    //         }
    //     }
    // }

    // protected get _Str_16492():HabboUserDefinedRoomEvents
    // {
    //     return this._roomEvents;
    // }

    // public get slider():SliderWindowController
    // {
    //     return this._slider;
    // }
}