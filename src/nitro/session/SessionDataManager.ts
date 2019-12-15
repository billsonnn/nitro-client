import { NitroManager } from '../../core/common/NitroManager';
import { INitroCommunicationManager } from '../communication/INitroCommunicationManager';
import { UserInfoEvent } from '../communication/messages/incoming/user/data/UserInfoEvent';
import { ISessionDataManager } from './ISessionDataManager';

export class SessionDataManager extends NitroManager implements ISessionDataManager
{
    private _communication: INitroCommunicationManager;

    private _userId: number;
    private _name: string;
    private _figure: string;
    private _gender: string;

    constructor(communication: INitroCommunicationManager)
    {
        super();
        
        this._communication = communication;

        this.resetUserInfo();
    }

    protected onInit(): void
    {
        this._communication.registerMessageEvent(new UserInfoEvent(this.onUserInfoEvent.bind(this)));
    }

    private resetUserInfo(): void
    {
        this._userId    = 0;
        this._name      = null;
        this._figure    = null;
        this._gender    = null;
    }

    private onUserInfoEvent(event: UserInfoEvent): void
    {
        if(!(event instanceof UserInfoEvent) || !event.connection) return;

        this.resetUserInfo();

        const userInfo = event.getParser().userInfo;

        if(!userInfo) return;

        this._userId    = userInfo.userId;
        this._name      = userInfo.username;
        this._figure    = userInfo.figure;
        this._gender    = userInfo.gender;
    }

    public get communication(): INitroCommunicationManager
    {
        return this._communication;
    }

    public get userId(): number
    {
        return this._userId;
    }

    public get userName(): string
    {
        return this._name;
    }

    public get figure(): string
    {
        return this._figure;
    }

    public get gender(): string
    {
        return this._gender;
    }
}