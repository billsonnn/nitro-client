import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GroupItem } from '../../../components/inventory/items/GroupItem';

@Component({
	selector: '[nitro-furniture-grid-component]',
	template: `
	<div class="grid-container">
		<div class="grid-items">
			<div class="item-detail" *ngFor="let groupItem of list" [ngClass]="{ 'unseen': groupItem.hasUnseenItems, 'active': (selected === groupItem) }" [ngStyle]="{ 'opacity': (!groupItem.getUnlockedCount() ? '0.5' : '1') }" (click)="selectGroup(groupItem)">
				<div class="detail-image" [ngStyle]="{ 'background-image': getIconUrl(groupItem) }"></div>
				<div class="badge badge-secondary" *ngIf="!groupItem.stuffData.uniqueNumber">x{{ groupItem.getUnlockedCount() }}</div>
				<div class="badge badge-secondary" *ngIf="groupItem.stuffData.uniqueNumber">{{ groupItem.stuffData.uniqueNumber }}</div>
			</div>
		</div>
	</div>`
})
export class FurnitureGridComponent
{
	@Input()
	public list: GroupItem[];

	@Input()
	public selected: GroupItem;

	@Output()
	public selectedChange: EventEmitter<GroupItem> = new EventEmitter();

	public selectGroup(groupItem: GroupItem): void
	{
		if(!groupItem) return;

		this.selectedChange.emit(groupItem);
	}

	public getIconUrl(groupItem: GroupItem): string
    {
        const imageUrl = ((groupItem && groupItem.iconUrl) || null);

        if(imageUrl && (imageUrl !== '')) return `url('${ imageUrl }')`;

        return null;
    }
}