import { NitroManager } from '../../core/common/NitroManager';
import { AdvancedMap } from '../../core/utils/AdvancedMap';
import { NitroConfiguration } from '../../NitroConfiguration';
import { INitroLocalizationManager } from './INitroLocalizationManager';
import { NitroLocalizationEvent } from './NitroLocalizationEvent';

export class NitroLocalizationManager extends NitroManager implements INitroLocalizationManager
{
    private _definitions: AdvancedMap<string, string>;

    constructor()
    {
        super();

        this._definitions = new AdvancedMap();
    }

    protected onInit(): void
    {
        this.loadLocalizationFromURL(NitroConfiguration.EXTERNAL_TEXTS_URL);
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

        catch(e)
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

        for(let key in data) this._definitions.add(key, data[key]);
    }

    public getValue(key: string): string
    {
        return (this._definitions.getValue(key) || key);
    }
}