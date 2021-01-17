import { AfterViewInit, Component, ElementRef, Input, NgZone, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { FollowFriendComposer } from '../../../../../client/nitro/communication/messages/outgoing/friendlist/FollowFriendComposer';
import { SendMessageComposer } from '../../../../../client/nitro/communication/messages/outgoing/friendlist/SendMessageComposer';
import { SetRelationshipStatusComposer } from '../../../../../client/nitro/communication/messages/outgoing/friendlist/SetRelationshipStatusComposer';
import { Nitro } from '../../../../../client/nitro/Nitro';
import { SettingsService } from '../../../../core/settings/service';
import { MessengerChat } from '../../common/MessengerChat';
import { MessengerFriend } from '../../common/MessengerFriend';
import { MessengerThread } from '../../common/MessengerThread';
import { RelationshipStatusEnum } from '../../common/RelationshipStatusEnum';
import { FriendListService } from '../../services/friendlist.service';

@Component({
    selector: '[nitro-friendlist-thread-viewer-component]',
    templateUrl: './thread-viewer.template.html'
})
    
export class FriendListThreadViewerComponent implements OnChanges,AfterViewInit,OnInit
{
    @Input()
    public thread: MessengerThread = null;

    @ViewChild('threadInput')
    public threadInput: ElementRef<HTMLInputElement>;

    @ViewChild('threadScroller')
    public threadScroller: PerfectScrollbarComponent;

    public relations: Array<string>;
    

    constructor(
        private _friendListService: FriendListService,
        private _settingsService: SettingsService,
        private _ngZone: NgZone)
    { }
    
    public ngOnInit(): void
    {
        this.relations = RelationshipStatusEnum.relations;
    }

    public ngOnChanges(changes: SimpleChanges): void
    {
        const prev = changes.thread.previousValue;
        const next = changes.thread.currentValue;

        if(next && (next !== prev)) this.prepareThread();
        
    }

    private prepareThread(): void
    {
        //
    }

    public ngAfterViewInit(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            document.body.addEventListener('keydown', this.onKeyDownEvent.bind(this));
            
            this._friendListService.scroller = this.threadScroller;

        });
    }

    public sendMessage(message: string): void
    {
        if(!this.participantOther || !message) return;

        this._ngZone.run(() =>
        {
            this.thread.insertChat(this.participantSelf.id, message, 0, null);

            setTimeout(() => { this._friendListService.scroller.directiveRef.scrollToBottom(0, 300) }, 1);
        });
        
        Nitro.instance.communication.connection.send(new SendMessageComposer(this.participantOther.id, message));
    }

    public changeRelation(relation: number): void
    {
        if (!this.participantOther || relation == null) return;

        Nitro.instance.communication.connection.send(new SetRelationshipStatusComposer(this.participantOther.id, relation));
    }

    public followFriend(friend: number): void
    { 
        if (!this.participantOther || !friend) return;

        this._settingsService.toggleFriendList();

        Nitro.instance.communication.connection.send(new FollowFriendComposer(friend));
    }

    private onKeyDownEvent(event: KeyboardEvent): void
    {
        if(!event) return;

        if(this.anotherInputHasFocus()) return;

        const input = this.threadInput && this.threadInput.nativeElement;

        if(document.activeElement !== input) this.setInputFocus();

        const key       = event.keyCode;

        switch(key)
        {
            case 13: // ENTER
                this.sendMessage(this.threadInput.nativeElement.value);
                this.threadInput.nativeElement.value = null;
                return;
        }
    }

    private anotherInputHasFocus(): boolean
    {
        const activeElement = document.activeElement;

        if(!activeElement) return false;

        if(this.threadInput && this.threadInput.nativeElement && (this.threadInput.nativeElement === activeElement)) return false;

        if((!(activeElement instanceof HTMLInputElement) && !(activeElement instanceof HTMLTextAreaElement))) return false;

        return true;
    }

    private setInputFocus(): void
    {
        const input = this.threadInput && this.threadInput.nativeElement;
        
        if(!input) return;
        
        input.focus();

        input.setSelectionRange((input.value.length * 2), (input.value.length * 2));
    }

    public get inputView(): HTMLInputElement
    {
        return ((this.threadInput && this.threadInput.nativeElement) || null);
    }

    public get participantSelf(): MessengerFriend
    {
        return this.thread.participantSelf;
    }

    public get participantOther(): MessengerFriend
    {
        return this.thread.participantOther;
    }

    public get chats(): MessengerChat[]
    {
        return this.thread.chats;
    }
}