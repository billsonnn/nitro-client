﻿import { Triggerable } from '../../../../client/nitro/communication/messages/incoming/roomevents/Triggerable';
import { WiredMainComponent } from '../components/main/main.component';
import { WiredService } from '../services/wired.service';
import { ActionTypeCodes } from './ActionTypeCodes';
import { DefaultActionType } from './DefaultActionType';

export class GiveReward extends DefaultActionType
{
    private _Str_12675: number = 20;

    private _roomEvents: WiredService;
    //private _prizeLimitSlider:SliderWindowController;
    private _displayedRewards: number = 5;

    public get code(): number
    {
        return ActionTypeCodes.GIVE_REWARD;
    }

    // public validate(k:IWindowContainer, _arg_2:HabboUserDefinedRoomEvents): string
    // {
    //     var _local_6:IWindowContainer;
    //     var _local_7: string;
    //     var _local_3:IWindowContainer = IWindowContainer(k.findChildByName("rewards_container"));
    //     var _local_4: number;
    //     var _local_5: number;
    //     while (_local_5 < _local_3.numChildren)
    //     {
    //         _local_6 = IWindowContainer(_local_3.getChildAt(_local_5));
    //         if (_local_6.visible)
    //         {
    //             _local_7 = this._Str_22801(_local_6, this._Str_8311(k)._Str_2365);
    //             if (_local_7 != null)
    //             {
    //                 return _local_7;
    //             }
    //             _local_4 = (_local_4 + int(this._Str_11801(_local_6).text));
    //         }
    //         _local_5++;
    //     }
    //     if (_local_4 > 100)
    //     {
    //         return ("The sum of probabilities cannot exceed 100. You now have " + _local_4) + ".";
    //     }
    //     return null;
    // }

    // public readIntegerParamsFromForm(k:IWindowContainer):Array
    // {
    //     var _local_2:Array = new Array();
    //     _local_2.push(this._Str_20392(k)._Str_2657().id);
    //     _local_2.push(((this._Str_8311(k)._Str_2365) ? 1 : 0));
    //     _local_2.push(((this._Str_11667(k)._Str_2365) ? this._prizeLimitSlider.getValue() : 0));
    //     var _local_3: number = int(this._Str_18135(k).caption);
    //     _local_2.push(((_local_3 >= 1) ? _local_3 : 1));
    //     return _local_2;
    // }

    // public readStringParamFromForm(k:IWindowContainer): string
    // {
    //     var _local_5:IWindowContainer;
    //     var _local_6: string;
    //     var _local_2: string = "";
    //     var _local_3:IWindowContainer = IWindowContainer(k.findChildByName("rewards_container"));
    //     var _local_4: number;
    //     while (_local_4 < _local_3.numChildren)
    //     {
    //         _local_5 = IWindowContainer(_local_3.getChildAt(_local_4));
    //         if (_local_5.visible)
    //         {
    //             _local_6 = this._Str_25605(_local_5);
    //             if (_local_6 != null)
    //             {
    //                 _local_2 = (_local_2 + (((_local_2 == "") ? "" : ";") + _local_6));
    //             }
    //         }
    //         _local_4++;
    //     }
    //     return _local_2;
    // }

    // private _Str_22801(k:IWindowContainer, _arg_2: boolean): string
    // {
    //     var _local_6: number;
    //     var _local_3: string = this._Str_17924(k).text;
    //     var _local_4: string = this._Str_11801(k).text;
    //     if (((_local_3 == "") && (_local_4 == "")))
    //     {
    //         return null;
    //     }
    //     if (_local_3.indexOf(",") > 0)
    //     {
    //         return "Product/badge codes must not contain ',' characters.";
    //     }
    //     if (_local_3.indexOf(";") > 0)
    //     {
    //         return "Product/badge codes must not contain ';' characters.";
    //     }
    //     var _local_5: number = 100;
    //     if (_local_3.length > _local_5)
    //     {
    //         return ("Product/badge codes cannot contain more than " + _local_5) + " characters.";
    //     }
    //     if (_local_3 == "")
    //     {
    //         return "Remember to define product/badge codes for all rewards (fill all fields or leave all fields empty).";
    //     }
    //     if (!_arg_2)
    //     {
    //         if (_local_4 == "")
    //         {
    //             return "Remember to define probabilities for all rewards (fill all fields or leave all fields empty).";
    //         }
    //         if (isNaN(Number(_local_4)))
    //         {
    //             return "Make sure are probabilities are numbers.";
    //         }
    //         _local_6 = int(_local_4);
    //         if (((_local_6 < 1) || (_local_6 > 100)))
    //         {
    //             return "Make sure all probabilities are numbers between 1 and 100.";
    //         }
    //     }
    //     return null;
    // }

