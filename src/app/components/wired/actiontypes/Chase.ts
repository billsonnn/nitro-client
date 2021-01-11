import { WiredMainComponent } from '../components/main/main.component';
import { ActionTypeCodes } from './ActionTypeCodes';
import { DefaultActionType } from './DefaultActionType';

export class Chase extends DefaultActionType
{
    public get code(): number
    {
        return ActionTypeCodes.CHASE;
    }

    public get requiresFurni(): number
    {
        return WiredMainComponent._Str_5430;
    }
}