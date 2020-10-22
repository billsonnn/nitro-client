import { ChangeDetectorRef, Component, EventEmitter, NgZone, OnDestroy, OnInit, Output } from '@angular/core';
import { Nitro } from '../../../../../../client/nitro/Nitro';
import { HabboClubLevelEnum } from '../../../../../../client/nitro/session/HabboClubLevelEnum';
import { AppConfiguration } from '../../../../../AppConfiguration';

@Component({
	selector: 'nitro-room-chatinput-styleselector-component',
    template: `
    <div class="nitro-room-chatinput-styleselector-component">
        <i class="icon chatstyles-icon" (click)="toggleSelector()"></i>
        <div class="component-styles-container" [ngClass]="{ 'active': showStyles }">
            <div class="card">
                <div class="card-body">
                    <div class="container-items">
                        <div *ngFor="let styleId of styleIds" class="item-detail" [ngClass]="{ 'selected': (lastSelectedId === styleId)}">
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
export class RoomChatInputStyleSelectorComponent implements OnInit, OnDestroy
{
    @Output()
    public styleSelected = new EventEmitter<number>();

    public showStyles           = false;
    public lastSelectedId       = 0;
    public styleIds: number[]   = [];

    public animation: any;

    constructor(
        private changeDetector: ChangeDetectorRef,
        private ngZone: NgZone) {}

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

    public ngOnDestroy(): void
    {
        this.hideSelector();
    }

    private showSelector(): void
    {
        this.showStyles = true;

        //this.ngZone.runOutsideAngular(() => document.body.addEventListener('click', this.onOutsideClick.bind(this)));
    }

    private hideSelector(): void
    {
        this.showStyles = false;
        
        //this.ngZone.runOutsideAngular(() => document.body.removeEventListener('click', this.onOutsideClick.bind(this)));
    }

    public toggleSelector(): void
    {
        if(this.showStyles)
        {
            this.hideSelector();

            return;
        }

        this.showSelector();
    }

    public selectStyle(styleId: number): void
    {
        this.lastSelectedId = styleId;
        this.styleSelected.emit(styleId);

        this.hideSelector();
    }
}