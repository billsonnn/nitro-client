import { ActionDefinition } from './ActionDefinition';
import { IActionDefinition } from './IActionDefinition';
import { IActiveActionData } from './IActiveActionData';

export class AvatarActionManager
{
    private _actions: Map<string, IActionDefinition>;
    private _defaultAction: IActionDefinition;

    constructor(k: any, data: any)
    {
        this._actions       = new Map();
        this._defaultAction = null;

        this.parse(data);
    }

    private parse(data: any): void
    {
        if(!data) return;

        if(!data.actions || (data.actions.length <= 0)) return;

        for(let action of data.actions)
        {
            if(!action || !action.state) continue;

            const definition = new ActionDefinition(action);

            this._actions.set(definition.state, definition);
        }
    }

    public _Str_1675(id: string): IActionDefinition
    {
        if(!id) return null;

        for(let action of this._actions.values())
        {
            if(!action || (action.id !== id)) continue;

            return action;
        }

        return null;
    }

    public _Str_2018(state: string): IActionDefinition
    {
        const existing = this._actions.get(state);

        if(!existing) return null;

        return existing;
    }

    public _Str_1027(): IActionDefinition
    {
        if(this._defaultAction) return this._defaultAction;

        for(let action of this._actions.values())
        {
            if(!action || !action._Str_804) continue;

            this._defaultAction = action;

            return action;
        }

        return null;
    }

    public _Str_781(k: IActiveActionData[], _arg_2: string, _arg_3: number): []
    {
        let index           = 0;
        let actionList: []  = [];

        for(let activeAction of k)
        {
            if(!activeAction) continue;

            const localAction   = this._actions.get(activeAction.actionType);
            const actions       = localAction && localAction._Str_805(_arg_2, _arg_3);

            if(actions) actionList = actions;
        }

        return actionList;
    }

    public _Str_711(actions: IActiveActionData[]): IActiveActionData[]
    {
        if(!actions) return null;

        actions = this._Str_1247(actions);

        let validatedActions: IActiveActionData[] = [];

        for(let action of actions)
        {
            if(!action) continue;

            const localAction = this._actions.get(action.actionType);

            if(!localAction) continue;

            action.definition = localAction;

            validatedActions.push(action);
        }

        validatedActions.sort(this.sortByPrecedence);

        return validatedActions;
    }

    private _Str_1247(actions: IActiveActionData[]): IActiveActionData[]
    {
        let preventions: string[]               = [];
        let activeActions: IActiveActionData[]  = [];

        for(let action of actions)
        {
            if(!action) continue;

            const localAction = this._actions.get(action.actionType);

            if(localAction) preventions = preventions.concat(localAction._Str_733(action.actionParameter));
        }

        for(let action of actions)
        {
            if(!action) continue;

            let actionType = action.actionType;

            if(action.actionType === 'fx') actionType = (actionType + ('.' + action.actionParameter));

            if(preventions.indexOf(actionType) >= 0) continue;

            activeActions.push(action);
        }

        return activeActions;
    }

    private sortByPrecedence(actionOne: IActiveActionData, actionTwo: IActiveActionData): number
    {
        if(!actionOne || !actionTwo) return 0;

        const precedenceOne = actionOne.definition.precedence;
        const precedenceTwo = actionTwo.definition.precedence;

        if(precedenceOne < precedenceTwo) return 1;

        if(precedenceOne > precedenceTwo) return -1;

        return 0;
    }
}