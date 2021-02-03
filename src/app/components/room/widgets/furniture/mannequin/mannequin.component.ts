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
import { AvatarFigureContainer } from '../../../../../../client/nitro/avatar/AvatarFigureContainer';
import { FurnitureMultiStateComposer } from '../../../../../../client/nitro/communication/messages/outgoing/room/furniture/logic/FurnitureMultiStateComposer';
import { Nitro } from '../../../../../../client/nitro/Nitro';
import { IAvatarFigureContainer } from '../../../../../../client/nitro/avatar/IAvatarFigureContainer';
import { HabboClubLevelEnum } from '../../../../../../client/nitro/session/HabboClubLevelEnum';
import { FurnitureMannequinSaveNameComposer } from '../../../../../../client/nitro/communication/messages/outgoing/room/furniture/mannequin/FurnitureMannequinSaveNameComposer';
import { FurnitureMannequinSaveLookComposer } from '../../../../../../client/nitro/communication/messages/outgoing/room/furniture/mannequin/FurnitureMannequinSaveLookComposer';

@Component({
    selector: 'nitro-room-furniture-mannequin-component',
    templateUrl: './mannequin.template.html'
})
export class MannequinWidget extends ConversionTrackingWidget
{
    private static readonly EditorView:number = 0;
    private static readonly PreviewAndSave:number = 1;
    private static readonly UseMannequin:number = 2;
    private static readonly WrongClubLevel:number = 3;
    private static readonly WrongGender:number = 4;
    private static readonly  parts = [
        AvatarFigurePartType.CHEST_ACCESSORY,
        AvatarFigurePartType.COAT_CHEST,
        AvatarFigurePartType.CHEST,
        AvatarFigurePartType.LEGS,
        AvatarFigurePartType.SHOES,
        AvatarFigurePartType.WAIST_ACCESSORY];
    private static readonly _Str_9071:number = 0;
    private static readonly  _Str_8000:number = 1;
    private static readonly _Str_8218:number = 2;
    private static readonly _Str_10597 = ['hd', 99999, [99998]];
    private _visible: boolean       = false;
    private _furniId: number;
    private _figure: string;
    private _renderedFigure: string;
    private _gender: string;
    public outfitName: string;
    private _mannequinClubLevel: number;
    private _view: string;

    constructor(
        private _ngZone: NgZone)
    {
        super();

    }

