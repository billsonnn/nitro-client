import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { AdvancedMap } from '../../../../client/core/utils/AdvancedMap';
import { Nitro } from '../../../../client/nitro/Nitro';
import { RoomObjectCategory } from '../../../../client/nitro/room/object/RoomObjectCategory';
import { SettingsService } from '../../../core/settings/service';
import { ChatHistoryItem } from '../common/ChatHistoryItem';
import { ChatHistorySet } from '../common/ChatHistorySet';
import { ChatHistoryService } from '../services/chat-history.service';

@Component({
    selector: 'nitro-chat-history-component',
    templateUrl: './chat-history.template.html'
})
export class ChatHistoryComponent implements OnChanges
{
    @ViewChild('historyScroller')
    public historyScroller: PerfectScrollbarComponent;

    @Input()
    public visible: boolean;

    constructor(
        private _settingsService: SettingsService,
        private _chatHistoryService: ChatHistoryService)
    {}

    public ngOnChanges(changes: SimpleChanges): void
    {
        const prev  = changes.visible.previousValue;
        const next  = changes.visible.currentValue;

        if(next && (next !== prev))
        {
            setTimeout(() => this.scrollToBottom(), 1);
        }
    }

    public hide(): void
    {
        this._settingsService.hideChatHistory();
    }

    public selectUser(userId: number | null): void
    {
        if(!userId) return;

        const currentRoomId = Nitro.instance.roomEngine.activeRoomId;
        Nitro.instance.roomEngine.selectRoomObject(currentRoomId, userId, RoomObjectCategory.UNIT);
    }

    public trackById(index: number, item: ChatHistorySet | ChatHistoryItem): number
    {
        return item.id;
    }

    private scrollToBottom(): void
    {
        if(!this.historyScroller) return;

        console.log('scroll');

        this.historyScroller.directiveRef.scrollToBottom(0);
    }

    public get historySets(): AdvancedMap<number, ChatHistorySet>
    {
        return this._chatHistoryService.historySets;
    }
}