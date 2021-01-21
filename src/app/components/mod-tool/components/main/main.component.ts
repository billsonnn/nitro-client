import { Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ModToolService } from '../../services/mod-tool.service';
import { SettingsService } from '../../../../core/settings/service';

@Component({
    selector: 'nitro-mod-tool-main-component',
    templateUrl: './main.template.html'
})
export class ModToolMainComponent implements OnInit, OnDestroy
{
	@Input()
	public visible: boolean = false;

	public roomToolVisible: boolean = false;
	public chatlogToolVisible: boolean = false;
	public userToolVisible: boolean = false;
	public reportsToolVisible: boolean = false;

	constructor(
		private _settingsService: SettingsService,
        private _modToolService: ModToolService,
        private _ngZone: NgZone)
	{}

	public ngOnInit(): void
	{
	    this._modToolService.component = this;
	}

	public ngOnDestroy(): void
	{
	    this._modToolService.component = null;
	}

	public toggleRoomTool(): void
	{
		this.roomToolVisible = !this.roomToolVisible;
	}

	public toggleChatlogTool(): void
	{
		this.chatlogToolVisible = !this.chatlogToolVisible;
	}

	public toggleUserTool(): void
	{
		this.userToolVisible = !this.userToolVisible;
	}

	public toggleReportsTool(): void
	{
		this.reportsToolVisible = !this.reportsToolVisible;
	}
}
