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
    private _currentStep: number;
    private _showNameError: boolean;
    private _showDescriptionError: boolean;
    private _showRoomError: boolean;

    private _availableRooms: Map<number, string>;
    
    private _badgeBases: Map<number, string[]>;
    private _badgeSymbols: Map<number, string[]>;
    private _badgePartColors: Map<number, string>;
    
    private _groupColorsA: Map<number, string>;
    private _groupColorsB: Map<number, string>;

    private _groupCost: number;
    
    constructor(
        private _groupService: GroupsService,
        private _activeModal: NgbActiveModal)
    {
        this._clear();
    }

    private _clear(): void
    {
        this.groupSettings          = new GroupSettings();
        this._currentStep           = 1;
        this._showNameError         = false;
        this._showDescriptionError  = false;
        this._showRoomError         = false;

        this._availableRooms        = new Map();

        this._badgeBases            = new Map();
        this._badgeSymbols          = new Map();
        this._badgePartColors       = new Map();
        
        this._groupColorsA          = new Map();
        this._groupColorsB          = new Map();

        this._groupCost             = 0;
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

        if(this._currentStep === 1)
        {
            if(this.groupSettings.name.length === 0 || this.groupSettings.name.length > 29)
            {
                this._showNameError = true;
            }
            else
            {
                this._showNameError = false;
            }

            if(this.groupSettings.description.length > 254)
            {
                this._showDescriptionError = true;
            }
            else
            {
                this._showDescriptionError = false;
            }

            if(this.groupSettings.roomId === '0')
            {
                this._showRoomError = true;
            }
            else
            {
                this._showRoomError = false;
            }

            if(this._showNameError ||  this._showRoomError) return;
        }

        this._currentStep++;
    }

    public hide(): void
    {
        this._activeModal.close();
    }

    public buyGroup(): void
    {
        this._groupService.buyGroup(this.groupSettings);
    }

    public get currentStep(): number
    {
        return this._currentStep;
    }

    public get showNameError(): boolean
    {
        return this._showNameError;
    }

    public get showDescriptionError(): boolean
    {
        return this._showDescriptionError;
    }

    public get showRoomError(): boolean
    {
        return this._showRoomError;
    }

    public get availableRooms(): Map<number, string>
    {
        return this._availableRooms;
    }

    public set availableRooms(availableRooms: Map<number, string>)
    {
        this._availableRooms = availableRooms;
    }
    
    public get badgeBases(): Map<number, string[]>
    {
        return this._badgeBases;
    }

    public set badgeBases(bases: Map<number, string[]>)
    {
        this._badgeBases = bases;
    }

    public get badgeSymbols(): Map<number, string[]>
    {
        return this._badgeSymbols;
    }

    public set badgeSymbols(symbols: Map<number, string[]>)
    {
        this._badgeSymbols = symbols;
        this.groupSettings.getBadgePart(0).key = symbols.keys().next().value;
    }

    public get badgePartColors(): Map<number, string>
    {
        return this._badgePartColors;
    }

    public set badgePartColors(colors: Map<number, string>)
    {
        this._badgePartColors = colors;
        this.groupSettings.setPartsColor(colors.keys().next().value);
    }

    public get groupColorsA(): Map<number, string>
    {
        return this._groupColorsA;
    }

    public set groupColorsA(colors: Map<number, string>)
    {
        this._groupColorsA = colors;
        this.groupSettings.colorA = colors.keys().next().value;
    }

    public get groupColorsB(): Map<number, string>
    {
        return this._groupColorsB;
    }

    public set groupColorsB(colors: Map<number, string>)
    {
        this._groupColorsB = colors;
        this.groupSettings.colorB = colors.keys().next().value;
    }

    public get groupCost(): number
    {
        return this._groupCost;
    }

    public set groupCost(cost: number)
    {
        this._groupCost = cost;
    }
}
