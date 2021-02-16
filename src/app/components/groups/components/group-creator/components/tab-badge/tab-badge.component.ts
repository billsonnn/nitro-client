import { Component, Input, Output } from '@angular/core';
import GroupBadgePart from '../../../../common/GroupBadgePart';
import GroupSettings from '../../../../common/GroupSettings';

@Component({
    selector: 'nitro-group-creator-tab-badge-component',
    templateUrl: './tab-badge.template.html'
})
export class GroupCreatorTabBadgeComponent
{
    @Input()
    @Output()
    public groupSettings: GroupSettings;

    @Input()
    public currentBadgeCode: string;

    @Input()
    public badgeBases: Map<number, string[]>;

    @Input()
    public badgeSymbols: Map<number, string[]>;

    @Input()
    public badgePartColors: Map<number, string>;

    private _badgePartBeingSelected: GroupBadgePart;
    private _selectorVisible: boolean;
    private _positions: number[];

    constructor()
    {
        this._badgePartBeingSelected = null;
        this._selectorVisible = false;
        this._positions = [];
        this.loadPositionsArray();
    }

    public loadPositionsArray(): void
    {
        for(let i = 0; i < 9; i++)
        {
            this._positions.push(i);
        }
    }

    public openPartSelector(part: GroupBadgePart): void
    {
        this._badgePartBeingSelected = part;
        this._selectorVisible = true;
    }

    public onPartSelected(id: number): void
    {
        this._badgePartBeingSelected.key = id;
        this._badgePartBeingSelected = null;
        this._selectorVisible = false;
    }

    public get badgePartBeingSelected(): GroupBadgePart
    {
        return this._badgePartBeingSelected;
    }

    public get selectorVisible(): boolean
    {
        return this._selectorVisible;
    }

    public get positions(): number[]
    {
        return this._positions;
    }
}
