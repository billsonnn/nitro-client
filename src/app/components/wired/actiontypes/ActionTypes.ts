import { Triggerable } from '../../../../client/nitro/communication/messages/incoming/roomevents/Triggerable';
import { IUserDefinedRoomEventsCtrl } from '../IUserDefinedRoomEventsCtrl';
import { WiredFurniture } from '../WiredFurniture';
import { BotChangeFigure } from './BotChangeFigure';
import { BotFollowAvatar } from './BotFollowAvatar';
import { BotGiveHandItem } from './BotGiveHandItem';
import { BotMove } from './BotMove';
import { BotTalk } from './BotTalk';
import { BotTalkDirectToAvatar } from './BotTalkDirectToAvatar';
import { BotTeleport } from './BotTeleport';
import { CallAnotherStack } from './CallAnotherStack';
import { Chase } from './Chase';
import { Chat } from './Chat';
import { Flee } from './Flee';
import { GiveReward } from './GiveReward';
import { GiveScore } from './GiveScore';
import { GiveScoreToPredefinedTeam } from './GiveScoreToPredefinedTeam';
import { JoinTeam } from './JoinTeam';
import { KickFromRoom } from './KickFromRoom';
import { LeaveTeam } from './LeaveTeam';
import { MoveFurni } from './MoveFurni';
import { MoveFurniTo } from './MoveFurniTo';
import { MoveToDirection } from './MoveToDirection';
import { MuteUser } from './MuteUser';
import { Reset } from './Reset';
import { SetFurniStateTo } from './SetFurniStateTo';
import { Teleport } from './Teleport';
import { ToggleFurniState } from './ToggleFurniState';
import { ToggleToRandomState } from './ToggleToRandomState';

export class ActionTypes implements IUserDefinedRoomEventsCtrl
{
    private _types: WiredFurniture[];

    constructor()
    {
        this._types = [];

        this._types.push(new ToggleFurniState());
        this._types.push(new Reset());
        this._types.push(new SetFurniStateTo());
        this._types.push(new MoveFurni());
        this._types.push(new GiveScore());
        this._types.push(new Chat());
        this._types.push(new Teleport());
        this._types.push(new JoinTeam());
        this._types.push(new LeaveTeam());
        this._types.push(new Chase());
        this._types.push(new Flee());
        this._types.push(new MoveToDirection());
        this._types.push(new GiveScoreToPredefinedTeam());
        this._types.push(new ToggleToRandomState());
        this._types.push(new MoveFurniTo());
        this._types.push(new GiveReward());
        this._types.push(new CallAnotherStack());
        this._types.push(new KickFromRoom());
        this._types.push(new MuteUser());
        this._types.push(new BotTeleport());
        this._types.push(new BotMove());
        this._types.push(new BotTalk());
        this._types.push(new BotGiveHandItem());
        this._types.push(new BotFollowAvatar());
        this._types.push(new BotChangeFigure());
        this._types.push(new BotTalkDirectToAvatar());
    }

    public get _Str_24294(): WiredFurniture[]
    {
        return this._types;
    }

    public _Str_9781(code: number): WiredFurniture
    {
        for(let action of this._types)
        {
            if(action.code !== code) continue;

            return action;
        }

        return null;
    }

    public _Str_15652(code: number): WiredFurniture
    {
        return this._Str_9781(code);
    }

    public _Str_14545(trigger: Triggerable): boolean
    {
        return (trigger instanceof Triggerable);
    }

    public _Str_1196(): string
    {
        return 'action';
    }
}