    // private _Str_25605(k:IWindowContainer): string
    // {
    //     var _local_2: string = this._Str_17924(k).text;
    //     var _local_3: string = this._Str_11801(k).text;
    //     var _local_4: boolean = this._Str_18678(k)._Str_2365;
    //     _local_2 = this._Str_19618(_local_2, ";", "");
    //     _local_2 = this._Str_19618(_local_2, ",", "");
    //     if (_local_2 == "")
    //     {
    //         return null;
    //     }
    //     var _local_5: number = ((isNaN(Number(_local_3))) ? 0 : int(_local_3));
    //     return (((((_local_4) ? "0" : "1") + ",") + _local_2) + ",") + _local_5;
    // }

    // private _Str_25823(k: number, _arg_2:IWindowContainer, _arg_3: string): void
    // {
    //     var _local_4:Array = ((_arg_3 == null) ? new Array() : _arg_3.split(","));
    //     this._Str_17924(_arg_2).text = ((_local_4[1]) ? _local_4[1] : "");
    //     this._Str_11801(_arg_2).text = ((_local_4[2]) ? _local_4[2] : "");
    //     if (((_local_4[0]) && (_local_4[0] == "0")))
    //     {
    //         this._Str_18678(_arg_2).select();
    //     }
    //     else
    //     {
    //         this._Str_18678(_arg_2)._Str_2205();
    //     }
    // }

    private _Str_19618(k: string, _arg_2: string, _arg_3: string): string
    {
        var _local_4: number = 100;
        while (k.indexOf(_arg_2) > -1)
        {
            k = k.replace(_arg_2, _arg_3);
            _local_4--;
            if (_local_4 < 1)
            {
                break;
            }
        }
        return k;
    }

    public onInit(k: WiredMainComponent, _arg_2: WiredService): void
    {
        // var _local_5:IWindowContainer;
        // this._roomEvents = _arg_2;
        // this._prizeLimitSlider = new SliderWindowController(_arg_2, this._Str_21165(k), _arg_2.assets, 1, 1000, 1);
        // this._prizeLimitSlider.addEventListener(Event.CHANGE, this.onSliderChange);
        // this._prizeLimitSlider._Str_2526(1);
        // this._Str_11667(k).procedure = this._Str_23342;
        // this._Str_8311(k).procedure = this._Str_22410;
        // k.findChildByName("add_reward_txt").procedure = this._Str_24613;
        // var _local_3:IWindowContainer = IWindowContainer(k.findChildByName("rewards_container"));
        // var _local_4: number;
        // while (_local_4 < this._Str_12675)
        // {
        //     _local_5 = IWindowContainer(this._roomEvents.getXmlWindow("ude_action_inputs_17_reward"));
        //     _local_3.addChild(_local_5);
        //     _local_5.y = (_local_4 * 14);
        //     _local_5.id = _local_4;
        //     _local_4++;
        // }
    }

    public onEditStart(k: WiredMainComponent, _arg_2: Triggerable): void
    {
        // var _local_9:IWindowContainer;
        // var _local_3: number = _arg_2.intData[0];
        // this._Str_20392(k)._Str_2520(this._Str_23398(k, _local_3));
        // if (((_local_3 > 0) && (_arg_2.intData.length == 4)))
        // {
        //     this._Str_18135(k).caption = String(_arg_2.intData[3]);
        // }
        // else
        // {
        //     this._Str_18135(k).caption = "1";
        // }
        // var _local_4:* = (_arg_2.intData[1] == 1);
        // if (_local_4)
        // {
        //     this._Str_8311(k).select();
        // }
        // else
        // {
        //     this._Str_8311(k)._Str_2205();
        // }
        // var _local_5: number = _arg_2.intData[2];
        // if (_local_5 > 0)
        // {
        //     this._prizeLimitSlider._Str_2526(_local_5);
        //     this._Str_11667(k).select();
        // }
        // else
        // {
        //     this._Str_11667(k)._Str_2205();
        // }
        // this._Str_19833(k);
        // var _local_6:Array = _arg_2.stringData.split(";");
        // var _local_7:IWindowContainer = IWindowContainer(k.findChildByName("rewards_container"));
        // var _local_8: number;
        // while (_local_8 < this._Str_12675)
        // {
        //     _local_9 = IWindowContainer(_local_7.getChildAt(_local_8));
        //     this._Str_25823(_local_8, _local_9, _local_6[_local_8]);
        //     if (_local_6[_local_8])
        //     {
        //         this._displayedRewards = (_local_8 + 1);
        //     }
        //     _local_8++;
        // }
        // this._Str_20059(k);
        // this._Str_20031(k);
    }

