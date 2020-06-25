﻿export class NumberBank 
{
    private _reservedNumbers: number[];
    private _freeNumbers: number[];

    constructor(k: number)
    {
        if(k < 0) k = 0;

        this._reservedNumbers   = [];
        this._freeNumbers       = [];

        let i = 0;

        while(i < k)
        {
            this._freeNumbers.push(i);

            i++;
        }
    }

    public dispose(): void
    {
        this._reservedNumbers   = null;
        this._freeNumbers       = null;
    }

    public _Str_19709(): number
    {
        if (this._freeNumbers.length > 0)
        {
            let k = this._freeNumbers.pop();

            this._reservedNumbers.push(k);

            return k;
        }

        return -1;
    }

    public _Str_15187(k: number): void
    {
        let i = this._reservedNumbers.indexOf(k);

        if(i >= 0)
        {
            this._reservedNumbers.splice(i, 1);

            this._freeNumbers.push(k);
        }
    }
}