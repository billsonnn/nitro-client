import { ChangeDetectorRef, Component, EventEmitter, NgZone, OnDestroy, OnInit, Output } from '@angular/core';
import { Nitro } from '../../../../../../client/nitro/Nitro';
import { HabboClubLevelEnum } from '../../../../../../client/nitro/session/HabboClubLevelEnum';

@Component({
    selector: 'nitro-room-chatinput-styleselector-component',
    template: `
    <div class="nitro-room-chatinput-styleselector-component">
        <i class="icon chatstyles-icon" (click)="toggleSelector()"></i>
        <div class="component-styles-container" [ngClass]="{ 'active': showStyles }">
            <div class="d-flex" style="width: 300px">
                <div class="grid-container">
                    <div class="grid-items grid-4">
                        <div *ngFor="let styleId of styleIds" class="item-detail" [ngClass]="{ 'selected': (lastSelectedId === styleId)}">
                            <div class="chat-bubble-icon bubble-{{ styleId }}" (click)="selectStyle(styleId)"></div>
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

    constructor(
        private changeDetector: ChangeDetectorRef,
        private ngZone: NgZone)
    {}

    public ngOnInit(): void
    {
        const styles = Nitro.instance.getConfiguration<{ styleId: number, minRank: number, isSystemStyle: boolean, isHcOnly: boolean, isAmbassadorOnly: boolean }[]>('chat.styles');

        for(const style of styles)
        {
            if(!style) continue;

            if(style.minRank > 0)
            {
                if(Nitro.instance.sessionDataManager.hasSecurity(style.minRank)) this.styleIds.push(style.styleId);

                continue;
            }

            if(style.isSystemStyle || (Nitro.instance.getConfiguration<number[]>('chat.styles.disabled').indexOf(style.styleId) >= 0)) continue;

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
