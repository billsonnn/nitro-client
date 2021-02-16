import { Component, Input } from '@angular/core';
import GroupSettings from '../../../../common/GroupSettings';

@Component({
    selector: 'nitro-group-creator-tab-confirmation-component',
    templateUrl: './tab-confirmation.template.html'
})
export class GroupCreatorTabConfirmationComponent
{
    @Input()
    public groupSettings: GroupSettings;

    @Input()
    public groupCost: number;
    
    @Input()
    public groupColorsA: Map<number, string>;

    @Input()
    public groupColorsB: Map<number, string>;

    constructor()
    {}
}
