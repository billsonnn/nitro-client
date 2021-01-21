import { Injectable } from '@angular/core';

@Injectable()
export class SoundService
{
    private _messengerSound: HTMLAudioElement = null;

    constructor()
    {
        this._messengerSound = new Audio('assets/sounds/new_message.mp3');
    }

    public playMessengerSound(): void
    {
        const audio = this._messengerSound;

        if(audio) audio.play();
    }
}