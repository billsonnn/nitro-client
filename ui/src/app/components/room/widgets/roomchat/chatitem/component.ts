import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { RoomWidgetChatUpdateEvent } from '../..//events/RoomWidgetChatUpdateEvent';

@Component({
    template: `
    <div #chatItem class="nitro-room-chat-item-component chat-style-{{ chatStyle }} chat-type-{{ chatType }}">
        <div class="chat-left" [ngStyle]="{ 'background-color': senderColorString }">
            <div #chatItemUserImage class="user-image"></div>
            <div class="user-pointer"></div>
        </div>
        <div class="chat-right">
            <b>{{ senderName }}:</b> {{ message }}
        </div>
        <div class="chat-pointer"></div>
    </div>`
})
export class RoomChatItemComponent
{
    @Input()
    public id: string;

    @ViewChild('chatItem')
    public chatItemReference: ElementRef<HTMLDivElement>;

    @ViewChild('chatItemUserImage')
    public chatItemUserImageReference: ElementRef<HTMLDivElement>;

    public chatType: number;
    public chatStyle: number;
    public senderId: number;
    public senderName: string;
    public message: string;
    public messageLinks: string[];
    public timeStamp: number;
    public senderX: number;
    public senderImage: HTMLImageElement;
    public senderColor: number;
    public senderColorString: string;
    public roomId: number;
    public userType: number;
    public petType: number;
    public senderCategory: number;
    public x: number;
    public y: number;

    public update(k: RoomWidgetChatUpdateEvent): void
    {
        this.chatType           = k.chatType;
        this.chatStyle          = k.styleId;
        this.senderId           = k.userId;
        this.senderName         = k.userName;
        this.senderCategory     = k.userCategory;
        this.message            = k.text;
        this.messageLinks       = k.links;
        this.senderX            = k.userX;
        this.senderImage        = k.userImage;
        this.senderColor        = k.userColor;
        this.senderColorString  = (this.senderColor && ('#' + (this.senderColor.toString(16).padStart(6, '0'))) || null);
        this.roomId             = k.roomId;
        this.userType           = k.userType;
        this.petType            = k.petType;
    }

    public ready(): void
    {
        this.insertSenderImage();

        this.makeVisible();
    }

    public makeVisible(): void
    {
        (this.chatElement && (this.chatElement.style.visibility = 'visible'));
    }

    private insertSenderImage(): void
    {
        if(!this.senderImage) return;

        const imageElement  = document.createElement('img');
        const scale         = 0.5;

        imageElement.src = this.senderImage.src;

        imageElement.onload = (() =>
        {
            imageElement.height                     = (imageElement.height * scale);
            imageElement.parentElement.style.width  = (((imageElement.width * scale) / 2) + 'px');
            imageElement.parentElement.style.height = (((imageElement.height * scale) / 2) + 'px');
            imageElement.style.marginLeft           = (((-((imageElement.width * scale) / 4)) - imageElement.parentElement.offsetLeft) + 'px');
            // imageElement.style.marginLeft   = (imageElement.offsetLeft - ((this.senderImage.width * scale) / 2) + 'px');
            // imageElement.style.marginTop    = (imageElement.offsetTop - ((this.senderImage.height * scale) / 2) + 'px');
        });

        this.chatItemUserImageReference.nativeElement.appendChild(imageElement);
    }

    public getX(): number
    {
        return this.x;
    }

    public setX(x: number): void
    {
        if(!this.chatElement) return;

        this.x = x;

        this.chatElement.style.left = (x + 'px');
    }

    public getY(): number
    {
        return this.y;
    }

    public setY(y: number): void
    {
        if(!this.chatElement) return;

        y = y - 1;

        this.y = y;

        this.chatElement.style.top = (y + 'px');
    }

    public get width(): number
    {
        return ((this.chatElement && this.chatElement.offsetWidth) || 0);
    }

    public get height(): number
    {
        return ((this.chatElement && this.chatElement.offsetHeight) || 0);
    }

    public get chatElement(): HTMLDivElement
    {
        return ((this.chatItemReference && this.chatItemReference.nativeElement) || null);
    }

    public get chatUserImageElement(): HTMLDivElement
    {
        return ((this.chatItemUserImageReference && this.chatItemUserImageReference.nativeElement) || null);
    }
}