    public open(id: number, figure: string, gender: string, name: string)
    {
        this._furniId = id;
        this._figure = figure;
        this._gender = gender;
        this.outfitName = name;

        const roomSession = this.handler.container.roomSession;
        const currentSessionUser =this.handler.container.sessionDataManager;
        const canEditMannequin = roomSession.isRoomOwner || roomSession.controllerLevel >= RoomControllerLevel.GUEST || currentSessionUser.isGodMode;
        const _local_8 = Nitro.instance.avatar;
        const local9 = _local_8.createFigureContainer(figure);
        this._mannequinClubLevel = _local_8.getFigureClubLevel(local9, gender, MannequinWidget.parts);
        const viewType = this.getViewType(canEditMannequin, currentSessionUser.gender, currentSessionUser.clubLevel, gender, this._mannequinClubLevel);

        this.setView(viewType);
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

    private getViewType(canEditMannequin:boolean, ownGender:string, currentClubLevel:number, mannequinGender:string, requiredClubLevel:number):number
    {
        if(canEditMannequin)
        {
            return MannequinWidget.EditorView;
        }
        if(ownGender.toLowerCase() != mannequinGender.toLowerCase())
        {
            return MannequinWidget.WrongGender;
        }
        if(currentClubLevel < requiredClubLevel)
        {
            return MannequinWidget.WrongClubLevel;
        }
        return MannequinWidget.UseMannequin;
    }



    private setView(viewType: number): void
    {
        const sessionDataManager = this.handler.container.sessionDataManager;
        const currentFigure = sessionDataManager.figure;
        const avatarRenderManager =  this.handler.container.avatarRenderManager;

        this._view = this.createView(viewType);


        let avatarFigureContainer:IAvatarFigureContainer = null;


        switch(viewType)
        {
            case MannequinWidget.WrongGender:{
                avatarFigureContainer = avatarRenderManager.createFigureContainer(this._figure);
                this.removeSectionsFromAvatar(avatarFigureContainer);
                this._renderedFigure = avatarFigureContainer._Str_1008();
                // create avatar image


            }
                break;
            case MannequinWidget.PreviewAndSave: {
                avatarFigureContainer = avatarRenderManager.createFigureContainer(currentFigure);
                this.removeSectionsFromAvatar(avatarFigureContainer);
                this._renderedFigure = avatarFigureContainer._Str_1008();
            }
                break;
            case MannequinWidget.UseMannequin: {
                this._renderedFigure = this.mergeFigures(this._figure);
            }
                break;
            case MannequinWidget.EditorView: {
                avatarFigureContainer = avatarRenderManager.createFigureContainer(this._figure);
                this.removeSectionsFromAvatar(avatarFigureContainer);
                this._renderedFigure = avatarFigureContainer._Str_1008();
                // create avatar image

            }
                break;
        }

        this.showOrHideHabboClubLevel(this._mannequinClubLevel);

        this._ngZone.run(() =>
        {
            this._visible = true;
        });
    }

    private removeSectionsFromAvatar(k:IAvatarFigureContainer): void
    {

        for(const item of k._Str_1016())
        {

            if(MannequinWidget.parts.indexOf(item) == -1)
            {

                k._Str_923(item);
            }
        }

        k._Str_830(<string>MannequinWidget._Str_10597[0], <number>MannequinWidget._Str_10597[1], <number[]>MannequinWidget._Str_10597[2]);
    }


    private mergeFigures(addedFigure: string): string
    {
        const ownContainer = new AvatarFigureContainer(this.widgetHandler.container.sessionDataManager.figure);
        const addedContainer = new AvatarFigureContainer(addedFigure);

        for(const part of MannequinWidget.parts)
        {
            ownContainer._Str_923(part);
        }

        for(const part of addedContainer._Str_1016())
        {
            ownContainer._Str_830(part, addedContainer.getPartSetId(part), addedContainer._Str_815(part));
        }

        return ownContainer._Str_1008();

    }

    private createView(viewType: number): string
    {
        switch(viewType)
        {
            case MannequinWidget.EditorView:
                return 'main';
            case MannequinWidget.PreviewAndSave:
                return 'save';
            case MannequinWidget.UseMannequin:
                return 'peer-main';
            case MannequinWidget.WrongClubLevel:
                return 'no-club';
            case MannequinWidget.WrongGender:
                return 'wrong-gender';
        }

        return '';
    }


    private showOrHideHabboClubLevel(clubLevel:number): void
    {
        switch(clubLevel)
        {
            case HabboClubLevelEnum._Str_3159:
                // visible = false;
                break;
            case HabboClubLevelEnum._Str_2964:
                // style = 13
                // visible =true
                break;
            case HabboClubLevelEnum._Str_2575:
                // style = 14
                // visible = true;
                break;
        }
    }



    public handleButton(button: string): void
    {
        switch(button)
        {
            case 'wear':
                this.wearOutfit();
                break;
            case 're_style':
                this._Str_20994();
                this.setView(MannequinWidget.PreviewAndSave);
                break;
            case 'save_outfit':
                this.handler.container.connection.send(new FurnitureMannequinSaveLookComposer(this._furniId));
                this._visible = false;
                break;
        }
    }

    private wearOutfit(): void
    {
        const session = this.widgetHandler.container.sessionDataManager;
        if(session.clubLevel < this._mannequinClubLevel)
        {
            this.setView(MannequinWidget.WrongClubLevel);
            return;
        }

        if(session.gender.toLowerCase() != this._gender.toLowerCase())
        {
            this.setView(MannequinWidget.WrongGender);
            return;
        }

        this.handler.container.connection.send(new FurnitureMultiStateComposer(this._furniId));
        this._visible = false;
    }

    private _Str_20994(): void
    {
        this.handler.container.connection.send(new FurnitureMannequinSaveNameComposer(this._furniId, this.outfitName));
    }


    public get figure(): string
    {
        return this._renderedFigure;
    }

    public get view(): string
    {
        return this._view;
    }
}
