import { Injectable, OnDestroy } from '@angular/core';
import { ILinkEventTracker } from '../../../../client/core/events/ILinkEventTracker';
import { RoomDataParser } from '../../../../client/nitro/communication/messages/parser/room/data/RoomDataParser';

// see NavigatorData
@Injectable()
export class NavigatorDataService
{
    private static _visitedRooms: RoomDataParser[] = [];

    private _currentRoomOwner: boolean = false;
    private _currentVisitedRoomIndex = 0;


    public get currentRoomOwner(): boolean
    {
        return this._currentRoomOwner;
    }

    public set currentRoomOwner(isOwner: boolean)
    {
        this._currentRoomOwner = isOwner;
    }

    public getVisitedRooms(): RoomDataParser[]
    {
        return NavigatorDataService._visitedRooms;
    }

    public addRoomToVisitedRooms(room: RoomDataParser)
    {
        NavigatorDataService._visitedRooms.push(room);

        // TODO: 10
        if(NavigatorDataService._visitedRooms.length > 3)
        {
            NavigatorDataService._visitedRooms.shift();
        }

        // This might break
        this._currentVisitedRoomIndex = NavigatorDataService._visitedRooms.length > 0 ? NavigatorDataService._visitedRooms.length - 1 : 0;
    }

}
