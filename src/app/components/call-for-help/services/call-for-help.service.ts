import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { IMessageEvent } from '../../../../client/core/communication/messages/IMessageEvent';
import { CallForHelpResultMessageEvent } from '../../../../client/nitro/communication/messages/incoming/help/CallForHelpResultMessageEvent';
import { Nitro } from '../../../../client/nitro/Nitro';
import { AlertService } from '../../alert/services/alert.service';
import { CallForHelpMainComponent } from '../components/main/main.component';

@Injectable()
export class CallForHelpService implements OnDestroy
{
    private _component: CallForHelpMainComponent;
    private _messages: IMessageEvent[];

    constructor(
        private _alertService: AlertService,
        private _ngZone: NgZone)
    {
        this._component = null;

        this.registerMessages();
    }

    private static getReasonAsString(k: number): string
    {
        switch(k)
        {
            case 1:
                return 'useless';
            case 2:
                return 'abusive';
            default:
                return 'resolved';
        }
    }

    public ngOnDestroy(): void
    {
        this.unregisterMessages();
    }

    private registerMessages(): void
    {
        if(this._messages) this.unregisterMessages();

        this._messages = [
            new CallForHelpResultMessageEvent(this.onCallForHelpResultMessageEvent.bind(this))
        ];

        for(let message of this._messages) Nitro.instance.communication.registerMessageEvent(message);
    }

    private unregisterMessages(): void
    {
        if(this._messages && this._messages.length)
        {
            for(let message of this._messages) Nitro.instance.communication.removeMessageEvent(message);
        }
    }

    private onCallForHelpResultMessageEvent(event: CallForHelpResultMessageEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        let message = parser.messageText;

        if(message === '')
        {
            message = Nitro.instance.getLocalization('${help.cfh.closed.' + CallForHelpService.getReasonAsString(parser.resultType) + '}');
        }

        this._ngZone.run(() => this._alertService.alert(message, '${mod.alert.title}'));
    }

    public get component(): CallForHelpMainComponent
    {
        return this._component;
    }

    public set component(component: CallForHelpMainComponent)
    {
        this._component = component;
    }
}