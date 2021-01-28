import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IMessageEvent } from '../../../../../client/core/communication/messages/IMessageEvent';
import { RoomCreatedEvent } from '../../../../../client/nitro/communication/messages/incoming/room/engine/RoomCreatedEvent';
import { RoomCreateComposer } from '../../../../../client/nitro/communication/messages/outgoing/room/RoomCreateComposer';
import { NavigatorCategoryDataParser } from '../../../../../client/nitro/communication/messages/parser/navigator/NavigatorCategoryDataParser';
import { Nitro } from '../../../../../client/nitro/Nitro';
import { HabboClubLevelEnum } from '../../../../../client/nitro/session/HabboClubLevelEnum';
import { NavigatorService } from '../../services/navigator.service';
import { RoomLayout } from './RoomLayout';

@Component({
    selector: '[nitro-navigator-room-creator-component]',
    templateUrl: './creator.template.html'
})
export class NavigatorCreatorComponent implements OnInit, OnDestroy
{
    private static MAX_VISITOR_STEPPER: number = 10;
    private static MAX_VISITOR_INCREMENTOR: number = 5;

    private _form: FormGroup;

    private _layouts: RoomLayout[] = [];
    private _maxVisitors: number[] = [];
    private _tradeSettings: string[] = [];

    private _roomCreateListener: IMessageEvent = null;

    constructor(
        private _navigatorService: NavigatorService,
        private _activeModal: NgbActiveModal,
        private _formBuilder: FormBuilder)
    {}

    public ngOnInit(): void
    {
        this.setRoomLayouts();
        this.setMaxVisitors(50);
        this.setTradeSettings();
        this.createForm();

        this._roomCreateListener = new RoomCreatedEvent(this.onRoomCreatedEvent.bind(this));

        Nitro.instance.communication.registerMessageEvent(this._roomCreateListener);
    }

    public ngOnDestroy(): void
    {
        Nitro.instance.communication.removeMessageEvent(this._roomCreateListener);
    }

    private onRoomCreatedEvent(event: RoomCreatedEvent): void
    {
        this.hide();
    }

    private createForm(): void
    {
        let categoryId = 0;

        const category = this.categories[0];

        if(category) categoryId = category.id;

        this._form = this._formBuilder.group({
            roomName: [ '', Validators.required ],
            roomDesc: [ '' ],
            roomLayout: [ this.layouts[0].name, Validators.required ],
            roomCategory: [ categoryId.toString(), Validators.required ],
            roomVisitors: [ (this.maxVisitors[0].toString()), Validators.required ],
            roomTrade: [ '0', Validators.required ],
        });
    }

    public submit(): void
    {
        if(!this.form.valid) return;

        const roomName      = this.roomNameControl.value;
        const roomDesc      = this.roomDescControl.value;
        const roomLayout    = 'model_' + this.roomLayoutControl.value;
        const roomCategory  = parseInt(this.roomCategoryControl.value);
        const roomVisitors  = parseInt(this.roomVisitorsControl.value);
        const roomTrade     = parseInt(this.roomTradeControl.value);

        if(!roomName || (roomName === '')) return;

        Nitro.instance.communication.connection.send(new RoomCreateComposer(roomName, roomDesc, roomLayout, roomCategory, roomVisitors, roomTrade));
    }

    public hide(): void
    {
        this._activeModal.close();
    }

