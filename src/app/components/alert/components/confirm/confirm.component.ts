import { Component } from '@angular/core';
import { NitroLogger } from '../../../../../client/core/common/logger/NitroLogger';
import { AlertGenericComponent } from '../generic/generic.component';

@Component({
    templateUrl: './confirm.template.html'
})
export class AlertConfirmComponent extends AlertGenericComponent
{
    public callback: Function = null;

    public confirm(): void
    {
        if(this.callback)
        {
            try
            {
                this.callback();
            }

            catch(err)
            {
                NitroLogger.log(err);
            }
        }

        this.close();
    }
}