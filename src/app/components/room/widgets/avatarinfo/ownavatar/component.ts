import { Component, ElementRef, ViewChild } from '@angular/core';
import { AvatarAction } from '../../../../../../client/nitro/avatar/enum/AvatarAction';
import { RoomControllerLevel } from '../../../../../../client/nitro/session/enum/RoomControllerLevel';
import { AvatarExpressionEnum } from '../../../../../../client/nitro/ui/widget/enums/AvatarExpressionEnum';
import { RoomWidgetMessage } from '../../../../../../client/nitro/ui/widget/messages/RoomWidgetMessage';
import { RoomWidgetAvatarExpressionMessage } from '../../messages/RoomWidgetAvatarExpressionMessage';
import { RoomWidgetChangePostureMessage } from '../../messages/RoomWidgetChangePostureMessage';
import { RoomWidgetDanceMessage } from '../../messages/RoomWidgetDanceMessage';
import { RoomWidgetUserActionMessage } from '../../messages/RoomWidgetUserActionMessage';
import { AvatarContextInfoView } from '../AvatarContextInfoView';
import { AvatarInfoData } from '../AvatarInfoData';
import { RoomAvatarInfoComponent } from '../component';

@Component({
	selector: 'nitro-room-avatarinfo-ownavatar-component',
    template: `
    <div #activeView class="nitro-room-avatarinfo-ownavatar-component context-menu">
        <div class="card align-items-center">
            <div class="d-flex card-header align-items-center w-100">{{ userName }}</div>
            <div class="card-body">
                <ng-container *ngFor="let entry of menu">
                    <ul *ngIf="(mode === entry.mode)" class="list-group list-group-flush">
                        <ng-container *ngFor="let item of entry.items">
                            <li *ngIf="item.visible" (click)="processAction(item.name)" class="list-group-item">{{ item.localization | translate }}</li>
                        </ng-container>
                    </ul>
                </ng-container>
            </div>
            <div class="card-pointer"></div>
        </div>
    </div>`
})
export class RoomAvatarInfoOwnAvatarComponent extends AvatarContextInfoView
{
    private static MODE_NORMAL: number          = 0;
    private static MODE_CLUB_DANCES: number     = 1;
    private static MODE_NAME_CHANGE: number     = 2;
    private static MODE_EXPRESSIONS: number     = 3;
    private static MODE_SIGNS: number           = 4;
    private static MODE_CHANGE_LOOKS: number    = 5;

    @ViewChild('activeView')
    public activeView: ElementRef<HTMLDivElement>;
    
    public avatarData: AvatarInfoData = null;
    public mode: number = 0;

    public menu: { mode: number, items: { name: string, localization: string, visible: boolean }[] }[] = [];

    public static setup(view: RoomAvatarInfoOwnAvatarComponent, userId: number, userName: string, userType: number, roomIndex: number, avatarData: AvatarInfoData): void
    {
        view.avatarData = avatarData;

        if(view.widget.isDancing && view.widget.hasClub) view.mode = RoomAvatarInfoOwnAvatarComponent.MODE_CLUB_DANCES;
        
        AvatarContextInfoView.extendedSetup(view, userId, userName, userType, roomIndex);

        view.setupButtons();
    }

