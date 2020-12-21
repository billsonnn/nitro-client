import { Component } from '@angular/core';
import { AlertGenericComponent } from '../generic/generic.component';

@Component({
    templateUrl: './multiple-messages.template.html'
})
export class AlertMultipleMessagesComponent extends AlertGenericComponent
{
    public messages: string[] = [];
}