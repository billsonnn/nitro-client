import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ConfigurationEvent } from '../client/core/configuration/ConfigurationEvent';
import { NitroEvent } from '../client/core/events/NitroEvent';
import { NitroCommunicationDemoEvent } from '../client/nitro/communication/demo/NitroCommunicationDemoEvent';
import { LegacyExternalInterface } from '../client/nitro/externalInterface/LegacyExternalInterface';
import { NitroLocalizationEvent } from '../client/nitro/localization/NitroLocalizationEvent';
import { Nitro } from '../client/nitro/Nitro';
import { WebGL } from '../client/nitro/utils/WebGL';
import { SettingsService } from './core/settings/service';

@Component({
    selector: 'app-root',
    templateUrl: './app.template.html'
})
export class AppComponent implements OnInit, OnDestroy
{
    public message: string              = 'Starting';
    public percentage: number           = 0;
    public hideProgress: boolean        = false;
    public isLocalizationReady: boolean = false;
    public isRoomEngineReady: boolean   = false;
    public isAvatarRenderReady: boolean = false;
    public isError: boolean             = false;

    private _connectionTimeout: ReturnType<typeof setTimeout>;

    private _isReady: boolean = false;

    constructor(
        private _settingsService: SettingsService,
        private _ngZone: NgZone)
    {
        this.onNitroEvent = this.onNitroEvent.bind(this);
    }