    public setupButtons(): void
    {
        const isRidingHorse = this.widget._Str_25831;

        this.menu = [
            {
                mode: RoomAvatarInfoOwnAvatarComponent.MODE_NORMAL,
                items: [
                    {
                        name: 'decorate',
                        localization: 'widget.avatar.decorate',
                        visible: (this.widget.hasClub && (this.avatarData.roomControllerLevel >= RoomControllerLevel.GUEST) || this.avatarData._Str_3246)
                    },
                    {
                        name: 'change_looks',
                        localization: 'widget.memenu.myclothes',
                        visible: true
                    },
                    {
                        name: 'dance_menu',
                        localization: 'widget.memenu.dance',
                        visible: (this.widget.hasClub && !isRidingHorse)
                    },
                    {
                        name: 'dance',
                        localization: 'widget.memenu.dance',
                        visible: (!this.widget.isDancing && !this.widget.hasClub && !isRidingHorse)
                    },
                    {
                        name: 'dance_stop',
                        localization: 'widget.memenu.dance.stop',
                        visible: (this.widget.isDancing && !this.widget.hasClub && !isRidingHorse)
                    },
                    {
                        name: 'expressions',
                        localization: 'infostand.link.expressions',
                        visible: true
                    },
                    {
                        name: 'signs',
                        localization: 'infostand.show.signs',
                        visible: true
                    },
                    {
                        name: 'drop_hand_item',
                        localization: 'avatar.widget.drop_hand_item',
                        visible: ((this.avatarData._Str_8826 > 0) && (this.avatarData._Str_8826 < 999999))
                    }
                ]
            },
            {
                mode: RoomAvatarInfoOwnAvatarComponent.MODE_CLUB_DANCES,
                items: [
                    {
                        name: 'dance_stop',
                        localization: 'widget.memenu.dance.stop',
                        visible: (this.widget.isDancing)
                    },
                    {
                        name: 'dance_1',
                        localization: 'widget.memenu.dance1',
                        visible: true
                    },
                    {
                        name: 'dance_2',
                        localization: 'widget.memenu.dance2',
                        visible: true
                    },
                    {
                        name: 'dance_3',
                        localization: 'widget.memenu.dance3',
                        visible: true
                    },
                    {
                        name: 'dance_4',
                        localization: 'widget.memenu.dance4',
                        visible: true
                    },
                    {
                        name: 'back',
                        localization: 'generic.back',
                        visible: true
                    }
                ]
            },
            {
                mode: RoomAvatarInfoOwnAvatarComponent.MODE_EXPRESSIONS,
                items: [
                    {
                        name: 'sit',
                        localization: 'widget.memenu.sit',
                        visible: (this.widget.getOwnPosture === AvatarAction.POSTURE_STAND)
                    },
                    {
                        name: 'stand',
                        localization: 'widget.memenu.stand',
                        visible: this.widget.getCanStandUp
                    },
                    {
                        name: 'wave',
                        localization: 'widget.memenu.wave',
                        visible: (!this.widget._Str_12708)
                    },
                    {
                        name: 'laugh',
                        localization: 'widget.memenu.laugh',
                        visible: (!this.widget._Str_12708 && this.widget.hasVip)
                    },
                    {
                        name: 'blow',
                        localization: 'widget.memenu.blow',
                        visible: (!this.widget._Str_12708 && this.widget.hasVip)
                    },
                    {
                        name: 'idle',
                        localization: 'widget.memenu.idle',
                        visible: true
                    },
                    {
                        name: 'back',
                        localization: 'generic.back',
                        visible: true
                    }
                ]
            },
            {
                mode: RoomAvatarInfoOwnAvatarComponent.MODE_SIGNS,
                items: [
                    {
                        name: 'sign_1',
                        localization: '1',
                        visible: true
                    },
                    {
                        name: 'sign_2',
                        localization: '2',
                        visible: true
                    },
                    {
                        name: 'sign_3',
                        localization: '3',
                        visible: true
                    },
                    {
                        name: 'sign_4',
                        localization: '4',
                        visible: true
                    },
                    {
                        name: 'sign_5',
                        localization: '5',
                        visible: true
                    },
                    {
                        name: 'sign_6',
                        localization: '6',
                        visible: true
                    },
                    {
                        name: 'sign_7',
                        localization: '8',
                        visible: true
                    },
                    {
                        name: 'sign_8',
                        localization: '8',
                        visible: true
                    },
                    {
                        name: 'sign_9',
                        localization: '9',
                        visible: true
                    },
                    {
                        name: 'sign_10',
                        localization: '10',
                        visible: true
                    },
                    {
                        name: 'sign_11',
                        localization: 'heart',
                        visible: true
                    },
                    {
                        name: 'sign_12',
                        localization: 'skull',
                        visible: true
                    },
                    {
                        name: 'sign_0',
                        localization: '0',
                        visible: true
                    },
                    {
                        name: 'sign_13',
                        localization: '13',
                        visible: true
                    },
                    {
                        name: 'sign_15',
                        localization: '15',
                        visible: true
                    },
                    {
                        name: 'sign_14',
                        localization: '14',
                        visible: true
                    },
                    {
                        name: 'sign_17',
                        localization: '17',
                        visible: true
                    },
                    {
                        name: 'sign_16',
                        localization: '16',
                        visible: true
                    }
                ]
            }
        ];
    }

