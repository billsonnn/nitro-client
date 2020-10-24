import { NitroManager } from '../common/NitroManager';
import { AdvancedMap } from '../utils/AdvancedMap';
import { INitroConfigurationManager } from './INitroConfigurationManager';
import { NitroConfigurationEvent } from './NitroConfigurationEvent';

export class NitroConfigurationManager extends NitroManager implements INitroConfigurationManager
{
    private _definitions: AdvancedMap<string, string>;

    constructor()
    {
        super();

        this._definitions = new AdvancedMap();
    }

    protected onInit(): void
    {
        //@ts-ignore
        this.loadConfigurationFromUrl(NitroConfig.variablesUrl);
    }

    public loadConfigurationFromUrl(url: string): void
    {
        const request = new XMLHttpRequest();

        try
        {
            request.open('GET', url);

            request.onloadend   = this.onConfigurationLoaded.bind(this);
            request.onerror     = this.onConfigurationFailed.bind(this);

            request.send();
        }

        catch(e)
        {
            this.logger.error(e);
        }
    }

    private onConfigurationLoaded(event: ProgressEvent<EventTarget>): void
    {
        if(!event) return;

        const target = (event.target as XMLHttpRequest);

        this.parseConfiguration(target.response);

        this.events && this.events.dispatchEvent(new NitroConfigurationEvent(NitroConfigurationEvent.LOADED));
    }

    private onConfigurationFailed(event: ProgressEvent<EventTarget>): void
    {
        this.events && this.events.dispatchEvent(new NitroConfigurationEvent(NitroConfigurationEvent.FAILED));
    }

    private parseConfiguration(data: any): void
    {
        if(!data) return;

        data = JSON.parse(data);

        const regex = new RegExp(/%(.*?)%/g);

        for(let key in data)
        {
            let value = (data[key] as string);

            const pieces = value.match(regex);

            for(let piece of pieces)
            {
                const existing = this.getValue(piece);

                console.log(piece, existing);
            }

            this._definitions.add(key, value);
        }
    }

    public getValue(key: string): string
    {
        return (this._definitions.getValue(key) || key);
    }

    public setValue(key: string, value: string): void
    {
        this._definitions.add(key, value);
    }
}