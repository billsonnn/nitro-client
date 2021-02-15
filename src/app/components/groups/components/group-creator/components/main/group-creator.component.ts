import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import GroupBadgePart from '../../../../common/GroupBadgePart';
import GroupSettings from '../../../../common/GroupSettings';
import { GroupsService } from '../../../../services/groups.service';

@Component({
    selector: '[nitro-group-creator-component]',
    templateUrl: './group-creator.template.html'
})
export class GroupCreatorComponent implements OnInit, OnDestroy
{
    public groupSettings: GroupSettings;
    public groupCost: number;
    public availableRooms: Map<number, string>;
    
    private _badgeBases: Map<number, string[]>;
    private _badgeSymbols: Map<number, string[]>;
    private _badgePartColors: Map<number, string>;
    private _groupColorsA: Map<number, string>;
    private _groupColorsB: Map<number, string>;

    private _currentStep: number;
    private _badgePartBeingSelected: GroupBadgePart;
    private _selectorVisible: boolean;
    private _positions: number[];
    
    constructor(
        private _groupService: GroupsService,
        private _activeModal: NgbActiveModal)
    {
        this._clear();
    }

    private _clear(): void
    {
        this.groupSettings = new GroupSettings();
        this.availableRooms = new Map();

        this._currentStep = 3;
        this._badgePartBeingSelected = null;
        this._selectorVisible = false;
        this._positions = [];
    }

    public ngOnInit(): void
    {
        this._clear();
        this.loadPositionsArray();
    }

    public ngOnDestroy(): void
    {

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
        console.log(part)
        this._selectorVisible = true;
    }

    public onPartSelected(id: number): void
    {
        this._badgePartBeingSelected.key = id;
        this._badgePartBeingSelected = null;
        this._selectorVisible = false;
    }

    public previousStep(): void
    {
        if(this._currentStep === 1) return;

        this._currentStep--;
    }

    public nextStep(): void
    {
        if(this._currentStep === 4) return;

        this._currentStep++;
    }

    public hide(): void
    {
        this._activeModal.close();
    }

    public get currentStep(): number
    {
        return this._currentStep;
    }

    public get positions(): number[]
    {
        return this._positions;
    }

    public get currentBadgeCode(): string
    {
        let code = '';

        this.groupSettings.badgeParts.forEach((part) => {
            if(part.code)
            {
                code = code + part.code;
            }
        });

        return code;
    }

    public set badgeBases(bases: Map<number, string[]>)
    {
        this._badgeBases = bases;
    }

    public get badgeBases(): Map<number, string[]>
    {
        return this._badgeBases;
    }

    public set badgeSymbols(symbols: Map<number, string[]>)
    {
        this._badgeSymbols = symbols;
        this.groupSettings.getBadgePart(0).key = symbols.keys().next().value;
    }

    public get badgeSymbols(): Map<number, string[]>
    {
        return this._badgeSymbols;
    }

    public set badgePartColors(colors: Map<number, string>)
    {
        this._badgePartColors = colors;
        this.groupSettings.setPartsColor(colors.keys().next().value);
    }

    public set groupColorsA(colors: Map<number, string>)
    {
        this._groupColorsA = colors;
        this.groupSettings.colorA = colors.keys().next().value;
    }

    public get groupColorsA(): Map<number, string>
    {
        return this._groupColorsA;
    }

    public set groupColorsB(colors: Map<number, string>)
    {
        this._groupColorsB = colors;
        this.groupSettings.colorB = colors.keys().next().value;
    }

    public get groupColorsB(): Map<number, string>
    {
        return this._groupColorsB;
    }

    public get badgeBaseColors(): Map<number, string>
    {
        return this._badgePartColors;
    }

    public get badgePartBeingSelected(): GroupBadgePart
    {
        return this._badgePartBeingSelected;
    }

    public get selectorVisible(): boolean
    {
        return this._selectorVisible;
    }
}