    public processAction(name: string): void
    {
        let message: RoomWidgetMessage  = null;
        let hideMenu: boolean           = true;

        if(name)
        {
            if(name.startsWith('sign_'))
            {
                const sign = parseInt(name.split('_')[1]);

                this.widget.useSign(sign);
            }
            else
            {
                switch(name)
                {
                    case 'decorate':
                        break;
                    case 'change_looks':
                        break;
                    case 'expressions':
                        hideMenu = false;
                        this.setMode(RoomAvatarInfoOwnAvatarComponent.MODE_EXPRESSIONS);
                        break;
                    case 'sit':
                        message = new RoomWidgetChangePostureMessage(RoomWidgetChangePostureMessage._Str_2016);
                        break;
                    case 'stand':
                        message = new RoomWidgetChangePostureMessage(RoomWidgetChangePostureMessage._Str_1553);
                        break;
                    case 'wave':
                        message = new RoomWidgetAvatarExpressionMessage(AvatarExpressionEnum._Str_6268);
                        break;
                    case 'blow':
                        message = new RoomWidgetAvatarExpressionMessage(AvatarExpressionEnum._Str_5579);
                        break;
                    case 'laugh':
                        message = new RoomWidgetAvatarExpressionMessage(AvatarExpressionEnum._Str_7336);
                        break;
                    case 'idle':
                        message = new RoomWidgetAvatarExpressionMessage(AvatarExpressionEnum._Str_6989);
                        break;
                    case 'dance_menu':
                        hideMenu = false;
                        this.setMode(RoomAvatarInfoOwnAvatarComponent.MODE_CLUB_DANCES);
                        break;
                    case 'dance':
                        message = new RoomWidgetDanceMessage(1);
                        break;
                    case 'dance_stop':
                        message = new RoomWidgetDanceMessage(0);
                        break;
                    case 'dance_1':
                    case 'dance_2':
                    case 'dance_3':
                    case 'dance_4':
                        message = new RoomWidgetDanceMessage(parseInt(name.charAt((name.length - 1))));
                        break;
                    case 'signs':
                        hideMenu = false;
                        this.setMode(RoomAvatarInfoOwnAvatarComponent.MODE_SIGNS);
                        break;
                    case 'back':
                        hideMenu = false;
                        this.setMode(RoomAvatarInfoOwnAvatarComponent.MODE_NORMAL);
                        break;
                    case 'more':
                        hideMenu = false;
                        //this.widget._Str_13909 = false;
                        this.setMode(RoomAvatarInfoOwnAvatarComponent.MODE_NORMAL);
                        break;
                    case 'drop_hand_item':
                        message = new RoomWidgetUserActionMessage(RoomWidgetUserActionMessage.RWUAM_DROP_CARRY_ITEM, this.userId);
                        break;
                }
            }

            if(message) this.parent.messageListener.processWidgetMessage(message);
        }

        if(hideMenu)
        {
            this.parent.removeView(this.componentRef, false);
        }
    }

    private setMode(mode: number): void
    {
        if(mode === this.mode) return;

        this.mode = mode;
    }

    public get widget(): RoomAvatarInfoComponent
    {
        return (this.parent as RoomAvatarInfoComponent);
    }
}