import { WiredMainComponent } from '../components/main/main.component';
import { ActionTypeCodes } from './ActionTypeCodes';
import { DefaultActionType } from './DefaultActionType';

export class Teleport extends DefaultActionType
{
    public get code(): number
    {
        return ActionTypeCodes.TELEPORT;
    }

    public get requiresFurni(): number
    {
        return WiredMainComponent._Str_4991;
    }
}