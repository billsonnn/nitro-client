import { ActionTypeCodes } from './ActionTypeCodes';
import { DefaultActionType } from './DefaultActionType';

export class Reset extends DefaultActionType
{
    public get code(): number
    {
        return ActionTypeCodes.RESET;
    }
}