import { WiredMainComponent } from '../components/main/main.component';
import { ActionTypeCodes } from './ActionTypeCodes';
import { DefaultActionType } from './DefaultActionType';

export class CallAnotherStack extends DefaultActionType
{
    public get code(): number
    {
        return ActionTypeCodes.CALL_ANOTHER_STACK;
    }

    public get requiresFurni(): number
    {
        return WiredMainComponent._Str_4873;
    }
}