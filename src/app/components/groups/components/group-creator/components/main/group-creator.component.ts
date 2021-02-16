import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
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

        this._badgeBases = new Map();
        this._badgeSymbols = new Map();
        this._badgePartColors = new Map();
        
        this._groupColorsA = new Map();
        this._groupColorsB = new Map();

        this._currentStep = 3;
    }

    public ngOnInit(): void
    {
        this._clear();
    }

    public ngOnDestroy(): void
    {
        this._clear();
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

    public get badgePartColors(): Map<number, string>
    {
        return this._badgePartColors;
    }
}
