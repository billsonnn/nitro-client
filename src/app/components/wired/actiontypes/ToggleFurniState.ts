import { WiredMainComponent } from '../components/main/main.component';
import { ActionTypeCodes } from './ActionTypeCodes';
import { DefaultActionType } from './DefaultActionType';

export class ToggleFurniState extends DefaultActionType
{
    public get code(): number
    {
        return ActionTypeCodes.TOGGLE_FURNI_STATE;
    }

    public get requiresFurni(): number
    {
        return WiredMainComponent._Str_5430;
    }
}