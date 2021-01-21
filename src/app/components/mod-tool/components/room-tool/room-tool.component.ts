import {Component, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output} from '@angular/core';
import {ModTool} from "../tool.component";

@Component({
	selector: 'nitro-mod-tool-room-component',
	templateUrl: './room-tool.template.html'
})
export class ModToolRoomComponent extends ModTool implements OnInit, OnDestroy
{

	constructor()
	{
		super();
	}

	public ngOnInit(): void
	{
	}

	public ngOnDestroy(): void
	{
	}

}
