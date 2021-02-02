import { Options } from '@angular-slider/ngx-slider';
import { Component, NgZone } from '@angular/core';
import { IEventDispatcher } from '../../../../../../client/core/events/IEventDispatcher';
import { ConversionTrackingWidget } from '../../../../../../client/nitro/ui/widget/ConversionTrackingWidget';
import { RoomWidgetDimmerStateUpdateEvent } from '../../events/RoomWidgetDimmerStateUpdateEvent';
import { RoomWidgetDimmerUpdateEvent } from '../../events/RoomWidgetDimmerUpdateEvent';
import { FurnitureDimmerWidgetHandler } from '../../handlers/FurnitureDimmerWidgetHandler';
import { RoomWidgetDimmerChangeStateMessage } from '../../messages/RoomWidgetDimmerChangeStateMessage';
import { RoomWidgetDimmerPreviewMessage } from '../../messages/RoomWidgetDimmerPreviewMessage';
import { RoomWidgetDimmerSavePresetMessage } from '../../messages/RoomWidgetDimmerSavePresetMessage';
import { FurnitureMannequinWidgetHandler } from '../../handlers/FurnitureMannequinWidgetHandler';
import { RoomControllerLevel } from '../../../../../../client/nitro/session/enum/RoomControllerLevel';
import { AvatarFigurePartType } from '../../../../../../client/nitro/avatar/enum/AvatarFigurePartType';
import {AvatarFigureContainer} from "../../../../../../client/nitro/avatar/AvatarFigureContainer";
import {FurnitureMultiStateComposer} from "../../../../../../client/nitro/communication/messages/outgoing/room/furniture/logic/FurnitureMultiStateComposer";

@Component({
    selector: 'nitro-room-furniture-mannequin-component',
    templateUrl: './dimmer.template.html'
})
export class MannequinWidget extends ConversionTrackingWidget
{
    private static readonly _Str_9305:number = 0;
    private static readonly _Str_11074:number = 1;
    private static readonly _Str_10942:number = 2;
    private static readonly _Str_8565:number = 3;
    private static readonly _Str_9053:number = 4;
    private _visible: boolean       = false;
    private _furniId: number;
    private _figure: string;
    private _gender: string;
    private _outfitName: string;

    constructor(
        private _ngZone: NgZone)
    {
        super();

    }

    public registerUpdateEvents(eventDispatcher: IEventDispatcher): void
    {
        if(!eventDispatcher) return;

        super.registerUpdateEvents(eventDispatcher);
    }

    public unregisterUpdateEvents(eventDispatcher: IEventDispatcher): void
    {
        if(!eventDispatcher) return;

        super.unregisterUpdateEvents(eventDispatcher);
    }

    public get handler(): FurnitureMannequinWidgetHandler
    {
        return (this.widgetHandler as FurnitureMannequinWidgetHandler);
    }

    public hide(): void
    {
        this._visible = false;
    }
    public get visible(): boolean
    {
        return this._visible;
    }

    public set visible(flag: boolean)
    {
        this._visible = flag;
    }

    private _Str_24391(k:boolean, _arg_2:string, _arg_3:number, _arg_4:string, _arg_5:number):number
    {
        if(k)
        {
            return MannequinWidget._Str_9305;
        }
        if(_arg_2.toLowerCase() != _arg_4.toLowerCase())
        {
            return MannequinWidget._Str_9053;
        }
        if(_arg_3 < _arg_5)
        {
            return MannequinWidget._Str_8565;
        }
        return MannequinWidget._Str_10942;
    }

    public open(id: number, figure: string, gender: string, name: string)
    {
        this._furniId = id;
        this._figure = figure;
        this._gender = gender;
        this._outfitName = name;

        const session = this.handler.container.roomSession;
        const sessionDataManager =this.handler.container.sessionDataManager;
        const isAllowedToChange = session.isRoomOwner || session.controllerLevel >= RoomControllerLevel.GUEST || sessionDataManager.isGodMode;


        const local11 = this._outfitName && this._outfitName.trim().length > 0 ? 2 : 0;


        const ownFigure = sessionDataManager.figure;
        this._figure = this.mergeFigures(ownFigure, figure);
        this._ngZone.run(() =>
        {
            this._visible = true;
        });
    }

    private mergeFigures(ownFigure: string, addedFigure: string): string
    {
        const parts = [
            AvatarFigurePartType.CHEST_ACCESSORY,
            AvatarFigurePartType.COAT_CHEST,
            AvatarFigurePartType.CHEST,
            AvatarFigurePartType.LEGS,
            AvatarFigurePartType.SHOES,
            AvatarFigurePartType.WAIST_ACCESSORY];


        const ownContainer = new AvatarFigureContainer(ownFigure);
        const addedContainer = new AvatarFigureContainer(addedFigure);

        for(const part of parts)
        {
            ownContainer._Str_923(part);
        }

        for(const part of addedContainer._Str_1016())
        {
            ownContainer._Str_830(part, addedContainer.getPartSetId(part), addedContainer._Str_815(part));
        }

        return ownContainer._Str_1008();

    }

    public handleButton(button: string): void
    {
        debugger;
        switch(button)
        {
            case 'wear': {
                /*
                 if (_local_2.clubLevel < this._mannequinClubLevel)
                    {
                        this._Str_3248(_Str_8565);
                    }
                 */
                this.handler.container.connection.send(new FurnitureMultiStateComposer(this._furniId));
            }
                break;
        }
    }

    public get outfitName(): string
    {
        return this._outfitName;
    }
    public get figure(): string
    {
        return this._figure;
    }
}
