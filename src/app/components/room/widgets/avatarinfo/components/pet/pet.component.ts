import { Component, ElementRef, ViewChild } from '@angular/core';
import { RoomObjectCategory } from 'nitro-renderer/src/nitro/room/object/RoomObjectCategory';
import { RoomObjectVariable } from 'nitro-renderer/src/nitro/room/object/RoomObjectVariable';
import { RoomWidgetMessage } from 'nitro-renderer/src/nitro/ui/widget/messages/RoomWidgetMessage';
import { SettingsService } from '../../../../../../core/settings/service';
import { RoomWidgetUserActionMessage } from '../../../messages/RoomWidgetUserActionMessage';
import { AvatarContextInfoView } from '../../common/AvatarContextInfoView';
import { PetInfoData } from '../../common/PetInfoData';
import { RoomAvatarInfoComponent } from '../main/main.component';

@Component({
    templateUrl: './pet.template.html'
})
export class RoomAvatarInfoPetComponent extends AvatarContextInfoView
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

    public static setup(view: RoomAvatarInfoPetComponent, userId: number, userName: string, userType: number, roomIndex: number, avatarData: PetInfoData): void
    {
        view.petInfoData = avatarData;

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

        this.menu = [
            {
                mode: RoomAvatarInfoPetComponent.MODE_NORMAL,
                items: [
                    {
                        name: 'respect',
                        localization: 'infostand.button.petrespect',
                        visible: this.petInfoData._Str_2985 > 0
                    },
                ]
            }
        ];
    }

    public processAction(name: string): void
    {
        const messageType: string         = null;
        let message: RoomWidgetMessage  = null;
        let hideMenu           = true;

        if(name)
        {
            switch(name)
            {
                case 'moderate':
                    hideMenu = false;
                    break;
                case 'respect':
                    this.petInfoData._Str_2985--;
                    message = new RoomWidgetUserActionMessage(RoomWidgetUserActionMessage.RWUAM_RESPECT_PET, this.userId);
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
