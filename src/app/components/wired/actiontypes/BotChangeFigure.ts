import { Triggerable } from '../../../../client/nitro/communication/messages/incoming/roomevents/Triggerable';
import { WiredMainComponent } from '../components/main/main.component';
import { WiredService } from '../services/wired.service';
import { ActionTypeCodes } from './ActionTypeCodes';
import { DefaultActionType } from './DefaultActionType';

export class BotChangeFigure extends DefaultActionType
{
    private static _Str_4332: string = '\t';

    private _component: WiredService;
    private _figureString: string;
    private _botName: string;
    private _window: WiredMainComponent;

    public get code(): number
    {
        return ActionTypeCodes.BOT_CHANGE_FIGURE;
    }

    public get requiresFurni(): number
    {
        return WiredMainComponent._Str_5431;
    }

    public onInit(k: WiredMainComponent, _arg_2: WiredService): void
    {
        this._component = _arg_2;
    }

    // public readStringParamFromForm(k:IWindowContainer): string
    // {
    //     var _local_2: string = this._Str_2453(k, "bot_name").text;
    //     return (_local_2 + _Str_4332) + this._figureString;
    // }

    public onEditStart(k: WiredMainComponent, _arg_2: Triggerable): void
    {
        const _local_3 = _arg_2.stringData.split(BotChangeFigure._Str_4332);
        if(_local_3.length > 0)
        {
            this._botName = _local_3[0];
        }
        if(_local_3.length > 1)
        {
            this._figureString = _local_3[1];
        }
        // this._Str_2453(k, "bot_name").text = this._botName;
        // _Str_2483(IWidgetWindow(k.findChildByName("avatar_image")).widget).figure = this._figureString;
        // k.findChildByName("capture_figure").procedure = this._Str_24248;
        this._window = k;
    }

    public get hasSpecialInputs(): boolean
    {
        return true;
    }

    // private _Str_2453(k:IWindowContainer, _arg_2: string):ITextFieldWindow
    // {
    //     var _local_3:ITextFieldWindow = ITextFieldWindow(k.findChildByName(_arg_2));
    //     return _local_3;
    // }

    // private _Str_24248(k:WindowEvent, _arg_2:IWindow): void
    // {
    //     if (k.type == WindowMouseEvent.CLICK)
    //     {
    //         this._figureString = this._component.sessionDataManager.figure;
    //         _Str_2483(IWidgetWindow(this._window.findChildByName("avatar_image")).widget).figure = this._figureString;
    //     }
    // }
}