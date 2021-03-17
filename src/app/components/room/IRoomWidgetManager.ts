import { IRoomWidgetHandlerContainer } from 'nitro-renderer/src/nitro/ui/IRoomWidgetHandlerContainer';
import { FriendListService } from '../friendlist/services/friendlist.service';
import { NotificationService } from '../notification/services/notification.service';
import { WiredService } from '../wired/services/wired.service';

export interface IRoomWidgetManager extends IRoomWidgetHandlerContainer
{
    notificationService: NotificationService;
    wiredService: WiredService;
    friendService: FriendListService;
}
