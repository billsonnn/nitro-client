export class ActivePartSet
{
    private _id: string;
    private _parts: string[];

    constructor(data: any)
    {
        if(!data) throw new Error('invalid_data');
        
        this._id    = data['$'].id;
        this._parts = [];

        const parts = data.activePart;

        if(parts) for(let part of parts) this._parts.push(part['$']['set-type']);
    }

    public get id(): string
    {
        return this._id;
    }

    public get parts(): string[]
    {
        return this._parts;
    }
}