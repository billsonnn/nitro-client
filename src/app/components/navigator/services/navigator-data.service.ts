import { Injectable, OnDestroy } from '@angular/core';
import { ILinkEventTracker } from '../../../../client/core/events/ILinkEventTracker';
import {RoomDataParser} from '../../../../client/nitro/communication/messages/parser/room/data/RoomDataParser';

// see NavigatorData
@Injectable()
export class NavigatorDataService
{
    private _currentRoomOwner: boolean = false;


    public get currentRoomOwner(): boolean
    {
        return this._currentRoomOwner;
    }

    public set currentRoomOwner(isOwner: boolean)
    {
        this._currentRoomOwner = isOwner;
    }

}
