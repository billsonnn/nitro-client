import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { CallForHelpResultMessageEvent, GetPendingCallsForHelpMessageComposer, IMessageEvent, IssueCloseNotificationMessageEvent, Nitro } from '@nitrots/nitro-renderer';
import { NotificationService } from '../../notification/services/notification.service';
import { CallForHelpResult } from '../common/CallForHelpResult';
import { CallForHelpMainComponent } from '../components/main/main.component';

@Injectable()
export class CallForHelpService implements OnDestroy
{
    private _component: CallForHelpMainComponent;
    private _messages: IMessageEvent[];

    constructor(
        private _notificationService: NotificationService,
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
            new CallForHelpResultMessageEvent(this.onCallForHelpResultMessageEvent.bind(this)),
            new IssueCloseNotificationMessageEvent(this.onIssueCloseNotificationMessageEvent.bind(this))
        ];

        for(const message of this._messages) Nitro.instance.communication.registerMessageEvent(message);
    }

    private unregisterMessages(): void
    {
        if(this._messages && this._messages.length)
        {
            for(const message of this._messages) Nitro.instance.communication.removeMessageEvent(message);
        }
    }

    private onCallForHelpResultMessageEvent(event: CallForHelpResultMessageEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        let message = parser.messageText;

        switch(parser.resultType)
        {
            case CallForHelpResult.TOO_MANY_PENDING_CALLS_CODE:
                Nitro.instance.communication.connection.send(new GetPendingCallsForHelpMessageComposer());
                message = Nitro.instance.getLocalization('${help.cfh.error.pending}');
                this._ngZone.run(() => this._notificationService.alert(message, '${help.cfh.error.title}'));
                break;
            case CallForHelpResult.HAS_ABUSIVE_CALL_CODE:
                message = Nitro.instance.getLocalization('${help.cfh.error.abusive}');
                this._ngZone.run(() => this._notificationService.alert(message, '${help.cfh.error.title}'));
                break;
            default:
                if(message === '')
                {
                    message = Nitro.instance.getLocalization('${help.cfh.sent.text}');
                }
                this._ngZone.run(() => this._notificationService.alert(message, '${help.cfh.sent.title}'));
        }
    }

    private onIssueCloseNotificationMessageEvent(event: IssueCloseNotificationMessageEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        let message = parser.messageText;

        if(message === '')
        {
            message = Nitro.instance.getLocalization('${help.cfh.closed.' + CallForHelpService.getReasonAsString(parser.closeReason) + '}');
        }

        this._ngZone.run(() => this._notificationService.alert(message, '${mod.alert.title}'));
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
