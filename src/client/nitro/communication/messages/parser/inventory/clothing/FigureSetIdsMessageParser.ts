﻿import { IMessageDataWrapper } from '../../../../../../core/communication/messages/IMessageDataWrapper';
import { IMessageParser } from '../../../../../../core/communication/messages/IMessageParser';

export class FigureSetIdsMessageParser implements IMessageParser
{
    private _figureSetIds: number[];
    private _boundFurnitureNames: string[]

    public flush(): boolean
    {
        this._figureSetIds          = [];
        this._boundFurnitureNames   = [];

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        let totalSetIds = wrapper.readInt();

        while(totalSetIds > 0)
        {
            this._figureSetIds.push(wrapper.readInt());

            totalSetIds--;
        }

        let totalFurnitureNames = wrapper.readInt();

        while(totalFurnitureNames > 0)
        {
            this._boundFurnitureNames.push(wrapper.readString());

            totalFurnitureNames--;
        }
        
        return true;
    }

    public get _Str_23010(): number[]
    {
        return this._figureSetIds;
    }

    public get _parser9(): string[]
    {
        return this._boundFurnitureNames;
    }
}