import { Component, Input, ViewChild } from '@angular/core';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { Nitro } from '../../../../client/nitro/Nitro';
import { RoomObjectCategory } from '../../../../client/nitro/room/object/RoomObjectCategory';
import { ChatHistoryItem } from '../common/ChatHistoryItem';
import { ChatHistoryService } from '../services/chat-history.service';

@Component({
    selector: 'nitro-chat-history-component',
    templateUrl: './chat-history.template.html'
})
export class ChatHistoryComponent
{
    @ViewChild('threadScroller')
    public historyScroller: PerfectScrollbarComponent;

    @Input()
    public visible: boolean;

    constructor(
        private _chatHistoryService: ChatHistoryService)
    {}

    public selectUser(userId: number | null): void
    {
        if(!userId) return;

        const currentRoomId = Nitro.instance.roomEngine.activeRoomId;
        Nitro.instance.roomEngine.selectRoomObject(currentRoomId, userId, RoomObjectCategory.UNIT);
    }

    public get items(): ChatHistoryItem[]
    {
        return this._chatHistoryService.historyItems;
    }
}