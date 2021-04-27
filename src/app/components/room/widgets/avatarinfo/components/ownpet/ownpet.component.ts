import { Component, ElementRef, ViewChild } from '@angular/core';
import { RoomObjectCategory } from 'nitro-renderer/src/nitro/room/object/RoomObjectCategory';
import { RoomObjectVariable } from 'nitro-renderer/src/nitro/room/object/RoomObjectVariable';
import { RoomWidgetMessage } from 'nitro-renderer/src/nitro/ui/widget/messages/RoomWidgetMessage';
import { SettingsService } from '../../../../../../core/settings/service';
import { RoomWidgetUserActionMessage } from '../../../messages/RoomWidgetUserActionMessage';
import { AvatarContextInfoView } from '../../common/AvatarContextInfoView';
import { PetInfoData } from '../../common/PetInfoData';
import { RoomAvatarInfoComponent } from '../main/main.component';
import { PetType } from '../../../../../../../client/nitro/avatar/pets/PetType';
import { IFurnitureData } from '../../../../../../../client/nitro/session/furniture/IFurnitureData';
import { Nitro } from '../../../../../../../client/nitro/Nitro';
import { FurniCategory } from '../../../../../catalog/enums/FurniCategory';

@Component({
    templateUrl: './ownpet.template.html'
})
export class RoomAvatarInfoOwnPetComponent extends AvatarContextInfoView
{
    private static MODE_NORMAL: number          = 0;

    @ViewChild('activeView')
    public activeView: ElementRef<HTMLDivElement>;

    public petInfoData: PetInfoData = null;
    public mode: number = 0;

    public menu: { mode: number, items: { name: string, localization: string, visible: boolean }[] }[] = [];

    constructor(
        private _settingsService: SettingsService)
    {
        super();
    }

    public static setup(view: RoomAvatarInfoOwnPetComponent, userId: number, userName: string, userType: number, roomIndex: number, petInfoData: PetInfoData): void
    {
        view.petInfoData = petInfoData;

        AvatarContextInfoView.extendedSetup(view, userId, userName, userType, roomIndex);

        view.setupButtons();
    }

    public setupButtons(): void
    {
        let giveHandItem = false;

        const handler       = this.widget.handler;
        const roomObject    = handler.container.roomEngine.getRoomObject(handler.roomSession.roomId, handler.container.roomSession.ownRoomIndex, RoomObjectCategory.UNIT);

        if(roomObject)
        {
            const carryId = roomObject.model.getValue<number>(RoomObjectVariable.FIGURE_CARRY_OBJECT);

            if((carryId > 0) && (carryId < 999999)) giveHandItem = true;
        }

        let buySaddleVisible = false;
        if(this.petInfoData._Str_4355 == PetType.HORSE)
        {
            const stuff = this._Str_20669(FurniCategory.PET_SADDLE, PetType.HORSE);
            buySaddleVisible = !!(stuff);
        }

        const breedEnabled = [PetType.BEAR, PetType.TERRIER, PetType.CAT, PetType.DOG, PetType.PIG].indexOf(this.petInfoData._Str_4355) > -1;

        this.menu = [
            {
                mode: RoomAvatarInfoOwnPetComponent.MODE_NORMAL,
                items: [
                    {
                        name: 'respect',
                        localization: 'infostand.button.petrespect',
                        visible: this.petInfoData._Str_2985 > 0
                    },
                    {
                        name: 'train',
                        localization: 'infostand.button.train',
                        visible: true
                    },
                    {
                        name: 'pickup',
                        localization: 'infostand.button.pickup',
                        visible: true
                    },
                    {
                        name: 'buy_saddle',
                        localization: 'infostand.button.buy_saddle',
                        visible:buySaddleVisible
                    },
                    {
                        name: 'breed',
                        localization: 'infostand.button.breed',
                        visible: breedEnabled
                    }
                ]
            }
        ];
    }

    public processAction(name: string): void
    {
        const messageType: string         = null;
        let message: RoomWidgetMessage  = null;
        const hideMenu           = true;

        if(name)
        {
            switch(name)
            {
                case 'respect':
                    this.petInfoData._Str_2985--;
                    message = new RoomWidgetUserActionMessage(RoomWidgetUserActionMessage.RWUAM_RESPECT_PET, this.userId);
                    break;
                case 'pickup':
                    message = new RoomWidgetUserActionMessage(RoomWidgetUserActionMessage.RWUAM_PICKUP_PET, this.userId);
                    this.widget && this.widget._Str_25401();
                    break;
            }

            if(messageType) message = new RoomWidgetUserActionMessage(messageType, this.userId);

            if(message) this.parent.messageListener.processWidgetMessage(message);
        }

        if(hideMenu)
        {
            this.parent.removeView(this.componentRef, false);
        }
    }


    private _Str_20669(k: number, arg2: number): IFurnitureData
    {
        const local4 = Nitro.instance.sessionDataManager.getFloorItemsDataByCategory(k);

        for(const item of local4)
        {
            const local6 = item.customParams.split(' ');
            const local7 = local6 && local6.length >= 1 ? parseInt(local6[0]) : -1;
            if(local7 == arg2)  return item;
        }

        return null;
    }


    public toggleVisibility(): void
    {
        this._settingsService.toggleUserContextVisible();
    }

    public get visible(): boolean
    {
        return this._settingsService.userContextVisible;
    }

    public get widget(): RoomAvatarInfoComponent
    {
        return (this.parent as RoomAvatarInfoComponent);
    }
}
