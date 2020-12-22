import { Component } from '@angular/core';
import { AlertService } from '../../services/alert.service';

@Component({
    templateUrl: './generic.template.html'
})
export class AlertGenericComponent
{
    public title: string    = '';
    public message: string  = '';

    constructor(
        private _alertService: AlertService
    ) {}

    public close(): void
    {
        this._alertService.closeAlert(this);
    }
}