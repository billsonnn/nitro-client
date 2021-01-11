import { ActionTypeCodes } from './ActionTypeCodes';
import { DefaultActionType } from './DefaultActionType';

export class LeaveTeam extends DefaultActionType
{
    public get code(): number
    {
        return ActionTypeCodes.LEAVE_TEAM;
    }
}