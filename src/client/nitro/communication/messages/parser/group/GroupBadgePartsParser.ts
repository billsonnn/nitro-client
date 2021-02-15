import { IMessageDataWrapper } from '../../../../../core/communication/messages/IMessageDataWrapper';
import { IMessageParser } from '../../../../../core/communication/messages/IMessageParser';

export class GroupBadgePartsParser implements IMessageParser
{
    private _bases: Map<number, string[]>;
    private _symbols: Map<number, string[]>;
    private _baseColors: Map<number, string>;
    private _symbolColors: Map<number, string>;
    private _backgroundColors: Map<number, string>;

    flush(): boolean
    {
        this._bases             = new Map();
        this._symbols           = new Map();
        this._baseColors        = new Map();
        this._symbolColors      = new Map();
        this._backgroundColors  = new Map();

        return true;
    }

    parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        let basesCount = wrapper.readInt();

        while(basesCount > 0)
        {
            const id        = wrapper.readInt();
            const valueA    = wrapper.readString();
            const valueB    = wrapper.readString();

            this._bases.set(id, [valueA, valueB]);
            basesCount--;
        }

        let symbolsCount = wrapper.readInt();

        while(symbolsCount > 0)
        {
            const id        = wrapper.readInt();
            const valueA    = wrapper.readString();
            const valueB    = wrapper.readString();

            this._symbols.set(id, [valueA, valueB]);
            symbolsCount--;
        }

        let baseColorsCount = wrapper.readInt();

        while(baseColorsCount > 0)
        {
            const id    = wrapper.readInt();
            const color = wrapper.readString();

            this._baseColors.set(id, color);
            baseColorsCount--;
        }

        let symbolColorsCount = wrapper.readInt();

        while(symbolColorsCount > 0)
        {
            const id    = wrapper.readInt();
            const color = wrapper.readString();

            this._symbolColors.set(id, color);
            symbolColorsCount--;
        }

        let backgroundColorsCount = wrapper.readInt();

        while(backgroundColorsCount > 0)
        {
            const id    = wrapper.readInt();
            const color = wrapper.readString();

            this._backgroundColors.set(id, color);
            backgroundColorsCount--;
        }
        return true;
    }
    
    public get bases(): Map<number, string[]>
    {
        return this._bases;
    }

    public get symbols(): Map<number, string[]>
    {
        return this._symbols;
    }

    public get baseColors(): Map<number, string>
    {
        return this._baseColors;
    }

    public get symbolColors(): Map<number, string>
    {
        return this._symbolColors;
    }

    public get backgroundColors(): Map<number, string>
    {
        return this._backgroundColors;
    }
}