    public ngOnInit(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            //@ts-ignore
            if(!NitroConfig) throw new Error('NitroConfig is not defined!');

            if(!WebGL.isWebGLAvailable())
            {
                this.onNitroEvent(new NitroEvent(Nitro.WEBGL_UNAVAILABLE));

                return;
            }

            if(!Nitro.instance) Nitro.bootstrap();

            Nitro.instance.events.addEventListener(NitroCommunicationDemoEvent.CONNECTION_HANDSHAKING, this.onNitroEvent);
            Nitro.instance.events.addEventListener(NitroCommunicationDemoEvent.CONNECTION_HANDSHAKE_FAILED, this.onNitroEvent);
            Nitro.instance.events.addEventListener(NitroCommunicationDemoEvent.CONNECTION_AUTHENTICATED, this.onNitroEvent);
            Nitro.instance.events.addEventListener(NitroCommunicationDemoEvent.CONNECTION_ERROR, this.onNitroEvent);
            Nitro.instance.events.addEventListener(NitroCommunicationDemoEvent.CONNECTION_CLOSED, this.onNitroEvent);
            Nitro.instance.localization.events.addEventListener(NitroLocalizationEvent.LOADED, this.onNitroEvent);
            Nitro.instance.core.configuration.events.addEventListener(ConfigurationEvent.LOADED, this.onNitroEvent);
            Nitro.instance.core.configuration.events.addEventListener(ConfigurationEvent.FAILED, this.onNitroEvent);

            Nitro.instance.core.configuration.init();

            this._connectionTimeout = setTimeout(this.onConnectionTimeout, 15 * 1000);
        });
    }

    public ngOnDestroy(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            Nitro.instance.events.removeEventListener(NitroCommunicationDemoEvent.CONNECTION_HANDSHAKING, this.onNitroEvent);
            Nitro.instance.events.removeEventListener(NitroCommunicationDemoEvent.CONNECTION_HANDSHAKE_FAILED, this.onNitroEvent);
            Nitro.instance.events.removeEventListener(NitroCommunicationDemoEvent.CONNECTION_AUTHENTICATED, this.onNitroEvent);
            Nitro.instance.events.removeEventListener(NitroCommunicationDemoEvent.CONNECTION_ERROR, this.onNitroEvent);
            Nitro.instance.events.removeEventListener(NitroCommunicationDemoEvent.CONNECTION_CLOSED, this.onNitroEvent);
            Nitro.instance.localization.events.removeEventListener(NitroLocalizationEvent.LOADED, this.onNitroEvent);
            Nitro.instance.core.configuration.events.removeEventListener(ConfigurationEvent.LOADED, this.onNitroEvent);
            Nitro.instance.core.configuration.events.removeEventListener(ConfigurationEvent.FAILED, this.onNitroEvent);

            clearTimeout(this._connectionTimeout);
        });
    }

    private getPreloadAssetUrls(): string[]
    {
        const urls: string[] = [];

        const assetUrls = Nitro.instance.getConfiguration<string[]>('preload.assets.urls');

        if(assetUrls && assetUrls.length)
        {
            for(const url of assetUrls)
            {
                urls.push(Nitro.instance.core.configuration.interpolate(url));
            }
        }

        return urls;
    }

    private onNitroEvent(event: NitroEvent): void
    {
        if(!event) return;

        switch(event.type)
        {
            case ConfigurationEvent.LOADED:
                Nitro.instance.localization.init();
                return;
            case ConfigurationEvent.FAILED:
                this._ngZone.run(() =>
                {
                    this.isError        = true;
                    this.message        = 'Configuration Failed';
                    this.percentage     = 0;
                    this.hideProgress   = true;
                });
                return;
            case Nitro.WEBGL_UNAVAILABLE:
                this._ngZone.run(() =>
                {
                    this.isError        = true;
                    this.message        = 'WebGL Required';
                    this.percentage     = 0;
                    this.hideProgress   = true;
                });
                return;
            case Nitro.WEBGL_CONTEXT_LOST:
                this._ngZone.run(() =>
                {
                    this.isError        = true;
                    this.message        = 'WebGL Context Lost - Reloading';
                    this.percentage     = 0;
                    this.hideProgress   = true;
                });

                setTimeout(() => location.reload(), 1500);
                return;
            case NitroCommunicationDemoEvent.CONNECTION_HANDSHAKING:
                this._ngZone.run(() =>
                {
                    this.message        = 'Handshaking';
                    this.percentage     = (this.percentage + 20);
                    this.hideProgress   = false;
                });

                clearTimeout(this._connectionTimeout);

                this._connectionTimeout = null;
                break;
            case NitroCommunicationDemoEvent.CONNECTION_HANDSHAKE_FAILED:
                this._ngZone.run(() =>
                {
                    this.isError        = true;
                    this.message        = 'Handshake Failed';
                    this.percentage     = 0;
                    this.hideProgress   = true;
                });
                break;
            case NitroCommunicationDemoEvent.CONNECTION_AUTHENTICATED:
                this._ngZone.run(() =>
                {
                    this.message        = 'Preparing Nitro';
                    this.percentage     = (this.percentage + 20);
                    this.hideProgress   = false;

                    this._isReady = true;
                });

                Nitro.instance.init();

                clearTimeout(this._connectionTimeout);

                this._connectionTimeout = null;
                break;
            case NitroCommunicationDemoEvent.CONNECTION_ERROR:
                this._ngZone.run(() =>
                {
                    this.isError        = true;
                    this.message        = 'Connection Error';
                    this.percentage     = 0;
                    this.hideProgress   = true;
                });
                break;
            case NitroCommunicationDemoEvent.CONNECTION_CLOSED:
                if(Nitro.instance.roomEngine) Nitro.instance.roomEngine.dispose();

                this._ngZone.run(() =>
                {
                    this.isError        = true;
                    this.message        = 'Connection Closed';
                    this.percentage     = 0;
                    this.hideProgress   = true;
                });

                LegacyExternalInterface.call('disconnect', -1, 'client.init.handshake.fail');
                break;
            case NitroLocalizationEvent.LOADED:
                this._ngZone.run(() =>
                {
                    this.percentage     = (this.percentage + 20);
                    this.hideProgress   = false;
                });

                Nitro.instance.core.asset.downloadAssets(this.getPreloadAssetUrls(), (status: boolean) =>
                {
                    Nitro.instance.communication.init();
                });
                break;
        }
    }

    /**
     * On Flash, if an origin TCP socket is unreachable (e.g. the server is down)
     * the initial crossdomain security check fails due to a timeout. This timeout
     * simulates the failing crossdomain security check.
     */
    private onConnectionTimeout(): void
    {
        LegacyExternalInterface.call('logDebug', 'TcpAuth control socket security error');
    }


    public get isReady(): boolean
    {
        return this._isReady;
    }
}
