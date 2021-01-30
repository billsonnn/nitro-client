import { Component, Input } from '@angular/core';
import { RedeemItemClothingComposer } from '../../../../../../../../client/nitro/communication/messages/outgoing/catalog/RedeemItemClothingComposer';
import { UserFigureComposer } from '../../../../../../../../client/nitro/communication/messages/outgoing/user/data/UserFigureComposer';
import { Nitro } from '../../../../../../../../client/nitro/Nitro';
import { RoomObjectCategory } from '../../../../../../../../client/nitro/room/object/RoomObjectCategory';
import { IFurnitureData } from '../../../../../../../../client/nitro/session/furniture/IFurnitureData';
import { FurniCategory } from '../../../../../../catalog/enums/FurniCategory';
import { FurnitureContextMenuWidget } from '../main/main.component';

@Component({
    template:`
    <div  *ngIf="visible" [bringToTop] [draggable] class="card nitro-chooser-component">
        <div class="drag-handler d-flex justify-content-between align-items-center px-3 pt-3">
            <h6 class="m-0">{{ 'useproduct.widget.title.bind_clothing' | translate }}</h6>
            <button type="button" class="close" (click)="hide()"><i class="fas fa-times"></i></button>
        </div>
        <div class="d-flex flex-column p-3">
            <div nitro-avatar-image [figure]="newFigureString" [direction]="2"></div>
            <p>{{ caption }}</p>
        </div>
        <div class="d-flex flex-column p-3">
            <button type="button" class="btn btn-primary" (click)="handleButton('cancel')">{{ 'useproduct.widget.cancel' | translate }}</button>
            <button type="button" class="btn btn-primary" (click)="handleButton('use')">{{ 'useproduct.widget.bind_clothing' | translate }}</button>
        </div>
    </div>`
})
export class PurchaseClothingComponent
{
    @Input() contextWidget: FurnitureContextMenuWidget = null;
    @Input() objectId: number =null;
    public visible: boolean = false;

    private _furniData: IFurnitureData = null;
    private _requestObjectId: number = -1;
    public newFigureString: string;
    public caption: string = null;

    public hide(): void
    {
        if(!this.contextWidget) return;

        this.contextWidget.closeClothing();

    }

    public open(objectId: number)
    {
        if(!this.contextWidget) return;

        const roomId = this.contextWidget.handler.container.roomSession.roomId;
        const roomObject = this.contextWidget.handler.container.roomEngine.getRoomObject(roomId, objectId, RoomObjectCategory.FLOOR);
        if(!roomObject) return;

        this._furniData = this.contextWidget.handler.getFurniData(roomObject);
        this._requestObjectId = roomObject.id;


        let local4 = -1;
        const local5: number[] = [];
        const gender =  this.contextWidget.handler.container.sessionDataManager.gender;
        switch(this._furniData.specialType)
        {
            case FurniCategory.FIGURE_PURCHASABLE_SET: {
                local4 = 0;
                const local6 = this._furniData.customParams.split(',');
                for(let i = 0; i < local6.length; i++)
                {
                    const setId = Number.parseInt(local6[i]);
                    if(this.contextWidget.handler.container.avatarRenderManager.isValidFigureSetForGender(setId,gender))
                    {
                        local5.push(setId);
                    }
                }
            }
                break;
        }

        const figure = this.contextWidget.handler.container.sessionDataManager.figure;
        this.newFigureString = this.contextWidget.handler.container.avatarRenderManager.getFigureStringWithFigureIds(figure,gender, local5);

        if(this.contextWidget.inventoryService.hasBoundFigureSetFurniture(this.newFigureString))
        {
            this.contextWidget.handler.container.connection.send(new UserFigureComposer(gender, this.newFigureString));
        }
        else
        {
            this.showWindow(local4);
        }
    }

    public handleButton(button: string): void
    {
        switch(button)
        {
            case 'cancel':
                this.hide();
                break;
            case 'use': {
                const gender =  this.contextWidget.handler.container.sessionDataManager.gender;
                this.contextWidget.handler.container.connection.send(new RedeemItemClothingComposer(this._requestObjectId));
                this.contextWidget.handler.container.connection.send(new UserFigureComposer(gender, this.newFigureString));
                this.hide();
            }
                break;
        }
    }

    private showWindow(k: number): void
    {
        this.caption = Nitro.instance.localization.getValueWithParameter('useproduct.widget.text.bind_clothing', 'productName', this._furniData.name);
        this.visible = true;
    }
}
