import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavigatorService } from '../service';

@Component({
    selector: '[nitro-navigator-room-creator-component]',
    template: `
    <div class="container">
        <div class="row">
            <div class="col-12">
                <form [formGroup]="form" novalidate>
                    <div class="form-group">
                        <label>{{ ('navigator.createroom.roomnameinfo') | translate }}</label>
                        <input type="text" class="form-control" formControlName="roomName">
                    </div>
                    <div class="form-group">
                        <label>{{ ('navigator.createroom.roomdescinfo') | translate }}</label>
                        <textarea class="form-control" formControlName="roomDesc"></textarea>
                    </div>
                </form>
            </div>
        </div>
    </div>`
})
export class NavigatorRoomCreatorComponent implements OnInit
{
    private _form: FormGroup;

    constructor(
        private _formBuilder: FormBuilder,
        private _navigatorService: NavigatorService) {}

    public ngOnInit(): void
    {
        this._form = this._formBuilder.group({
            roomName: [ null ],
            roomDesc: [ null ]
        });
    }

    public get form(): FormGroup
    {
        return this._form;
    }
}