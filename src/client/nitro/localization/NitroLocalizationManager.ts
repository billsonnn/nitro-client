import { NitroManager } from '../../core/common/NitroManager';
import { Nitro } from '../Nitro';
import { BadgeBaseAndLevel } from './BadgeBaseAndLevel';
import { INitroLocalizationManager } from './INitroLocalizationManager';
import { NitroLocalizationEvent } from './NitroLocalizationEvent';

export class NitroLocalizationManager extends NitroManager implements INitroLocalizationManager
{
    private _definitions: Map<string, string>;
    private _parameters: Map<string, Map<string, string>>;
    private _romanNumerals: string[];

    constructor()
    {
        super();

        this._definitions   = new Map();
        this._parameters    = new Map();
        this._romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI', 'XXII', 'XXIII', 'XXIV', 'XXV', 'XXVI', 'XXVII', 'XXVIII', 'XXIX', 'XXX'];
    }

    protected onInit(): void
    {
        this.loadLocalizationFromURL(Nitro.instance.getConfiguration<string>('external.texts.url'));
    }

    public loadLocalizationFromURL(url: string): void
    {
        const request = new XMLHttpRequest();

        try
        {
            request.open('GET', url);

            request.onloadend   = this.onLocalizationLoaded.bind(this);
            request.onerror     = this.onLocalizationFailed.bind(this);

            request.send();
        }

        catch (e)
        {
            this.logger.error(e);
        }
    }

    private onLocalizationLoaded(event: ProgressEvent<EventTarget>): void
    {
        if(!event) return;

        const target = (event.target as XMLHttpRequest);

        this.parseLocalization(target.response);

        this.events && this.events.dispatchEvent(new NitroLocalizationEvent(NitroLocalizationEvent.LOADED));
    }

    private onLocalizationFailed(event: ProgressEvent<EventTarget>): void
    {
        this.events && this.events.dispatchEvent(new NitroLocalizationEvent(NitroLocalizationEvent.FAILED));
    }

    private parseLocalization(data: any): void
    {
        if(!data) return;

        data = JSON.parse(data);

        for(const key in data) this._definitions.set(key, data[key]);
    }

    public getRomanNumeral(number: number): string
    {
        return this._romanNumerals[Math.max(0, (number - 1))];
    }

    public getBadgeBaseAndLevel(badgeName: string): string
    {
        const badge = new BadgeBaseAndLevel(badgeName);

        badge.level--;

        return badge.getBadgeId;
    }

    public getValue(key: string, doParams: boolean = true): string
    {
        if(key.startsWith('${')) key = key.substr(2, (key.length - 3));

        let value = (this._definitions.get(key) || key);

        if(doParams)
        {
            const parameters = this._parameters.get(key);

            if(parameters)
            {
                for(const [ parameter, replacement ] of parameters)
                {
                    value = value.replace('%' + parameter + '%', replacement);
                }
            }
        }

        return value;
    }

    public getValueWithParameter(key: string, parameter: string, replacement: string): string
    {
        let value = this.getValue(key, false);

        value = value.replace('%' + parameter + '%', replacement);

        return value;
    }

    public getValueWithParameters(key: string, parameters: string[], replacements: string[]): string
    {
        let value = this.getValue(key, false);

        for(let i = 0; i < parameters.length; i++)
        {
            value = value.replace('%' + parameters[i] + '%', replacements[i]);
        }

        return value;
    }

    public setValue(key: string, value: string): void
    {
        this._definitions.set(key, value);
    }

    public registerParameter(key: string, parameter: string, value: string): void
    {
        if(!key || (key.length === 0) || !parameter || (parameter.length === 0)) return;

        let existing = this._parameters.get(key);

        if(!existing)
        {
            existing = new Map();

            this._parameters.set(key, existing);
        }

        existing.set(parameter, value);
    }
}