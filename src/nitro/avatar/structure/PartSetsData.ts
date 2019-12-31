import { ActivePartSet } from './parts/ActivePartSet';
import { PartDefinition } from './parts/PartDefinition';

export class PartSetsData
{
    private _parts: { [index: string]: PartDefinition };
    private _activePartSets: { [index: string]: ActivePartSet };

    private _isReady: boolean;

    constructor()
    {
        this._parts             = {};
        this._activePartSets    = {};

        this._isReady           = false;
    }

    public parse(data: any): boolean
    {
        if(!data) return false;

        for(let part of data.partSet[0].part)
        {
            const newPart = new PartDefinition(part);

            if(!newPart) continue;

            this._parts[newPart.setType] = newPart;
        }

        for(let partSet of data.activePartSet)
        {
            const newPartSet = new ActivePartSet(partSet);

            if(!newPartSet) continue;

            if(newPartSet.id === 'handRightAndHead')
            {
                const activePartSet = this.getActivePartSet('head');

                if(activePartSet)
                {
                    const activeParts = activePartSet.parts;

                    if(activeParts)
                    {
                        for(let i = activeParts.length - 1; i >= 0; i--)
                        {
                            const part = activeParts[i];

                            if(!part) continue;

                            if(newPartSet.parts.indexOf(part) === -1) newPartSet.parts.push(part);
                        }
                    }
                }
            }

            this._activePartSets[newPartSet.id] = newPartSet;
        }

        this._isReady = true;

        return true;
    }

    public getPartDefinition(part: string): PartDefinition
    {
        return this._parts[part] || null;
    }

    public getActivePartSet(id: string): ActivePartSet
    {
        return this._activePartSets[id] || null;
    }

    public get isReady(): boolean
    {
        return this._isReady;
    }
}