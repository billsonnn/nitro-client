import moment from 'moment';
import { INitroLogger } from './INitroLogger';

export class NitroLogger implements INitroLogger
{
    private static LAST_TIMESTAMP: number = Date.now();

    private _name: string;
    private _description: string | number;
    private _print: boolean;
    
    constructor(name: string, description: string | number = null)
    {
        this._name          = name;
        this._description   = description;
        this._print         = true;
    }
    
    public log(message: any): void
    {
        this.printMessage(message, null);
    }
    
    public error(message: any, trace?: any): void
    {
        this.printMessage(trace || message, null);
    }
    
    public warn(message: any): void
    {
        this.printMessage(message, null);
    }
    
    public printMessage(message: any, color?: any): void
    {
        if(!this._print) return;
        
        console.log(`[Nitro] ${ moment().format('M/D/YY h:mm:ss A') } [${ this._name }] ${ message } ${ this.getTimestamp() }`);
    }

    private getTimestamp(): string
    {
        const now = Date.now();

        const result = ` +${ now - NitroLogger.LAST_TIMESTAMP || 0 }ms`;
        
        NitroLogger.LAST_TIMESTAMP = now;

        return result;
    }

    public get description(): string | number
    {
        return this._description;
    }

    public set description(description: string | number)
    {
        this._description = description;
    }

    public get print(): boolean
    {
        return this._print;
    }

    public set print(flag: boolean)
    {
        this._print = flag;
    }
}