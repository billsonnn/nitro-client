import { ActionDefinition } from './ActionDefinition';
import { IActionDefinition } from './interfaces/IActionDefinition';
import { IActiveActionData } from './interfaces/IActiveActionData';

export class AvatarActionManager
{
    private _actions: { [index: string]: IActionDefinition };
    private _defaultAction: IActionDefinition;

    private _isReady: boolean;

    constructor(data: any)
    {
        this._actions       = {};
        this._defaultAction = null;

        this._isReady       = false;

        this.parse(data);
    }

    private parse(data: any): void
    {
        if(!data) return;

        for(let action of data.action)
        {
            const state = action['$'].state;

            if(state !== '')
            {
                const newAction = new ActionDefinition(action);

                if(!newAction) continue;

                this._actions[newAction.state] = newAction;
            }
        }

        this._isReady = true;
    }

    public getActionById(id: string): IActionDefinition
    {
        if(!id) return null;

        for(let key in this._actions)
        {
            const action = this._actions[key];

            if(!action) continue;

            if(action.id !== id) continue;

            return action;
        }

        return null;
    }

    public getActionByName(name: string): IActionDefinition
    {
        return this._actions[name] || null;
    }

    public getDefaultAction(): IActionDefinition
    {
        if(this._defaultAction) return this._defaultAction;

        for(let key in this._actions)
        {
            const action = this._actions[key];

            if(!action) continue;

            if(!action.isDefault) continue;

            this._defaultAction = action;

            return action;
        }

        return null;
    }

    public processActions(actions: IActiveActionData[]): IActiveActionData[]
    {
        if(!actions) return null;

        const totalActions = actions.length;

        if(!totalActions) return null;

        const preventions = this.getPreventions(actions);

        const validatedActions: IActiveActionData[] = [];

        for(let i = 0; i < totalActions; i++)
        {
            const action = actions[i];

            if(!action || !action.definition) continue;

            let actionType = action.actionType;

            if(action.actionType === 'fx') actionType = actionType + '.' + action.actionParameter;

            if(preventions.indexOf(actionType) >= 0) continue;

            validatedActions.push(action);
        }

        if(!validatedActions.length) return null;

        validatedActions.sort(this.sortByPrecedence);

        return validatedActions;
    }

    private getPreventions(actions: IActiveActionData[]): string[]
    {
        if(!actions) return [];

        const totalActions = actions.length;

        if(!totalActions) return [];

        const preventions: string[] = [];

        for(let i = 0; i < totalActions; i++)
        {
            const action = actions[i];

            if(!action) continue;

            const localAction = this._actions[action.actionType];

            if(!localAction) continue;

            action.definition = localAction;

            preventions.push(...localAction.getPreventionWithType(action.actionParameter));
        }

        if(!preventions.length) return [];

        return preventions;
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

    public get isReady(): boolean
    {
        return this._isReady;
    }
}