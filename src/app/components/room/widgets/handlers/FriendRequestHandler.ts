import { NitroEvent } from '../../../../../client/core/events/NitroEvent';
import { RoomSessionFriendRequestEvent } from '../../../../../client/nitro/session/events/RoomSessionFriendRequestEvent';
import { IRoomWidgetHandler } from '../../../../../client/nitro/ui/IRoomWidgetHandler';
import { IRoomWidgetHandlerContainer } from '../../../../../client/nitro/ui/IRoomWidgetHandlerContainer';
import { RoomWidgetEnum } from '../../../../../client/nitro/ui/widget/enums/RoomWidgetEnum';
import { RoomWidgetUpdateEvent } from '../../../../../client/nitro/ui/widget/events/RoomWidgetUpdateEvent';
import { RoomWidgetMessage } from '../../../../../client/nitro/ui/widget/messages/RoomWidgetMessage';
import { FriendRequestEvent } from '../../../friendlist/events/FriendRequestEvent';
import { RoomWidgetFriendRequestUpdateEvent } from '../events/RoomWidgetFriendRequestUpdateEvent';
import { RoomWidgetFriendRequestMessage } from '../messages/RoomWidgetFriendRequestMessage';

export class FriendRequestHandler implements IRoomWidgetHandler
{
    private _container: IRoomWidgetHandlerContainer = null;
    private _isDisposed: boolean                    = false;

    public dispose(): void
    {
        this._container     = null;
        this._isDisposed    = true;
    }

    public processWidgetMessage(message: RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        if(!message) return null;

        switch(message.type)
        {
            case RoomWidgetFriendRequestMessage.RWFRM_ACCEPT: {
                const widgetMessage = (message as RoomWidgetFriendRequestMessage);

                if(!this._container.friendService) return null;

                this._container.friendService.acceptFriendRequestById(widgetMessage._Str_2951);

                break;
            }
            case RoomWidgetFriendRequestMessage.RWFRM_DECLINE: {
                const widgetMessage = (message as RoomWidgetFriendRequestMessage);

                if(!this._container.friendService) return null;

                this._container.friendService.removeFriendRequestById(widgetMessage._Str_2951);

                break;
            }
        }

        return null;
    }


    public processEvent(event: NitroEvent): void
    {
        if(!event) return;

        switch(event.type)
        {
            case RoomSessionFriendRequestEvent.RSFRE_FRIEND_REQUEST: {
                const friendRequestEvent = (event as RoomSessionFriendRequestEvent);

                this._container.events.dispatchEvent(new RoomWidgetFriendRequestUpdateEvent(RoomWidgetFriendRequestUpdateEvent.RWFRUE_SHOW_FRIEND_REQUEST, friendRequestEvent.requestId, friendRequestEvent.userId, friendRequestEvent.userName));

                return;
            }
            case FriendRequestEvent.ACCEPTED:
            case FriendRequestEvent.DECLINED: {
                const friendRequestEvent = (event as FriendRequestEvent);

                this._container.events.dispatchEvent(new RoomWidgetFriendRequestUpdateEvent(RoomWidgetFriendRequestUpdateEvent.RWFRUE_HIDE_FRIEND_REQUEST, friendRequestEvent.requestId));

                return;
            }
        }
    }

    public update(): void
    {
    }


    public get disposed(): boolean
    {
        return this._isDisposed;
    }

    public get type(): string
    {
        return RoomWidgetEnum.FRIEND_REQUEST;
    }

    public set container(k: IRoomWidgetHandlerContainer)
    {
        this._container = k;
    }

    public get messageTypes(): string[]
    {
        return [
            RoomWidgetFriendRequestMessage.RWFRM_ACCEPT,
            RoomWidgetFriendRequestMessage.RWFRM_DECLINE
        ];
    }

    public get eventTypes(): string[]
    {
        return [
            RoomSessionFriendRequestEvent.RSFRE_FRIEND_REQUEST,
            FriendRequestEvent.ACCEPTED,
            FriendRequestEvent.DECLINED
        ];
    }
}
