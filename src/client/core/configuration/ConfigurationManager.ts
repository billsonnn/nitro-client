import { NitroManager } from '../common/NitroManager';
import { AdvancedMap } from '../utils/AdvancedMap';
import { ConfigurationEvent } from './ConfigurationEvent';
import { IConfigurationManager } from './IConfigurationManager';

export class ConfigurationManager extends NitroManager implements IConfigurationManager
{
    private _definitions: AdvancedMap<string, unknown>;

    constructor()
    {
        super();

        this._definitions = new AdvancedMap();
    }

    protected onInit(): void
    {
        //@ts-ignore
        this.loadConfigurationFromUrl(NitroConfig.configurationUrl);
    }

    public loadConfigurationFromUrl(url: string): void
    {
        if(!url || (url === ''))
        {
            this.dispatchConfigurationEvent(ConfigurationEvent.FAILED);

            return;
        }
        
        const request = new XMLHttpRequest();

        try
        {
            request.open('GET', url);

            request.onloadend   = this.onConfigurationLoaded.bind(this);
            request.onerror     = this.onConfigurationFailed.bind(this);

            request.send();
        }

        catch (e)
        {
            this.logger.error(e);
        }
    }

    private onConfigurationLoaded(event: ProgressEvent<EventTarget>): void
    {
        if(!event) return;

        const target = (event.target as XMLHttpRequest);

        if(this.parseConfiguration(target.response))
        {
            this.dispatchConfigurationEvent(ConfigurationEvent.LOADED);

            return;
        }

        this.dispatchConfigurationEvent(ConfigurationEvent.FAILED);
    }

    private onConfigurationFailed(event: ProgressEvent<EventTarget>): void
    {
        this.dispatchConfigurationEvent(ConfigurationEvent.FAILED);
    }

    private dispatchConfigurationEvent(type: string): void
    {
        this.events && this.events.dispatchEvent(new ConfigurationEvent(type));
    }

    private parseConfiguration(data: string): boolean
    {
        if(!data || (data === '')) return false;

        const configObject = JSON.parse(data);

        const regex = new RegExp(/%(.*?)%/g);

        for(const key in configObject)
        {
            let value = configObject[key];

            if(typeof value === 'string')
            {
                value = this.interpolate((value as string), regex);
            }

            this._definitions.add(key, value);
        }

        return true;
    }

    public interpolate(value: string, regex: RegExp = null): string
    {
        if(!regex) regex = new RegExp(/%(.*?)%/g);

        const pieces = value.match(regex);

        if(pieces && pieces.length)
        {
            for(const piece of pieces)
            {
                const existing = (this._definitions.getValue(this.removeInterpolateKey(piece)) as string);

                if(existing) (value = value.replace(piece, existing));
            }
        }

        return value;
    }

    private removeInterpolateKey(value: string): string
    {
        return value.replace(/%/g, '');
    }

    public getValue<T>(key: string, value: T = null): T
    {
        let existing = this._definitions.getValue(key);

        if(existing === undefined) existing = value;

        return (existing as T);
    }

    public setValue(key: string, value: string): void
    {
        this._definitions.add(key, value);
    }
}