import { Component, Input, Output } from '@angular/core';
import GroupSettings from '../../../../common/GroupSettings';

@Component({
    selector: 'nitro-group-creator-tab-colors-component',
    templateUrl: './tab-colors.template.html'
})
export class GroupCreatorTabColorsComponent
{
    @Input()
    @Output()
    public groupSettings: GroupSettings;

    @Input()
    public groupColorsA: Map<number, string>;

    @Input()
    public groupColorsB: Map<number, string>;

    constructor()
    {}
}
