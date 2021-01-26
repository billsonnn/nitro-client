import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NavigatorService } from '../../services/navigator.service';

@Component({
    selector: '[nitro-navigator-room-password-component]',
    templateUrl: './password.template.html'
})
export class NavigatorPasswordComponent
{
    constructor(
        private _navigatorService: NavigatorService,
        private _activeModal: NgbActiveModal)
    {}
}