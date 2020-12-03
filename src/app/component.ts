import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ConfigurationEvent } from '../client/core/configuration/ConfigurationEvent';
import { NitroEvent } from '../client/core/events/NitroEvent';
import { AvatarRenderEvent } from '../client/nitro/avatar/events/AvatarRenderEvent';
import { NitroCommunicationDemoEvent } from '../client/nitro/communication/demo/NitroCommunicationDemoEvent';
import { NitroLocalizationEvent } from '../client/nitro/localization/NitroLocalizationEvent';
import { Nitro } from '../client/nitro/Nitro';
import { RoomEngineEvent } from '../client/nitro/room/events/RoomEngineEvent';
import { WebGL } from '../client/nitro/utils/WebGL';

@Component({
	selector: 'app-root',
    template: `
    <div id="nitro">
        <nitro-loading *ngIf="!isReady || isError" [message]="message" [percentage]="percentage" [hideProgress]="hideProgress"></nitro-loading>
        <nitro-main-component *ngIf="isReady && !isError"></nitro-main-component>
    </div>`
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

    constructor(
        private _ngZone: NgZone) {}

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

            Nitro.instance.events.addEventListener(NitroCommunicationDemoEvent.CONNECTION_ESTABLISHED, this.onNitroEvent.bind(this));
            Nitro.instance.events.addEventListener(NitroCommunicationDemoEvent.CONNECTION_HANDSHAKING, this.onNitroEvent.bind(this));
            Nitro.instance.events.addEventListener(NitroCommunicationDemoEvent.CONNECTION_HANDSHAKE_FAILED, this.onNitroEvent.bind(this));
            Nitro.instance.events.addEventListener(NitroCommunicationDemoEvent.CONNECTION_AUTHENTICATED, this.onNitroEvent.bind(this));
            Nitro.instance.events.addEventListener(NitroCommunicationDemoEvent.CONNECTION_ERROR, this.onNitroEvent.bind(this));
            Nitro.instance.events.addEventListener(NitroCommunicationDemoEvent.CONNECTION_CLOSED, this.onNitroEvent.bind(this));
            Nitro.instance.localization.events.addEventListener(NitroLocalizationEvent.LOADED, this.onNitroEvent.bind(this));
            Nitro.instance.roomEngine.events.addEventListener(RoomEngineEvent.ENGINE_INITIALIZED, this.onNitroEvent.bind(this));
            Nitro.instance.avatar.events.addEventListener(AvatarRenderEvent.AVATAR_RENDER_READY, this.onNitroEvent.bind(this));
            Nitro.instance.core.configuration.events.addEventListener(ConfigurationEvent.LOADED, this.onNitroEvent.bind(this));
            Nitro.instance.core.configuration.events.addEventListener(ConfigurationEvent.FAILED, this.onNitroEvent.bind(this));

            Nitro.instance.core.configuration.init(); 
        });
    }

    public ngOnDestroy(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            Nitro.instance.events.removeEventListener(NitroCommunicationDemoEvent.CONNECTION_ESTABLISHED, this.onNitroEvent.bind(this));
            Nitro.instance.events.removeEventListener(NitroCommunicationDemoEvent.CONNECTION_HANDSHAKING, this.onNitroEvent.bind(this));
            Nitro.instance.events.removeEventListener(NitroCommunicationDemoEvent.CONNECTION_HANDSHAKE_FAILED, this.onNitroEvent.bind(this));
            Nitro.instance.events.removeEventListener(NitroCommunicationDemoEvent.CONNECTION_AUTHENTICATED, this.onNitroEvent.bind(this));
            Nitro.instance.events.removeEventListener(NitroCommunicationDemoEvent.CONNECTION_ERROR, this.onNitroEvent.bind(this));
            Nitro.instance.events.removeEventListener(NitroCommunicationDemoEvent.CONNECTION_CLOSED, this.onNitroEvent.bind(this));
            Nitro.instance.localization.events.removeEventListener(NitroLocalizationEvent.LOADED, this.onNitroEvent.bind(this));
            Nitro.instance.roomEngine.events.removeEventListener(RoomEngineEvent.ENGINE_INITIALIZED, this.onNitroEvent.bind(this));
            Nitro.instance.avatar.events.removeEventListener(AvatarRenderEvent.AVATAR_RENDER_READY, this.onNitroEvent.bind(this));
            Nitro.instance.core.configuration.events.removeEventListener(ConfigurationEvent.LOADED, this.onNitroEvent.bind(this));
            Nitro.instance.core.configuration.events.removeEventListener(ConfigurationEvent.FAILED, this.onNitroEvent.bind(this));
        });
    }

    private getPreloadAssetUrls(): string[]
    {
        let urls: string[] = [];

        const assetUrls = Nitro.instance.getConfiguration<string[]>('preload.assets.urls');

        if(assetUrls && assetUrls.length)
        {
            for(let url of assetUrls)
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
                Nitro.instance.core.asset.downloadAssets(this.getPreloadAssetUrls(), (status: boolean) =>
                {
                    Nitro.instance.communication.init();
                });
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

                    setTimeout(() => location.reload(), 1500);
                });
                return;
			case NitroCommunicationDemoEvent.CONNECTION_HANDSHAKING:
                this._ngZone.run(() =>
                {
                    this.message        = 'Handshaking';
                    this.percentage     = (this.percentage + 20);
                    this.hideProgress   = false;
                });
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
                });
                
                Nitro.instance.init();
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
                break;
            case NitroLocalizationEvent.LOADED:
                this._ngZone.run(() =>
                {
                    this.isLocalizationReady    = true;
                    this.percentage             = (this.percentage + 20);
                    this.hideProgress           = false;
                });
                break;
            case RoomEngineEvent.ENGINE_INITIALIZED:
                this._ngZone.run(() =>
                {
                    this.isRoomEngineReady      = true;
                    this.percentage             = (this.percentage + 20);
                    this.hideProgress           = false;
                });

                Nitro.instance.communication.connection.onReady();
                break;
            case AvatarRenderEvent.AVATAR_RENDER_READY:
                this._ngZone.run(() =>
                {
                    this.isAvatarRenderReady    = true;
                    this.percentage             = (this.percentage + 20);
                    this.hideProgress           = false;
                });
                break;
        }
    }

    public get isReady(): boolean
    {
        return ((this.isLocalizationReady && this.isRoomEngineReady && this.isAvatarRenderReady) || false);
    }
}
