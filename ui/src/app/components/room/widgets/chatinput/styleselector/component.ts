import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Nitro } from '../../../../../../client/nitro/Nitro';
import { HabboClubLevelEnum } from '../../../../../../client/nitro/session/HabboClubLevelEnum';
import { AppConfiguration } from '../../../../../AppConfiguration';

@Component({
	selector: 'nitro-room-chatinput-styleselector-component',
    template: `
    <div class="nitro-room-chatinput-styleselector-component">
        <i class="icon chatstyles-icon" (click)="toggleStyleSelector()"></i>
        <div class="component-styles-container" [ngClass]="{ 'active': showStyles }">
            <div class="card">
                <div class="card-body">
                    <div class="container-items">
                        <div *ngFor="let styleId of styleIds" class="item-detail">
                            <div class="nitro-room-chat-item-component chat-style-{{ styleId }}" (click)="selectStyle(styleId)">
                                <div class="chat-left"></div>
                                <div class="chat-right"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`
})
export class RoomChatInputStyleSelectorComponent implements OnInit
{
    @Output()
    public styleSelected = new EventEmitter<number>();

    public showStyles           = false;
    public lastSelectedId       = 0;
    public styleIds: number[]   = [];

    public ngOnInit(): void
    {
        const styles = AppConfiguration.CHAT_STYLES;

        for(let style of styles)
        {
            if(!style) continue;

            if(style.minRank > 0)
            {
                if(Nitro.instance.sessionDataManager.hasSecurity(style.minRank)) this.styleIds.push(style.styleId);

                continue;
            }

            if(style.isSystemStyle || (AppConfiguration.DISABLED_CHAT_STYLES.indexOf(style.styleId) >= 0)) continue;

            if(style.isHcOnly && (Nitro.instance.sessionDataManager.clubLevel >= HabboClubLevelEnum._Str_2964))
            {
                this.styleIds.push(style.styleId);

                continue;
            }

            if(style.isAmbassadorOnly && Nitro.instance.sessionDataManager.isAmbassador)
            {
                this.styleIds.push(style.styleId);

                continue;
            }

            if(!style.isHcOnly && !style.isAmbassadorOnly) this.styleIds.push(style.styleId);
        }
    }

    public toggleStyleSelector(): void
    {
        this.showStyles = !this.showStyles;
    }

    public selectStyle(styleId: number): void
    {
        this.styleSelected.emit(styleId);

        this.showStyles = false;
    }
}