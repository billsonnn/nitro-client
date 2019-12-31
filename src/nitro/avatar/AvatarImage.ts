import { ActiveActionData } from './actions/ActiveActionData';
import { AvatarAction } from './actions/AvatarAction';
import { IActiveActionData } from './actions/interfaces/IActiveActionData';
import { AvatarFigureContainer } from './AvatarFigureContainer';
import { AvatarStructure } from './AvatarStructure';

export class AvatarImage
{
    private static DEFAULT: string = 'default';

    private _structure: AvatarStructure;
    private _figure: AvatarFigureContainer;

    private _defaultAction: IActiveActionData;
    private _actions: IActiveActionData[];
    private _validatedActions: IActiveActionData[];
    private _currentActionSet: string;
    private _lastActionSet: string;

    constructor(structure: AvatarStructure, figure: AvatarFigureContainer)
    {
        if(!(structure instanceof AvatarStructure)) throw new Error('invalid_structure');

        this._structure = structure;

        if(!figure) figure = new AvatarFigureContainer(structure.avatarManager, 'hr-893-45.hd-180-2.ch-210-66.lg-270-82.sh-300-91.wa-2007');

        this._figure = figure;

        this._defaultAction             = new ActiveActionData(AvatarAction.POSTURE_STAND);
        this._defaultAction.definition  = this._structure.getActionById(AvatarImage.DEFAULT);
        this._actions                   = [];
        this._validatedActions          = [];
        this._currentActionSet          = null;
        this._lastActionSet             = null;
    }

    public dispose(): void
    {
        if(this._figure)
        {
            this._figure.dispose();

            this._figure = null;
        }

        this._defaultAction     = null;
        this._actions           = [];
        this._validatedActions  = [];
        this._currentActionSet  = null;
        this._lastActionSet     = null;
    }

    public resetActions(): void
    {
        this._actions           = [];
        this._currentActionSet  = null;
    }

    public updateActions(): boolean
    {
        this._validatedActions = this._structure.processActions(this._actions);

        let needsUpdate = false;

        this._currentActionSet = null;

        if(!this._validatedActions)
        {

        }
        else
        {
            const totalActions = this._validatedActions.length;

            if(totalActions)
            {
                for(let i = 0; i < totalActions; i++)
                {
                    const action = this._validatedActions[i];

                    if(!action) continue;

                    this._currentActionSet = this._currentActionSet + action.actionType + action.actionParameter;

                    if(action.actionType === AvatarAction.EFFECT)
                    {

                    }
                }

                if(this._lastActionSet !== this._currentActionSet)
                {
                    needsUpdate = true;

                    this._lastActionSet = this._currentActionSet;
                }
            }
        }

        return needsUpdate;
    }

    public appendAction(action: string, ...args: any[]): boolean
    {
        if(!action) return false;

        let value: any = args[0];

        switch(action)
        {
            case AvatarAction.POSTURE:
                switch(value)
                {
                    case AvatarAction.POSTURE_LAY:
                    case AvatarAction.POSTURE_WALK:
                    case AvatarAction.POSTURE_STAND:
                    case AvatarAction.POSTURE_SWIM:
                    case AvatarAction.POSTURE_FLOAT:
                    case AvatarAction.POSTURE_SIT:
                    case AvatarAction.SNOWWAR_RUN:
                    case AvatarAction.SNOWWAR_DIE_FRONT:
                    case AvatarAction.SNOWWAR_DIE_BACK:
                    case AvatarAction.SNOWWAR_PICK:
                    case AvatarAction.SNOWWAR_THROW:
                        this.setAction(value);
                        break;
                }
                break;
            case AvatarAction.GESTURE:
                switch(value)
                {
                    case AvatarAction.GESTURE_AGGRAVATED:
                    case AvatarAction.GESTURE_SAD:
                    case AvatarAction.GESTURE_SMILE:
                    case AvatarAction.GESTURE_SURPRISED:
                        this.setAction(value);
                        break;
                }
                break;
            case AvatarAction.EFFECT:
            case AvatarAction.DANCE:
            case AvatarAction.TALK:
            case AvatarAction.EXPRESSION_WAVE:
            case AvatarAction.SLEEP:
            case AvatarAction.SIGN:
            case AvatarAction.EXPRESSION_RESPECT:
            case AvatarAction.EXPRESSION_BLOW_A_KISS:
            case AvatarAction.EXPRESSION_LAUGH:
            case AvatarAction.EXPRESSION_CRY:
            case AvatarAction.EXPRESSION_IDLE:
            case AvatarAction.EXPRESSION_SNOWBOARD_OLLIE:
            case AvatarAction.EXPRESSION_SNOWBORD_360:
            case AvatarAction.EXPRESSION_RIDE_JUMP:
                this.setAction(action, value);
                break;
            case AvatarAction.CARRY_OBJECT:
            case AvatarAction.USE_OBJECT:
                const definition = this._structure.getActionByName(action);

                if(definition) value = definition.getParameter(value);

                this.setAction(action, value);
                break;
        }
    }

    private setAction(action: string, value: string = ''): void
    {
        if(!action) return;

        const totalActions = this._actions.length;

        if(totalActions)
        {
            for(let i = 0; i < totalActions; i++)
            {
                const existingAction = this._actions[i];

                if(!existingAction) continue;

                if(existingAction.actionType === action && existingAction.actionParameter === value) return;
            }
        }

        if(action === AvatarAction.CARRY_OBJECT) this._figure.setRightItem(parseInt(value));

        if(action === AvatarAction.SIGN) this._figure.setLeftItem(parseInt(value));

        this._actions.push(new ActiveActionData(action, value, 0));
    }

    public get structure(): AvatarStructure
    {
        return this._structure;
    }

    public get figure(): AvatarFigureContainer
    {
        return this._figure;
    }

    public get validatedActions(): IActiveActionData[]
    {
        return this._validatedActions;
    }
}