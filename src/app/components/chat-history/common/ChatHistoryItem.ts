export class ChatHistoryItem
{
    private _isRoomName: boolean;
    private _content: string;
    private _timestamp: number;
    
    private _senderId: number;
    private _senderName: string;
    private _senderColor: number;
    private _senderImage: HTMLImageElement;
    private _chatType: number;
    private _chatStyle: number;

    constructor(isRoomName: boolean, content: string, timestamp: number, senderId: number = 0, senderName: string = null, senderColor: number = 0, senderImage: HTMLImageElement = null, chatType: number = 0, chatStyle: number = 0)
    {
        this._isRoomName = isRoomName;
        this._content = content;
        this._timestamp = timestamp;
        this._senderId = senderId;
        this._senderName = senderName;
        this._senderColor = senderColor;
        this._senderImage = senderImage;
        this._chatType = chatType;
        this._chatStyle = chatStyle;
    }

    public get isRoomName(): boolean
    {
        return this._isRoomName;
    }

    public get content(): string
    {
        return this._content;
    }

    public get timestamp(): string
    {
        let date = new Date(this._timestamp);
        const formattedTimestamp = ( (date.getHours() <= 9 ? "0" + date.getHours() : date.getHours()) + ":" + (date.getMinutes() <= 9 ? "0" + date.getMinutes() : date.getMinutes()) + ":" + (date.getSeconds() <= 9 ? "0" + date.getSeconds() : date.getSeconds()) ).toString();
        
        return formattedTimestamp;
    }

    public get senderId(): number
    {
        return this._senderId;
    }

    public get senderName(): string
    {
        return this._senderName;
    }

    public get senderColorString(): string
    {
        return (this._senderColor && ('#' + (this._senderColor.toString(16).padStart(6, '0'))) || null);
    }

    public get senderImage(): HTMLImageElement
    {
        return this._senderImage;
    }

    public get chatType(): number
    {
        return this._chatType;
    }

    public get chatStyle(): number
    {
        return this._chatStyle;
    }
}