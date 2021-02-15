import { Component, EventEmitter, Input, Output } from '@angular/core';
import GroupBadgePart from '../../../../common/GroupBadgePart';

@Component({
    selector: '[nitro-group-image-selector-component]',
    templateUrl: './image-selector.template.html'
})
export class GroupCreatorImageSelectorComponent
{
    @Input()
    public items: Map<number, string[]>;

    @Input()
    public part: GroupBadgePart;

    @Output()
    onSelect: EventEmitter<any> = new EventEmitter();

    public getBadgeCode(id: number): string
    {
        return ((this.part.isBase ? 'b' : 's') + (id <= 9 ? '0' + id : id) + (this.part.color <= 9 ? '0' + this.part.color : this.part.color) + (this.part.isBase ? '' : 4));
    }

    public selectPart(id: number): void
    {
        this.onSelect.emit(id);
    }
}