    public get hasSpecialInputs(): boolean
    {
        return true;
    }

    // private _Str_17924(k:IWindowContainer):ITextFieldWindow
    // {
    //     return ITextFieldWindow(k.findChildByName("reward_code_input"));
    // }

    // private _Str_11801(k:IWindowContainer):ITextFieldWindow
    // {
    //     return ITextFieldWindow(k.findChildByName("propability_input"));
    // }

    // private _Str_18678(k:IWindowContainer):ICheckBoxWindow
    // {
    //     return ICheckBoxWindow(k.findChildByName("is_badge_checkbox"));
    // }

    // private _Str_21165(k:IWindowContainer):IWindowContainer
    // {
    //     return IWindowContainer(k.findChildByName("slider_container"));
    // }

    // private _Str_8311(k:IWindowContainer):ICheckBoxWindow
    // {
    //     return ICheckBoxWindow(k.findChildByName("unique_prize_checkbox"));
    // }

    // private _Str_11667(k:IWindowContainer):ICheckBoxWindow
    // {
    //     return ICheckBoxWindow(k.findChildByName("prize_limit_checkbox"));
    // }

    // private _Str_23398(k:IWindowContainer, _arg_2: number):IRadioButtonWindow
    // {
    //     return IRadioButtonWindow(k.findChildByName((("interval_" + _arg_2) + "_radio")));
    // }

    // private _Str_20392(k:IWindowContainer):ISelectorWindow
    // {
    //     return ISelectorWindow(k.findChildByName("user_reward_interval_selector"));
    // }

    // private _Str_18135(k:IWindowContainer):ITextFieldWindow
    // {
    //     return ITextFieldWindow(k.findChildByName("interval_input"));
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
    //             this._Str_21816(("" + _local_4));
    //         }
    //     }
    // }

    // private _Str_23342(k:WindowEvent, _arg_2:IWindow): void
    // {
    //     if (k.type == WindowMouseEvent.CLICK)
    //     {
    //         this._Str_19833(IWindowContainer(_arg_2.parent));
    //     }
    // }

    // private _Str_22410(k:WindowEvent, _arg_2:IWindow): void
    // {
    //     if (k.type == WindowMouseEvent.CLICK)
    //     {
    //         this._Str_20031(IWindowContainer(_arg_2.parent));
    //     }
    // }

    // private _Str_24613(k:WindowEvent, _arg_2:IWindow): void
    // {
    //     if (k.type == WindowMouseEvent.CLICK)
    //     {
    //         this._displayedRewards++;
    //         this._Str_20059(IWindowContainer(_arg_2.parent.parent));
    //     }
    // }

    // private _Str_19833(k:IWindowContainer): void
    // {
    //     var _local_2: boolean = this._Str_11667(k)._Str_2365;
    //     k.findChildByName("prize_limit_warning_txt").visible = (!(_local_2));
    //     this._Str_21165(k).visible = _local_2;
    //     this._Str_21816(((_local_2) ? ("" + this._prizeLimitSlider.getValue()) : ""));
    // }

    // private _Str_21816(k: string): void
    // {
    //     this._roomEvents.localization.registerParameter("wiredfurni.params.prizelimit", "amount", k);
    // }

    // private _Str_20059(k:IWindowContainer): void
    // {
    //     var _local_4:IWindowContainer;
    //     var _local_2:IWindowContainer = IWindowContainer(k.findChildByName("rewards_container"));
    //     var _local_3: number;
    //     while (_local_3 < this._Str_12675)
    //     {
    //         _local_4 = IWindowContainer(_local_2.getChildAt(_local_3));
    //         _local_4.visible = (_local_3 < this._displayedRewards);
    //         _local_3++;
    //     }
    //     _local_2.height = Util._Str_2647(_local_2);
    //     k.height = Util._Str_2647(k);
    //     this._roomEvents._Str_7247.refresh();
    // }

    // private _Str_20031(k:IWindowContainer): void
    // {
    //     var _local_5:IWindowContainer;
    //     var _local_2:IWindowContainer = IWindowContainer(k.findChildByName("rewards_container"));
    //     var _local_3: boolean = this._Str_8311(k)._Str_2365;
    //     k.findChildByName("propability_txt").visible = (!(_local_3));
    //     var _local_4: number;
    //     while (_local_4 < this._Str_12675)
    //     {
    //         _local_5 = IWindowContainer(_local_2.getChildAt(_local_4));
    //         this._Str_11801(_local_5).visible = (!(_local_3));
    //         _local_4++;
    //     }
    // }
}