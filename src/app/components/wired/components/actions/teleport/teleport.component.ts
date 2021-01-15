import { Component } from '@angular/core';
import { WiredAction } from './../WiredAction';
import { WiredActionType } from '../WiredActionType';
import { WiredMainComponent } from '../../main/main.component';

@Component({
    templateUrl: './teleport.template.html'
})
export class TeleportComponent extends WiredAction
{
    public static CODE: number = WiredActionType.TELEPORT;

    public get code(): number
    {
        return TeleportComponent.CODE;
    }

    public get requiresFurni(): number
    {
        return WiredMainComponent._Str_5430;
    }
}