    private setRoomLayouts(): void
    {
        this._layouts = [
            new RoomLayout(HabboClubLevelEnum._Str_3159, 104, 'a'),
            new RoomLayout(HabboClubLevelEnum._Str_3159, 94, 'b'),
            new RoomLayout(HabboClubLevelEnum._Str_3159, 36, 'c'),
            new RoomLayout(HabboClubLevelEnum._Str_3159, 84, 'd'),
            new RoomLayout(HabboClubLevelEnum._Str_3159, 80, 'e'),
            new RoomLayout(HabboClubLevelEnum._Str_3159, 80, 'f'),
            new RoomLayout(HabboClubLevelEnum._Str_3159, 416, 'i'),
            new RoomLayout(HabboClubLevelEnum._Str_3159, 320, 'j'),
            new RoomLayout(HabboClubLevelEnum._Str_3159, 448, 'k'),
            new RoomLayout(HabboClubLevelEnum._Str_3159, 352, 'l'),
            new RoomLayout(HabboClubLevelEnum._Str_3159, 384, 'm'),
            new RoomLayout(HabboClubLevelEnum._Str_3159, 372, 'n'),
            new RoomLayout(HabboClubLevelEnum._Str_2964, 80, 'g'),
            new RoomLayout(HabboClubLevelEnum._Str_2964, 74, 'h'),
            new RoomLayout(HabboClubLevelEnum._Str_2964, 416, 'o'),
            new RoomLayout(HabboClubLevelEnum._Str_2964, 352, 'p'),
            new RoomLayout(HabboClubLevelEnum._Str_2964, 304, 'q'),
            new RoomLayout(HabboClubLevelEnum._Str_2964, 336, 'r'),
            new RoomLayout(HabboClubLevelEnum._Str_2964, 748, 'u'),
            new RoomLayout(HabboClubLevelEnum._Str_2964, 438, 'v'),
            new RoomLayout(HabboClubLevelEnum._Str_2575, 540, 't'),
            new RoomLayout(HabboClubLevelEnum._Str_2575, 512, 'w'),
            new RoomLayout(HabboClubLevelEnum._Str_2575, 396, 'x'),
            new RoomLayout(HabboClubLevelEnum._Str_2575, 440, 'y'),
            new RoomLayout(HabboClubLevelEnum._Str_2575, 456, 'z'),
            new RoomLayout(HabboClubLevelEnum._Str_2575, 208, '0'),
            new RoomLayout(HabboClubLevelEnum._Str_2575, 1009, '1'),
            new RoomLayout(HabboClubLevelEnum._Str_2575, 1044, '2'),
            new RoomLayout(HabboClubLevelEnum._Str_2575, 183, '3'),
            new RoomLayout(HabboClubLevelEnum._Str_2575, 254, '4'),
            new RoomLayout(HabboClubLevelEnum._Str_2575, 1024, '5'),
            new RoomLayout(HabboClubLevelEnum._Str_2575, 801, '6'),
            new RoomLayout(HabboClubLevelEnum._Str_2575, 354, '7'),
            new RoomLayout(HabboClubLevelEnum._Str_2575, 888, '8'),
            new RoomLayout(HabboClubLevelEnum._Str_2575, 926, '9')
        ];
    }

    private setMaxVisitors(count: number): void
    {
        this._maxVisitors = [];

        let i = NavigatorCreatorComponent.MAX_VISITOR_STEPPER;

        while(i <= count)
        {
            this._maxVisitors.push(i);

            i += NavigatorCreatorComponent.MAX_VISITOR_INCREMENTOR;
        }
    }

    private setTradeSettings(): void
    {
        this._tradeSettings = [];

        this._tradeSettings.push(...[
            '${navigator.roomsettings.trade_not_allowed}',
            '${navigator.roomsettings.trade_not_with_Controller}',
            '${navigator.roomsettings.trade_allowed}'
        ]);
    }

    public setRoomLayout(name: string): void
    {
        const control = this.roomLayoutControl;

        if(!control) return;

        control.setValue(name);
    }

    public getRoomLayoutImageUrl(name: string): string
    {
        let imageUrl = Nitro.instance.getConfiguration<string>('images.url');

        imageUrl += `/navigator/models/model_${ name }.png`;

        return imageUrl;
    }

    public get form(): FormGroup
    {
        return this._form;
    }

    public get categories(): NavigatorCategoryDataParser[]
    {
        return this._navigatorService.categories;
    }

    public get layouts(): RoomLayout[]
    {
        return this._layouts;
    }

    public get maxVisitors(): number[]
    {
        return this._maxVisitors;
    }

    public get tradeSettings(): string[]
    {
        return this._tradeSettings;
    }

    public get roomNameControl(): AbstractControl
    {
        return (this._form.controls.roomName as AbstractControl);
    }

    public get roomDescControl(): AbstractControl
    {
        return (this._form.controls.roomDesc as AbstractControl);
    }

    public get roomLayoutControl(): AbstractControl
    {
        return (this._form.controls.roomLayout as AbstractControl);
    }

    public get roomCategoryControl(): AbstractControl
    {
        return (this._form.controls.roomCategory as AbstractControl);
    }

    public get roomVisitorsControl(): AbstractControl
    {
        return (this._form.controls.roomVisitors as AbstractControl);
    }

    public get roomTradeControl(): AbstractControl
    {
        return (this._form.controls.roomTrade as AbstractControl);
    }

    public get isLoading(): boolean
    {
        return false;
    }
}