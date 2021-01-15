import { Component } from '@angular/core';
import { WiredAction } from './../WiredAction';
import { WiredActionType } from '../WiredActionType';
import { WiredMainComponent } from '../../main/main.component';

@Component({
    templateUrl: './toggle-furni-state.template.html'
})
export class ToggleFurniStateComponent extends WiredAction
{
    public static CODE: number = WiredActionType.TOGGLE_FURNI_STATE;

    public get code(): number
    {
        return ToggleFurniStateComponent.CODE;
    }

    public get requiresFurni(): number
    {
        return WiredMainComponent._Str_5430;
    }
}
