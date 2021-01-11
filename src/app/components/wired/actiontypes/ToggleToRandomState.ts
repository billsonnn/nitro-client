import { WiredMainComponent } from '../components/main/main.component';
import { ActionTypeCodes } from './ActionTypeCodes';
import { DefaultActionType } from './DefaultActionType';

export class ToggleToRandomState extends DefaultActionType
{
    public get code(): number
    {
        return ActionTypeCodes.TOGGLE_TO_RANDOM_STATE;
    }

    public get requiresFurni(): number
    {
        return WiredMainComponent._Str_5430;
    }
}