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

    public setCurrentIndexToRoomId(roomId: number): void
    {
        const visitedRooms = NavigatorDataService._visitedRooms;
        for(let i = 0; i < visitedRooms.length; i++)
        {
            const room = visitedRooms[i];
            if(room && room.roomId == roomId) {
                this._currentVisitedRoomIndex = i;
            }
        }
    }

    public canGoBack(): boolean
    {
        return this._currentVisitedRoomIndex != 0;
    }

    public canGoForward(): boolean
    {
        return this._currentVisitedRoomIndex < (NavigatorDataService._visitedRooms.length - 1);
    }

    public getPreviousRoomId(): number
    {
        const indexToGoTo = (this._currentVisitedRoomIndex - 1 < 0) ? 0 : (this._currentVisitedRoomIndex - 1);

        const room = NavigatorDataService._visitedRooms[indexToGoTo];

        if(!room) return null;

        return room.roomId;
    }

    public getNextRoomId(): number
    {
        if(this._currentVisitedRoomIndex == (NavigatorDataService._visitedRooms.length - 1)) return null;

        const indexToGoTo = this._currentVisitedRoomIndex + 1;

        const room = NavigatorDataService._visitedRooms[indexToGoTo];

        if(!room) return null;

        return room.roomId;
    }

}
