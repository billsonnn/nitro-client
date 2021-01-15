import { Component } from '@angular/core';
import { WiredAction } from './../WiredAction';
import { WiredActionType } from '../WiredActionType';
import { WiredMainComponent } from '../../main/main.component';

@Component({
    templateUrl: './flee.template.html'
})
export class FleeComponent extends WiredAction
{
    public static CODE: number = WiredActionType.FLEE;

    public get code(): number
    {
        return FleeComponent.CODE;
    }

    public get requiresFurni(): number
    {
        return WiredMainComponent._Str_5430;
    }
}
