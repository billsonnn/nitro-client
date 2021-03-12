import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { AdvancedMap } from '../../../client/core/utils/AdvancedMap';
import { Nitro } from '../../../client/nitro/Nitro';
import { RoomEngineSamplePlaybackEvent } from '../../../client/nitro/room/events/RoomEngineSamplePlaybackEvent';
import { UserSettingsService } from '../../components/user-settings/services/user-settings.service';

@Injectable()
export class SoundService implements OnDestroy
{
    private _internalSamples: AdvancedMap<string, HTMLAudioElement>;
    private _externalSamples: AdvancedMap<number, HTMLAudioElement>;

    constructor(
        private _ngZone: NgZone,
        private _userSettingsService: UserSettingsService)
    {
        this._internalSamples                = new AdvancedMap();
        this._externalSamples                = new AdvancedMap();

        this.onRoomEngineSamplePlaybackEvent = this.onRoomEngineSamplePlaybackEvent.bind(this);

        this.registerMessages();
    }

    public ngOnDestroy(): void
    {
        this.unregisterMessages();
    }

    private registerMessages(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            Nitro.instance.roomEngine.events.addEventListener(RoomEngineSamplePlaybackEvent.PLAY_SAMPLE, this.onRoomEngineSamplePlaybackEvent);
        });
    }

    public unregisterMessages(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            Nitro.instance.roomEngine.events.removeEventListener(RoomEngineSamplePlaybackEvent.PLAY_SAMPLE, this.onRoomEngineSamplePlaybackEvent);
        });
    }

    private onRoomEngineSamplePlaybackEvent(event: RoomEngineSamplePlaybackEvent): void
    {
        if(!event) return;

        this.playExternalSample(event.sampleId, this.volumeFurni, event.pitch);
    }

    public playInternalSample(sampleId: string): void
    {
        if(!this._internalSamples.hasKey(sampleId))
        {
            this._internalSamples.add(sampleId, new Audio('assets/sounds/' + sampleId + '.mp3'));
        }

        this._playAudio(this._internalSamples.getValue(sampleId), this.volumeSystem);
    }

    public playExternalSample(sampleId: number, volume: number, pitch: number = 1): void
    {
        if(!this._externalSamples.hasKey(sampleId))
        {
            const samplesUrl = Nitro.instance.getConfiguration<string>('external.samples.url');

            this._externalSamples.add(sampleId, new Audio(samplesUrl.replace('%sample%', sampleId.toString())));
        }

        this._playAudio(this._externalSamples.getValue(sampleId), volume, pitch);
    }

    private _playAudio(audio: HTMLAudioElement, volume: number, pitch: number = 1): void
    {
        const clonedAudio = <HTMLAudioElement>audio.cloneNode();
        clonedAudio.volume = volume;
        clonedAudio.play();
    }

    public get volumeSystem(): number
    {
        return this._userSettingsService.volumeSystem;
    }

    public get volumeFurni(): number
    {
        return this._userSettingsService.volumeFurni;
    }

    public get volumeTrax(): number
    {
        return this._userSettingsService.volumeTrax;
    }
}
